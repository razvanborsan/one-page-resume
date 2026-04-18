import {prepareWithSegments, layout, layoutWithLines} from '@chenglou/pretext';

import type {InlineRange} from './markdown';
import type {StyledBlock, StyledContentBlock} from './resume_styles';

// Page constants
export const PAGE_WIDTH = 620;
export const PAGE_HEIGHT = Math.round(PAGE_WIDTH * (297 / 210));
export const DEFAULT_PADDING = 40;
export const BODY_FONT = 'InterVariable, sans-serif';
export const MONO_FONT = '"Courier New", monospace';
export const LINE_HEIGHT_MIN = 1.15;
export const LINE_HEIGHT_MAX = 1.8;
export const LINE_HEIGHT_DEFAULT = 1.5;
export const DEFAULT_MAX_FONT_SIZE = 14;

export interface Spacing {
  section: number;
  item: number;
  separator: number;
}

export interface LinePart {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: boolean;
  url?: string;
}

export interface HrItem {
  type: 'hr';
  y: number;
}

export interface TextItem {
  type: 'text';
  text: string;
  parts?: LinePart[];
  x: number;
  y: number;
  font: string;
  fontSize: number;
  fontWeight: string;
  fontStyle?: string;
  fontFamily?: string;
  lineHeight: number;
  color: string;
}

export type PositionedItem = HrItem | TextItem;

interface MeasureOptions {
  fontSize: number;
  contentWidth: number;
  lineHeightMultiplier: number;
  spacing: Spacing;
}

interface LayoutOptions extends MeasureOptions {
  padding: number;
}

interface OptimalFitOptions {
  contentWidth: number;
  maxContentHeight: number;
  maxFontSize: number;
  spacing: Spacing;
}

interface OptimalFitResult {
  fontSize: number;
  lineHeightMultiplier: number;
}

// Internal helpers
function buildCssFontString(
  fontSize: number,
  block: StyledContentBlock,
): string {
  const size = fontSize * block.fontScale;
  const family = block.monospace ? MONO_FONT : BODY_FONT;
  return `${block.italic ? 'italic ' : ''}${block.bold ? 'bold ' : ''}${size}px ${family}`;
}

function getBlockTopMargin(block: StyledBlock, spacing: Spacing): number {
  if (block.type === 'hr') return 0;
  if (!block.mt) return 0;
  return block.type === 'h2' ? spacing.section : spacing.item;
}

function shouldSkipBottomMargin(nextBlock: StyledBlock): boolean {
  if (nextBlock.type === 'hr') return true;
  return nextBlock.mt != null && nextBlock.mt !== 0;
}

function buildLineParts(
  lineText: string,
  lineStart: number,
  ranges: InlineRange[],
): LinePart[] | undefined {
  const lineEnd = lineStart + lineText.length;
  const parts: LinePart[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.end <= lineStart || range.start >= lineEnd) continue;

    const start = Math.max(range.start, lineStart) - lineStart;
    const end = Math.min(range.end, lineEnd) - lineStart;

    if (start > cursor) {
      parts.push({text: lineText.slice(cursor, start)});
    }
    parts.push({
      text: lineText.slice(start, end),
      bold: range.bold,
      italic: range.italic,
      code: range.code,
      link: range.link,
      url: range.url,
    });
    cursor = end;
  }

  if (cursor < lineText.length) {
    parts.push({text: lineText.slice(cursor)});
  }

  return parts.some(p => p.bold || p.italic || p.code || p.link)
    ? parts
    : undefined;
}

// Measure blocks (pure math, no DOM)
export function measureBlocks(
  blocks: StyledBlock[],
  {fontSize, contentWidth, lineHeightMultiplier, spacing}: MeasureOptions,
): number {
  let h = 0;
  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    h += getBlockTopMargin(block, spacing);
    if (block.type === 'hr') {
      h += spacing.separator + 1 + spacing.separator;
      continue;
    }
    const computedFontSize = fontSize * block.fontScale;
    const computedLineHeight = computedFontSize * lineHeightMultiplier;
    const font = buildCssFontString(fontSize, block);
    const effectiveWidth = contentWidth - (block.indent ?? 0);
    h += layout(
      prepareWithSegments(block.text, font),
      effectiveWidth,
      computedLineHeight,
    ).height;
    if (idx + 1 >= blocks.length || !shouldSkipBottomMargin(blocks[idx + 1])) {
      h += block.mb;
    }
  }
  return h;
}

// Layout blocks into positioned lines
export function layoutBlocks(
  blocks: StyledBlock[],
  {
    fontSize,
    contentWidth,
    padding,
    lineHeightMultiplier,
    spacing,
  }: LayoutOptions,
): PositionedItem[] {
  const positionedItems: PositionedItem[] = [];
  let y = padding;

  for (let idx = 0; idx < blocks.length; idx++) {
    const block = blocks[idx];
    y += getBlockTopMargin(block, spacing);
    if (block.type === 'hr') {
      y += spacing.separator;
      positionedItems.push({type: 'hr', y});
      y += 1 + spacing.separator;
      continue;
    }

    const computedFontSize = fontSize * block.fontScale;
    const computedLineHeight = computedFontSize * lineHeightMultiplier;
    const font = buildCssFontString(fontSize, block);
    const indent = block.indent ?? 0;
    const effectiveWidth = contentWidth - indent;
    const prepared = prepareWithSegments(block.text, font);
    const result = layoutWithLines(
      prepared,
      effectiveWidth,
      computedLineHeight,
    );

    let searchFrom = 0;
    for (const line of result.lines) {
      let parts: LinePart[] | undefined;
      if (block.inlineRanges) {
        const matchIdx = block.text.indexOf(line.text, searchFrom);
        const lineStart = matchIdx >= 0 ? matchIdx : searchFrom;
        parts = buildLineParts(line.text, lineStart, block.inlineRanges);
        searchFrom = lineStart + line.text.length;
      }

      positionedItems.push({
        type: 'text',
        text: line.text,
        parts,
        x: padding + indent,
        y,
        font,
        fontSize: computedFontSize,
        fontWeight: block.bold ? 'bold' : 'normal',
        fontStyle: block.italic ? 'italic' : undefined,
        fontFamily: block.monospace ? MONO_FONT : undefined,
        lineHeight: computedLineHeight,
        color: block.color,
      });
      y += computedLineHeight;
    }

    if (idx + 1 >= blocks.length || !shouldSkipBottomMargin(blocks[idx + 1])) {
      y += block.mb;
    }
  }

  return positionedItems;
}

// Binary search for optimal font size + line height
export function findOptimalFit(
  blocks: StyledBlock[],
  {contentWidth, maxContentHeight, maxFontSize, spacing}: OptimalFitOptions,
): OptimalFitResult {
  let lo = 6;
  let hi = maxFontSize;
  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    if (
      measureBlocks(blocks, {
        fontSize: mid,
        contentWidth,
        lineHeightMultiplier: LINE_HEIGHT_MIN,
        spacing,
      }) <= maxContentHeight
    ) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const fontSize = Math.floor(lo * 100) / 100;

  lo = LINE_HEIGHT_MIN;
  hi = LINE_HEIGHT_MAX;
  while (hi - lo > 0.001) {
    const mid = (lo + hi) / 2;
    if (
      measureBlocks(blocks, {
        fontSize,
        contentWidth,
        lineHeightMultiplier: mid,
        spacing,
      }) <= maxContentHeight
    ) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const lineHeightMultiplier = Math.floor(lo * 1000) / 1000;

  return {fontSize, lineHeightMultiplier};
}
