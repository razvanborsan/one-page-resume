import {
  DEFAULT_MAX_FONT_SIZE,
  DEFAULT_PADDING,
  LINE_HEIGHT_DEFAULT,
} from './page';

export interface ResumeSettings {
  autoFit: boolean;
  maxFontSize: number;
  manualFontSize: number;
  manualLineHeightMultiplier: number;
  padding: number;
  sectionSpacing: number;
  itemSpacing: number;
  separatorSpacing: number;
}

export type LayoutSettingKey = keyof Pick<
  ResumeSettings,
  | 'maxFontSize'
  | 'padding'
  | 'sectionSpacing'
  | 'itemSpacing'
  | 'separatorSpacing'
>;

export const DEFAULT_RESUME_SETTINGS: ResumeSettings = {
  autoFit: true,
  maxFontSize: DEFAULT_MAX_FONT_SIZE,
  manualFontSize: 11,
  manualLineHeightMultiplier: LINE_HEIGHT_DEFAULT,
  padding: DEFAULT_PADDING,
  sectionSpacing: 18,
  itemSpacing: 10,
  separatorSpacing: 16,
};
