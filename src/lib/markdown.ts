// Escape helpers
const ESCAPE_CHARS = '\\`*_{}[]<>()#+-.!|';
const ESCAPE_MAP = new Map<string, string>();
const UNESCAPE_MAP = new Map<string, string>();
for (let i = 0; i < ESCAPE_CHARS.length; i++) {
  const placeholder = String.fromCharCode(0xe000 + i);
  ESCAPE_MAP.set('\\' + ESCAPE_CHARS[i], placeholder);
  UNESCAPE_MAP.set(placeholder, ESCAPE_CHARS[i]);
}

export type ContentBlockType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'paragraph'
  | 'code-block'
  | 'blockquote'
  | 'ul-item'
  | 'ol-item';

export interface InlineRange {
  start: number;
  end: number;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: boolean;
  url?: string;
}

export interface HrBlock {
  type: 'hr';
}

export interface ContentBlock {
  type: ContentBlockType;
  text: string;
  depth?: number;
  inlineRanges?: InlineRange[];
}

export type ParsedBlock = HrBlock | ContentBlock;

interface CodePart {
  placeholder: string;
  text: string;
}

interface LinkPart {
  placeholder: string;
  text: string;
  url: string;
  title?: string;
}

interface ReferenceLink {
  url: string;
  title?: string;
}

function escapePreProcess(text: string): string {
  let out = text;
  for (const [seq, ph] of ESCAPE_MAP) {
    out = out.replaceAll(seq, ph);
  }
  return out;
}

function escapePostProcess(text: string): string {
  let out = text;
  for (const [ph, ch] of UNESCAPE_MAP) {
    out = out.replaceAll(ph, ch);
  }
  return out;
}

// Inline formatting
// Appends to linkParts and returns its placeholder; the side effect is the point.
function registerLinkPlaceholder(
  linkParts: LinkPart[],
  text: string,
  url: string,
  title?: string,
): string {
  const index = linkParts.length;
  const placeholder = `\uF100${index}\uF101`;
  linkParts.push({placeholder, text, url, title});
  return placeholder;
}

