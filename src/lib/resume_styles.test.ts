import {describe, it, expect} from 'vitest';

import {applyResumeStyles, COLORS} from './resume_styles';
import type {ParsedBlock} from './markdown';

describe('applyResumeStyles', () => {
  it('styles an h1 as a bold heading', () => {
    const [styled] = applyResumeStyles([{type: 'h1', text: 'Jane Doe'}]);
    expect(styled).toMatchObject({
      type: 'h1',
      fontScale: 1.5,
      bold: true,
      color: COLORS.heading,
    });
  });

  it('styles an h2 as a muted section header', () => {
    const [styled] = applyResumeStyles([{type: 'h2', text: 'Experience'}]);
    expect(styled).toMatchObject({
      type: 'h2',
      fontScale: 0.85,
      bold: true,
      mt: 18,
      color: COLORS.muted,
    });
  });

  it('passes hr blocks through unchanged', () => {
    expect(applyResumeStyles([{type: 'hr'}])).toEqual([{type: 'hr'}]);
  });

  it('drops the top margin on an h3 that follows an h2 section', () => {
    const blocks: ParsedBlock[] = [
      {type: 'h2', text: 'Experience'},
      {type: 'h3', text: 'Company'},
    ];
    const [, h3] = applyResumeStyles(blocks);
    expect(h3).toMatchObject({type: 'h3', mt: 0});
  });

  it('keeps the default top margin on a standalone h3', () => {
    const blocks: ParsedBlock[] = [
      {type: 'paragraph', text: 'intro'},
      {type: 'h3', text: 'Company'},
    ];
    const [, h3] = applyResumeStyles(blocks);
    expect(h3).toMatchObject({type: 'h3', mt: 10});
  });

  it('indents blockquotes proportional to their depth', () => {
    const [styled] = applyResumeStyles([
      {type: 'blockquote', text: 'quote', depth: 2},
    ]);
    expect(styled).toMatchObject({
      type: 'blockquote',
      italic: true,
      indent: 32,
    });
  });

  it('marks code blocks as monospace', () => {
    const [styled] = applyResumeStyles([
      {type: 'code-block', text: 'const x = 1;'},
    ]);
    expect(styled).toMatchObject({type: 'code-block', monospace: true});
  });

  it('styles a standalone paragraph with the body color', () => {
    const [styled] = applyResumeStyles([{type: 'paragraph', text: 'hello'}]);
    expect(styled).toMatchObject({
      type: 'paragraph',
      fontScale: 1,
      bold: false,
      color: COLORS.body,
    });
  });

  it('styles the paragraph after an h1 as the secondary tagline', () => {
    const blocks: ParsedBlock[] = [
      {type: 'h1', text: 'Jane Doe'},
      {type: 'paragraph', text: 'Software Engineer'},
    ];
    const [, tagline] = applyResumeStyles(blocks);
    expect(tagline).toMatchObject({
      type: 'paragraph',
      fontScale: 1,
      color: COLORS.secondary,
    });
  });

  it('styles the second paragraph after an h1 as the muted subtitle', () => {
    const blocks: ParsedBlock[] = [
      {type: 'h1', text: 'Jane Doe'},
      {type: 'paragraph', text: 'Software Engineer'},
      {type: 'paragraph', text: 'San Francisco'},
    ];
    const [, , subtitle] = applyResumeStyles(blocks);
    expect(subtitle).toMatchObject({
      type: 'paragraph',
      fontScale: 0.8,
      mb: 16,
      color: COLORS.muted,
    });
  });
});
