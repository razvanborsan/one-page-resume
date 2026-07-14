import {LINE_HEIGHT_MAX, LINE_HEIGHT_MIN, MIN_FONT_SIZE} from './page';

export interface PageFitResult {
  fontSize: number;
  lineHeightMultiplier: number;
  measuredHeight: number;
  measureTime: number;
}

interface PageFitOptions {
  maxContentHeight: number;
  maxFontSize: number;
  padding: number;
}

function applyTypography(
  element: HTMLElement,
  fontSize: number,
  lineHeightMultiplier: number,
): void {
  element.style.setProperty('--typeset-size', `${fontSize}px`);
  element.style.setProperty('--typeset-leading', String(lineHeightMultiplier));
}

function readContentHeight(element: HTMLElement, padding: number): number {
  return Math.max(0, element.scrollHeight - padding * 2);
}

export function measureRenderedResume(
  element: HTMLElement,
  fontSize: number,
  lineHeightMultiplier: number,
  padding: number,
): PageFitResult {
  const start = performance.now();
  applyTypography(element, fontSize, lineHeightMultiplier);

  return {
    fontSize,
    lineHeightMultiplier,
    measuredHeight: Math.ceil(readContentHeight(element, padding)),
    measureTime: +(performance.now() - start).toFixed(2),
  };
}

export function findRenderedResumeFit(
  element: HTMLElement,
  {maxContentHeight, maxFontSize, padding}: PageFitOptions,
): PageFitResult {
  const start = performance.now();
  let lo = MIN_FONT_SIZE;
  let hi = Math.max(MIN_FONT_SIZE, maxFontSize);

  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    applyTypography(element, mid, LINE_HEIGHT_MIN);
    if (readContentHeight(element, padding) <= maxContentHeight) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  const fontSize = Math.floor(lo * 100) / 100;
  applyTypography(element, fontSize, LINE_HEIGHT_MIN);

  let lineHeightMultiplier = LINE_HEIGHT_MIN;
  if (readContentHeight(element, padding) <= maxContentHeight) {
    lo = LINE_HEIGHT_MIN;
    hi = LINE_HEIGHT_MAX;
    while (hi - lo > 0.001) {
      const mid = (lo + hi) / 2;
      applyTypography(element, fontSize, mid);
      if (readContentHeight(element, padding) <= maxContentHeight) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    lineHeightMultiplier = Math.floor(lo * 1000) / 1000;
  }

  applyTypography(element, fontSize, lineHeightMultiplier);

  return {
    fontSize,
    lineHeightMultiplier,
    measuredHeight: Math.ceil(readContentHeight(element, padding)),
    measureTime: +(performance.now() - start).toFixed(2),
  };
}
