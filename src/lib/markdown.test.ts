import {describe, it, expect} from 'vitest';

import {parseMarkdown} from './markdown';

describe('parseMarkdown', () => {
  it('parses ATX headings at each level', () => {
    expect(parseMarkdown('# One\n## Two\n### Three')).toEqual([
      {type: 'h1', text: 'One'},
      {type: 'h2', text: 'Two'},
      {type: 'h3', text: 'Three'},
    ]);
  });

  it('parses setext headings', () => {
    expect(parseMarkdown('Title\n=====\n\nSection\n-------')).toEqual([
      {type: 'h1', text: 'Title'},
      {type: 'h2', text: 'Section'},
    ]);
  });

  it('joins consecutive lines into a single paragraph', () => {
    expect(parseMarkdown('first line\nsecond line')).toEqual([
      {type: 'paragraph', text: 'first line second line'},
    ]);
  });

  it('treats a blank line as a paragraph separator', () => {
    expect(parseMarkdown('one\n\ntwo')).toEqual([
      {type: 'paragraph', text: 'one'},
      {type: 'paragraph', text: 'two'},
    ]);
  });

  it.each(['---', '***', '___'])('parses %s as a horizontal rule', marker => {
    expect(parseMarkdown(marker)).toEqual([{type: 'hr'}]);
  });

  it('parses unordered list items with a bullet prefix', () => {
    expect(parseMarkdown('- apple\n* banana')).toEqual([
      {type: 'ul-item', text: '\u2022 apple'},
      {type: 'ul-item', text: '\u2022 banana'},
    ]);
  });

  it('parses ordered list items preserving the marker', () => {
    expect(parseMarkdown('1. first\n2. second')).toEqual([
      {type: 'ol-item', text: '1. first'},
      {type: 'ol-item', text: '2. second'},
    ]);
  });

  it('parses nested blockquotes and tracks depth', () => {
    expect(parseMarkdown('> outer\n>> inner')).toEqual([
      {type: 'blockquote', text: 'outer', depth: 1},
      {type: 'blockquote', text: 'inner', depth: 2},
    ]);
  });

  it('extracts bold and italic inline ranges', () => {
    expect(parseMarkdown('a **bold** and *italic* word')).toEqual([
      {
        type: 'paragraph',
        text: 'a bold and italic word',
        inlineRanges: [
          {start: 2, end: 6, bold: true, italic: false},
          {start: 11, end: 17, bold: false, italic: true},
        ],
      },
    ]);
  });

  it('extracts a combined bold and italic range', () => {
    expect(parseMarkdown('***wow***')).toEqual([
      {
        type: 'paragraph',
        text: 'wow',
        inlineRanges: [{start: 0, end: 3, bold: true, italic: true}],
      },
    ]);
  });

  it('extracts an inline code span as a code range', () => {
    expect(parseMarkdown('use `npm test` now')).toEqual([
      {
        type: 'paragraph',
        text: 'use npm test now',
        inlineRanges: [{start: 4, end: 12, code: true}],
      },
    ]);
  });

  it('extracts an inline link with its url', () => {
    expect(parseMarkdown('see [docs](https://x.com) here')).toEqual([
      {
        type: 'paragraph',
        text: 'see docs here',
        inlineRanges: [{start: 4, end: 8, link: true, url: 'https://x.com'}],
      },
    ]);
  });

  it('resolves reference-style links', () => {
    expect(parseMarkdown('See [docs][1].\n\n[1]: https://example.com')).toEqual(
      [
        {
          type: 'paragraph',
          text: 'See docs.',
          inlineRanges: [
            {start: 4, end: 8, link: true, url: 'https://example.com'},
          ],
        },
      ],
    );
  });

  it('honors backslash escapes so markers render literally', () => {
    expect(parseMarkdown('a \\*not italic\\* b')).toEqual([
      {type: 'paragraph', text: 'a *not italic* b'},
    ]);
  });
});
