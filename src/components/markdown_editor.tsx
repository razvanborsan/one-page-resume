import {memo} from 'react';
import {Label, TextArea, TextField} from 'react-aria-components';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor = memo(function MarkdownEditor({
  markdown,
  onChange,
}: MarkdownEditorProps) {
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;

  return (
    <TextField
      value={markdown}
      onChange={onChange}
      className="flex h-full min-w-0 min-h-0 flex-col overflow-hidden rounded-panel border border-app-border bg-white/88 text-app-foreground shadow-[0_1px_2px_oklch(0_0_0/3%)] backdrop-blur-[12px] max-md:rounded-[0.85rem]"
    >
      <div className="flex min-h-[3.6rem] shrink-0 grow-0 items-center justify-between gap-4 border-b border-app-border px-4 py-[0.7rem]">
        <div>
          <span className="mb-[0.05rem] block text-[0.64rem] font-[620] uppercase leading-[1.2] tracking-[0.11em] text-app-subtle">
            Document
          </span>
          <Label className="block text-[0.85rem] font-[630] tracking-[-0.01em]">
            Markdown
          </Label>
        </div>
        <span className="whitespace-nowrap font-mono text-[0.68rem] tabular-nums text-app-subtle">
          {wordCount} words
        </span>
      </div>
      <TextArea
        spellCheck={false}
        aria-label="Resume Markdown"
        className="app-scrollbar w-full min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-[1.2rem] pt-[1.15rem] pb-10 font-mono text-[0.78rem] font-[430] leading-[1.7] tracking-[-0.006em] text-[oklch(0.3_0_0)] caret-app-foreground outline-none [tab-size:2] selection:bg-[oklch(0.22_0_0)] selection:text-white focus:shadow-[inset_0_0_0_1px_oklch(0.18_0_0/14%)]"
      />
    </TextField>
  );
});
