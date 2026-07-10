import {describe, it, expect} from 'vitest';

import {
  measureBlocks,
  layoutBlocks,
  findOptimalFit,
  LINE_HEIGHT_MIN,
  LINE_HEIGHT_MAX,
} from './layout';
import type {Spacing} from './layout';
import type {StyledBlock} from './resume_styles';

const spacing: Spacing = {section: 18, item: 10, separator: 4};

const sampleBlocks: StyledBlock[] = [
  {
    type: 'h1',
    text: 'Jane Doe',
    fontScale: 1.5,
    bold: true,
    mb: 4,
    color: '#111',
  },
  {
    type: 'paragraph',
    text: 'Experienced engineer with a long history of shipping software.',
    fontScale: 1,
    bold: false,
    mb: 6,
    color: '#333',
  },
];

const baseMeasure = {
  contentWidth: 540,
  lineHeightMultiplier: LINE_HEIGHT_MIN,
  spacing,
};

// A resume long enough to force findOptimalFit to shrink under any realistic
// page budget; the loop lives here, not in a test body (Rule 9).
function longResume(paragraphCount: number): StyledBlock[] {
  return Array.from({length: paragraphCount}, (_, i): StyledBlock => ({
    type: 'paragraph',
    text: `Paragraph ${i} with enough words to occupy a full line of text.`,
    fontScale: 1,
    bold: false,
    mb: 6,
    color: '#333',
  }));
}

describe('measureBlocks', () => {
  it('measures a positive height for non-empty content', () => {
    const height = measureBlocks(sampleBlocks, {fontSize: 12, ...baseMeasure});
    expect(height).toBeGreaterThan(0);
  });

  it('grows the measured height with a larger font size', () => {
    const small = measureBlocks(sampleBlocks, {fontSize: 10, ...baseMeasure});
    const large = measureBlocks(sampleBlocks, {fontSize: 20, ...baseMeasure});
    expect(large).toBeGreaterThan(small);
  });

  it('adds height for an hr separator', () => {
    const withHr = measureBlocks([...sampleBlocks, {type: 'hr'}], {
      fontSize: 12,
      ...baseMeasure,
    });
    const withoutHr = measureBlocks(sampleBlocks, {
      fontSize: 12,
      ...baseMeasure,
    });
    expect(withHr).toBeGreaterThan(withoutHr);
  });
});

describe('layoutBlocks', () => {
  it('offsets the first item to the top-left padding corner', () => {
    const [first] = layoutBlocks(sampleBlocks, {
      fontSize: 12,
      padding: 40,
      ...baseMeasure,
    });
    expect(first).toMatchObject({
      type: 'text',
      text: 'Jane Doe',
      x: 40,
      y: 40,
    });
  });

  it('emits an hr item positioned below the separator gap', () => {
    const items = layoutBlocks([{type: 'hr'}], {
      fontSize: 12,
      padding: 40,
      ...baseMeasure,
    });
    expect(items).toEqual([{type: 'hr', y: 44}]);
  });
});

describe('findOptimalFit', () => {
  it('produces a fit whose measured height stays within the budget', () => {
    const maxContentHeight = 400;
    const {fontSize, lineHeightMultiplier} = findOptimalFit(sampleBlocks, {
      contentWidth: 540,
      maxContentHeight,
      maxFontSize: 14,
      spacing,
    });

    const measured = measureBlocks(sampleBlocks, {
      fontSize,
      contentWidth: 540,
      lineHeightMultiplier,
      spacing,
    });
    expect(measured).toBeLessThanOrEqual(maxContentHeight);
  });

  it('never exceeds the maximum font size even with room to spare', () => {
    const {fontSize} = findOptimalFit(sampleBlocks, {
      contentWidth: 540,
      maxContentHeight: 100_000,
      maxFontSize: 14,
      spacing,
    });
    expect(fontSize).toBeLessThanOrEqual(14);
  });

  it('keeps the line height within its configured bounds', () => {
    const {lineHeightMultiplier} = findOptimalFit(sampleBlocks, {
      contentWidth: 540,
      maxContentHeight: 400,
      maxFontSize: 14,
      spacing,
    });
    expect(lineHeightMultiplier).toBeGreaterThanOrEqual(LINE_HEIGHT_MIN);
    expect(lineHeightMultiplier).toBeLessThanOrEqual(LINE_HEIGHT_MAX);
  });

  it('shrinks the font size as content grows under the same budget', () => {
    const budget = 250;
    const shortFit = findOptimalFit(sampleBlocks, {
      contentWidth: 540,
      maxContentHeight: budget,
      maxFontSize: 14,
      spacing,
    });
    const longFit = findOptimalFit(longResume(40), {
      contentWidth: 540,
      maxContentHeight: budget,
      maxFontSize: 14,
      spacing,
    });
    expect(longFit.fontSize).toBeLessThan(shortFit.fontSize);
  });
});
