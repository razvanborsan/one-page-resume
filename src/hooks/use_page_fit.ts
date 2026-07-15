import {useLayoutEffect, useRef, useState} from 'react';
import type {RefObject} from 'react';

import {findRenderedResumeFit, measureRenderedResume} from '../lib/page_fit';
import type {PageFitResult} from '../lib/page_fit';

interface UsePageFitOptions {
  autoFit: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  fontsLoaded: boolean;
  isAdjusting: boolean;
  itemSpacing: number;
  lineHeightMultiplier: number;
  markdown: string;
  maxContentHeight: number;
  maxFontSize: number;
  padding: number;
  previewActive: boolean;
  sectionSpacing: number;
  separatorSpacing: number;
  fontSize: number;
}

function resultChanged(previous: PageFitResult, next: PageFitResult): boolean {
  return (
    previous.fontSize !== next.fontSize ||
    previous.lineHeightMultiplier !== next.lineHeightMultiplier ||
    previous.measuredHeight !== next.measuredHeight ||
    previous.measureTime !== next.measureTime
  );
}

export function usePageFit({
  autoFit,
  contentRef,
  fontsLoaded,
  isAdjusting,
  itemSpacing,
  lineHeightMultiplier,
  markdown,
  maxContentHeight,
  maxFontSize,
  padding,
  previewActive,
  sectionSpacing,
  separatorSpacing,
  fontSize,
}: UsePageFitOptions): PageFitResult {
  const [result, setResult] = useState<PageFitResult>({
    fontSize,
    lineHeightMultiplier,
    measuredHeight: 0,
    measureTime: 0,
  });
  const resultRef = useRef(result);

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element || !fontsLoaded || element.getClientRects().length === 0) {
      return;
    }

    // While a slider is moving, keep the preview and meter live with one
    // measurement. The full binary fit runs once the interaction is committed.
    const next =
      autoFit && !isAdjusting
        ? findRenderedResumeFit(element, {
            maxContentHeight,
            maxFontSize,
            padding,
          })
        : measureRenderedResume(
            element,
            autoFit ? resultRef.current.fontSize : fontSize,
            autoFit
              ? resultRef.current.lineHeightMultiplier
              : lineHeightMultiplier,
            padding,
          );

    resultRef.current = next;
    setResult(previous => (resultChanged(previous, next) ? next : previous));
  }, [
    autoFit,
    contentRef,
    fontsLoaded,
    fontSize,
    isAdjusting,
    itemSpacing,
    lineHeightMultiplier,
    markdown,
    maxContentHeight,
    maxFontSize,
    padding,
    previewActive,
    sectionSpacing,
    separatorSpacing,
  ]);

  return result;
}
