import type {CSSProperties} from 'react';

export interface ResumePreviewStyleOptions {
  fontSize: number;
  lineHeightMultiplier: number;
  padding: number;
  sectionSpacing: number;
  itemSpacing: number;
  separatorSpacing: number;
}

type ResumeContentStyle = CSSProperties & {
  '--typeset-size': string;
  '--typeset-leading': number;
  '--resume-section-spacing': string;
  '--resume-item-spacing': string;
  '--resume-separator-spacing': string;
};

export function getResumeContentStyle({
  fontSize,
  lineHeightMultiplier,
  padding,
  sectionSpacing,
  itemSpacing,
  separatorSpacing,
}: ResumePreviewStyleOptions): ResumeContentStyle {
  return {
    padding,
    '--typeset-size': `${fontSize}px`,
    '--typeset-leading': lineHeightMultiplier,
    '--resume-section-spacing': `${sectionSpacing}px`,
    '--resume-item-spacing': `${itemSpacing}px`,
    '--resume-separator-spacing': `${separatorSpacing}px`,
  };
}
