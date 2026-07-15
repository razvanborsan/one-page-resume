import {memo, useEffect, useRef, useState} from 'react';
import type {CSSProperties, RefObject} from 'react';

import {PAGE_HEIGHT, PAGE_WIDTH} from '../lib/page';
import {ResumeMarkdown} from './resume_markdown';

interface ResumePreviewProps {
  active: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  contentStyle: CSSProperties;
  fits: boolean;
  markdown: string;
  pageRef: RefObject<HTMLDivElement | null>;
  padding: number;
}

export const ResumePreview = memo(function ResumePreview({
  active,
  contentRef,
  contentStyle,
  fits,
  markdown,
  pageRef,
  padding,
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
      className={`flex-1 min-w-0 items-center justify-center overflow-hidden p-4 sm:p-8 ${active ? 'flex' : 'hidden'} sm:flex`}
    >
      <div
        ref={pageRef}
        data-pagefit-page
        className="resume-page relative bg-white shadow-2xl shadow-black/50 shrink-0"
        style={{
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          overflow: 'hidden',
          transform: `scale(${pageScale})`,
          transformOrigin: 'center center',
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

        <div
          data-margin-guide
          className="absolute pointer-events-none"
          style={{
            top: padding,
            left: padding,
            right: padding,
            bottom: padding,
            border: '1px dashed rgba(0,0,0,0.12)',
          }}
        />

        {!fits && (
          <div
            data-overflow
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: 48,
              background:
                'linear-gradient(transparent, rgba(248,113,113,0.18))',
              borderBottom: '2px solid rgb(248,113,113)',
            }}
          />
        )}
      </div>
    </div>
  );
});
