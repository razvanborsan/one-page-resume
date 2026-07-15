import {memo, useEffect, useRef, useState} from 'react';
import type {CSSProperties, RefObject} from 'react';
import {ToggleButton, Toolbar} from 'react-aria-components';

import {PAGE_HEIGHT, PAGE_WIDTH} from '../lib/page';
import {cn} from '../lib/utils';
import {GuidesIcon} from './icons';
import {ResumeMarkdown} from './resume_markdown';

interface ResumePreviewProps {
  active: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  contentStyle: CSSProperties;
  fillPercent: number;
  fits: boolean;
  markdown: string;
  maxContentHeight: number;
  measuredHeight: number;
  onShowMarginGuideChange: (selected: boolean) => void;
  pageRef: RefObject<HTMLDivElement | null>;
  padding: number;
  showMarginGuide: boolean;
}

export const ResumePreview = memo(function ResumePreview({
  active,
  contentRef,
  contentStyle,
  fillPercent,
  fits,
  markdown,
  maxContentHeight,
  measuredHeight,
  onShowMarginGuideChange,
  pageRef,
  padding,
  showMarginGuide,
}: ResumePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [pageScale, setPageScale] = useState(1);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      setPageScale(Math.min(width / PAGE_WIDTH, height / PAGE_HEIGHT, 1));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={previewRef}
      className={cn(
        'relative flex h-full min-w-0 min-h-0 items-center justify-center overflow-hidden rounded-panel border border-app-border p-[clamp(1rem,1.8vw,1.5rem)] pb-16 [background:var(--app-preview-bg)] shadow-[inset_0_1px_0_oklch(1_0_0/75%)] max-md:rounded-[0.85rem] max-md:p-[0.85rem] max-md:pb-[4.25rem]',
        !active && 'hidden',
      )}
    >
      <div
        className="relative shrink-0 grow-0"
        style={{
          width: PAGE_WIDTH * pageScale,
          height: PAGE_HEIGHT * pageScale,
        }}
      >
        <div
          ref={pageRef}
          data-pagefit-page
          className="resume-page relative shrink-0 overflow-hidden bg-white shadow-[0_24px_50px_oklch(0_0_0/15%),0_4px_12px_oklch(0_0_0/8%),0_0_0_1px_oklch(0_0_0/6%)]"
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            overflow: 'hidden',
            transform: `scale(${pageScale})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            ref={contentRef}
            data-resume-content
            className="typeset typeset-resume w-full"
            style={contentStyle}
          >
            <ResumeMarkdown>{markdown}</ResumeMarkdown>
          </div>

          {showMarginGuide && (
            <div
              data-margin-guide
              className="pointer-events-none absolute border border-dashed border-[oklch(0.35_0_0/20%)]"
              style={{
                top: padding,
                left: padding,
                right: padding,
                bottom: padding,
              }}
            />
          )}

          {!fits && (
            <div
              data-overflow
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 border-b-2 border-app-danger bg-[linear-gradient(transparent,oklch(0.63_0.2_25/14%))]"
            />
          )}
        </div>
      </div>

      <Toolbar
        aria-label="Preview options"
        className="absolute bottom-[0.8rem] left-1/2 z-[5] flex min-h-[2.35rem] max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-[0.6rem] whitespace-nowrap rounded-[0.8rem] border border-white/9 bg-panel-floating py-[0.3rem] pr-[0.4rem] pl-[0.7rem] text-[0.7rem] text-ink-76 shadow-[0_12px_34px_oklch(0_0_0/22%)] backdrop-blur-[18px] max-md:bottom-[0.65rem] max-md:gap-[0.45rem]"
      >
        <div
          className="group/fit flex items-center gap-[0.4rem] font-[560] text-ink-90 data-[fits=false]:text-[oklch(0.78_0.15_25)]"
          data-fits={fits}
          role="status"
        >
          <span className="size-[0.4rem] shrink-0 grow-0 rounded-full bg-app-success shadow-[0_0_0_3px_oklch(0.65_0.16_160/12%)] group-data-[fits=false]/fit:bg-app-danger group-data-[fits=false]/fit:shadow-[0_0_0_3px_oklch(0.63_0.2_25/12%)]" />
          <span>
            {fits
              ? 'Fits on 1 page'
              : `Overflow by ${Math.max(0, measuredHeight - maxContentHeight)}px`}
          </span>
        </div>
        <span className="h-4 w-px bg-white/13" />
        <span className="font-mono text-ink-62 tabular-nums max-md:hidden">
          {Math.round(fillPercent)}% filled
        </span>
        <span className="h-4 w-px bg-white/13 max-md:hidden" />
        <ToggleButton
          className="flex h-7 cursor-pointer items-center gap-[0.35rem] rounded-lg border-0 bg-transparent px-2 text-[0.68rem] font-[560] text-[oklch(0.67_0_0)] outline-none hovered:bg-white/10 hovered:text-white selected:bg-white/10 selected:text-white focus-visible:shadow-[0_0_0_2px_oklch(1_0_0/42%)]"
          isSelected={showMarginGuide}
          onChange={onShowMarginGuideChange}
          aria-label="Show margin guides"
        >
          <GuidesIcon className="size-[0.85rem]" />
          <span className="max-[26rem]:hidden">Guides</span>
        </ToggleButton>
      </Toolbar>
    </div>
  );
});