function parseInlineFormatting(rawText: string): {
  plain: string;
  ranges: InlineRange[];
} {
  let text = escapePreProcess(rawText);
  let plain = '';
  const ranges: InlineRange[] = [];

  const codeParts: CodePart[] = [];
  let codeIdx = 0;
  text = text.replace(
    /``(.+?)``|`([^`]+)`/g,
    (_m: string, g1: string | undefined, g2: string | undefined) => {
      const placeholder = `\uF000${codeIdx}\uF001`;
      codeParts.push({placeholder, text: g1 ?? g2 ?? ''});
      codeIdx++;
      return placeholder;
    },
  );

  text = text.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_m: string, alt: string) => alt,
  );

  const linkParts: LinkPart[] = [];
  text = text.replace(
    /\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_m: string, txt: string, url: string, title: string | undefined) =>
      registerLinkPlaceholder(linkParts, txt, url, title),
  );

  text = text.replace(/<(https?:\/\/[^>]+)>/g, (_m: string, url: string) =>
    registerLinkPlaceholder(linkParts, url, url),
  );
  text = text.replace(
    /<([^@>\s]+@[^@>\s]+\.[^>\s]+)>/g,
    (_m: string, email: string) =>
      registerLinkPlaceholder(linkParts, email, `mailto:${email}`),
  );

  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(
    /<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
    (_m: string, url: string, txt: string) =>
      registerLinkPlaceholder(linkParts, txt, url),
  );

  const emphRegex =
    /\*\*\*(.+?)\*\*\*|___(.+?)___|__\*(.+?)\*__|\*\*_(.+?)_\*\*|\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|(?<=\s|^)_(.+?)_(?=\s|$|[.,;:!?)])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = emphRegex.exec(text)) !== null) {
    plain += text.slice(lastIndex, match.index);
    const start = plain.length;

    const boldItalicContent = match[1] ?? match[2] ?? match[3] ?? match[4];
    if (boldItalicContent !== undefined) {
      plain += boldItalicContent;
      ranges.push({start, end: plain.length, bold: true, italic: true});
    } else if (match[5] !== undefined || match[6] !== undefined) {
      plain += match[5] ?? match[6];
      ranges.push({start, end: plain.length, bold: true, italic: false});
    } else {
      plain += match[7] ?? match[8];
      ranges.push({start, end: plain.length, bold: false, italic: true});
    }
    lastIndex = match.index + match[0].length;
  }
  plain += text.slice(lastIndex);

  plain = escapePostProcess(plain);

  for (const cp of codeParts) {
    const idx = plain.indexOf(cp.placeholder);
    if (idx === -1) continue;
    plain = plain.replace(cp.placeholder, cp.text);
    ranges.push({start: idx, end: idx + cp.text.length, code: true});
  }
  for (const lp of linkParts) {
    const idx = plain.indexOf(lp.placeholder);
    if (idx === -1) continue;
    plain = plain.replace(lp.placeholder, lp.text);
    ranges.push({
      start: idx,
      end: idx + lp.text.length,
      link: true,
      url: lp.url,
    });
  }

  ranges.sort((a, b) => a.start - b.start);
  return {plain, ranges};
}

// Block parser
const HR_RE =
  /^([*][\s*]*[*][\s*]*[*][\s*]*|[-][\s-]*[-][\s-]*[-][\s-]*|[_][\s_]*[_][\s_]*[_][\s_]*)$/;
const SETEXT_H1_RE = /^=+\s*$/;
const SETEXT_H2_RE = /^-+\s*$/;
const OL_RE = /^(\d+)\.\s+(.*)/;
const REF_LINK_RE =
  /^\[([^\]]+)\]:\s+<?([^\s>]+)>?(?:\s+["'(]([^"')]+)["')])?$/;

function isIndentedCodeLine(line: string): boolean {
  return line.startsWith('    ') || line.startsWith('\t');
}

function collectReferenceLinks(lines: string[]): Map<string, ReferenceLink> {
  const referenceLinks = new Map<string, ReferenceLink>();
  for (const line of lines) {
    const m = line.match(REF_LINK_RE);
    if (m) {
      referenceLinks.set(m[1].toLowerCase(), {url: m[2], title: m[3]});
    }
  }
  return referenceLinks;
}

// Expands reference-style links against the collected definitions, then runs
// the inline pass to produce plain text plus its formatting ranges.
function resolveInlineContent(
  block: ParsedBlock,
  referenceLinks: Map<string, ReferenceLink>,
): ParsedBlock {
  if (block.type === 'hr') return block;
  let text = block.text;
  if (referenceLinks.size > 0) {
    text = text.replace(
      /\[([^\]]+)\]\[([^\]]*)\]/g,
      (m: string, txt: string, id: string) => {
        const key = (id || txt).toLowerCase();
        const ref = referenceLinks.get(key);
        return ref
          ? `[${txt}](${ref.url}${ref.title ? ` "${ref.title}"` : ''})`
          : m;
      },
    );
  }
  const {plain, ranges} = parseInlineFormatting(text);
  return {
    ...block,
    text: plain,
    ...(ranges.length > 0 ? {inlineRanges: ranges} : {}),
  };
}

export function parseMarkdown(md: string): ParsedBlock[] {
  const lines = md.split('\n');
  const referenceLinks = collectReferenceLinks(lines);

  const blocks: ParsedBlock[] = [];
  let paragraphLines: string[] = [];
  let i = 0;

  function flushParagraph(): void {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines
      .map(l => (l.endsWith('  ') ? l.replace(/ {2,}$/, '\n') : l))
      .join(' ')
      .replace(/ \n/g, '\n');
    blocks.push({type: 'paragraph', text});
    paragraphLines = [];
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const escapedLine = escapePreProcess(line);

    if (REF_LINK_RE.test(line)) {
      i++;
      continue;
    }

    if (trimmed !== '' && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      if (SETEXT_H1_RE.test(nextLine)) {
        flushParagraph();
        blocks.push({type: 'h1', text: trimmed});
        i += 2;
        continue;
      }
      if (SETEXT_H2_RE.test(nextLine) && !HR_RE.test(trimmed)) {
        flushParagraph();
        blocks.push({type: 'h2', text: trimmed});
        i += 2;
        continue;
      }
    }

    if (HR_RE.test(trimmed)) {
      flushParagraph();
      blocks.push({type: 'hr'});
      i++;
      continue;
    }

    if (trimmed === '') {
      flushParagraph();
      i++;
      continue;
    }

    const heading = escapedLine.match(/^(#{1,6}) /);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      blocks.push({
        type: `h${level}` as ContentBlockType,
        text: line.slice(level + 1),
      });
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      flushParagraph();
      let depth = 0;
      let content = line;
      while (content.startsWith('>')) {
        depth++;
        content = content.slice(1);
        if (content.startsWith(' ')) {
          content = content.slice(1);
        }
      }
      blocks.push({type: 'blockquote', text: content, depth});
      i++;
      continue;
    }

    if (isIndentedCodeLine(line)) {
      flushParagraph();
      const codeLines: string[] = [];
      while (i < lines.length && isIndentedCodeLine(lines[i])) {
        codeLines.push(
          lines[i].startsWith('\t') ? lines[i].slice(1) : lines[i].slice(4),
        );
        i++;
      }
      blocks.push({type: 'code-block', text: codeLines.join('\n')});
      continue;
    }

    if (/^[-*+] /.test(line)) {
      flushParagraph();
      blocks.push({type: 'ul-item', text: '\u2022 ' + line.slice(2)});
      i++;
      continue;
    }

    const olMatch = line.match(OL_RE);
    if (olMatch) {
      flushParagraph();
      blocks.push({type: 'ol-item', text: olMatch[1] + '. ' + olMatch[2]});
      i++;
      continue;
    }

    paragraphLines.push(line);
    i++;
  }

  flushParagraph();

  return blocks.map(block => resolveInlineContent(block, referenceLinks));
}
