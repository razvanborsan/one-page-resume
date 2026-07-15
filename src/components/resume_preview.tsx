import {memo, useEffect, useRef, useState} from 'react';
import type {CSSProperties, RefObject} from 'react';
import {ToggleButton, Toolbar} from 'react-aria-components';

import {PAGE_HEIGHT, PAGE_WIDTH} from '../lib/page';
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
      className={`preview-panel ${active ? 'is-active' : 'is-hidden'}`}
    >
      <div
        className="page-scale-frame"
        style={{
          width: PAGE_WIDTH * pageScale,
          height: PAGE_HEIGHT * pageScale,
        }}
      >
        <div
          ref={pageRef}
          data-pagefit-page
          className="resume-page preview-paper"
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
              className="margin-guide"
              style={{
                top: padding,
                left: padding,
                right: padding,
                bottom: padding,
              }}
            />
          )}

          {!fits && <div data-overflow className="overflow-indicator" />}
        </div>
      </div>

      <Toolbar aria-label="Preview options" className="preview-toolbar">
        <div className="preview-fit-status" data-fits={fits} role="status">
          <span className="preview-fit-dot" />
          <span>
            {fits
              ? 'Fits on 1 page'
              : `Overflow by ${Math.max(0, measuredHeight - maxContentHeight)}px`}
          </span>
        </div>
        <span className="preview-toolbar-separator" />
        <span className="preview-fill-label">
          {Math.round(fillPercent)}% filled
        </span>
        <span className="preview-toolbar-separator" />
        <ToggleButton
          className="guide-toggle"
          isSelected={showMarginGuide}
          onChange={onShowMarginGuideChange}
          aria-label="Show margin guides"
        >
          <GuidesIcon />
          <span>Guides</span>
        </ToggleButton>
      </Toolbar>
    </div>
  );
});
