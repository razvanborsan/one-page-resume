import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'react-aria-components';
import type {Key} from 'react-aria-components';

import {AppHeader} from './components/app_header';
import type {SaveStatus} from './components/app_header';
import {MarkdownEditor} from './components/markdown_editor';
import {ResumePreview} from './components/resume_preview';
import {SettingsDialog} from './components/settings_dialog';
import {SettingsPanel} from './components/settings_panel';
import {DEFAULT_MD, RESUMES} from './data/resumes';
import {useMediaQuery} from './hooks/use_media_query';
import {usePageFit} from './hooks/use_page_fit';
import {PAGE_HEIGHT, PAGE_WIDTH} from './lib/page';
import {exportPdf} from './lib/pdf';
import {getResumeContentStyle} from './lib/preview_style';
import {
  DEFAULT_RESUME_SETTINGS,
  type LayoutSettingKey,
} from './lib/resume_settings';

const STORAGE_KEY = 'one-page-resume:markdown';
const FIT_IDLE_DELAY = 300;
const TWO_PANE_QUERY = '(min-width: 48rem)';
const INLINE_SETTINGS_QUERY = '(min-width: 75rem)';

function loadInitialMarkdown(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored;
    localStorage.setItem(STORAGE_KEY, DEFAULT_MD);
  } catch {
    // localStorage may be unavailable (e.g. private mode); fall back to default.
  }
  return DEFAULT_MD;
}

function getResumeName(markdown: string, index: number): string {
  return markdown.match(/^#\s+(.+)$/m)?.[1] ?? `Example ${index + 1}`;
}

export function App() {
  const [markdown, setMarkdown] = useState(loadInitialMarkdown);
  const deferredMarkdown = useDeferredValue(markdown);
  const [settings, setSettings] = useState(DEFAULT_RESUME_SETTINGS);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<Key>('preview');
  const [isAdjustingLayout, setIsAdjustingLayout] = useState(false);
  const [showMarginGuide, setShowMarginGuide] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [undoMarkdown, setUndoMarkdown] = useState<string | null>(null);
  const adjustmentTimerRef = useRef<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isTwoPane = useMediaQuery(TWO_PANE_QUERY);
  const hasInlineSettings = useMediaQuery(INLINE_SETTINGS_QUERY);

  const maxContentHeight = PAGE_HEIGHT - settings.padding * 2;
  const previewActive = isTwoPane || activeTab === 'preview';

  useEffect(() => {
    setSaveStatus('saving');
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, markdown);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('unavailable');
      }
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [markdown]);

  useEffect(() => {
    let cancelled = false;
    const markFontsLoaded = () => {
      if (!cancelled) setFontsLoaded(true);
    };

    document.fonts.ready.then(markFontsLoaded);
    if (document.fonts.status === 'loaded') markFontsLoaded();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (adjustmentTimerRef.current !== null) {
        window.clearTimeout(adjustmentTimerRef.current);
      }
    },
    [],
  );

  const fitResult = usePageFit({
    autoFit: settings.autoFit,
    contentRef,
    fontsLoaded,
    isAdjusting: isAdjustingLayout,
    itemSpacing: settings.itemSpacing,
    lineHeightMultiplier: settings.manualLineHeightMultiplier,
    markdown: deferredMarkdown,
    maxContentHeight,
    maxFontSize: settings.maxFontSize,
    padding: settings.padding,
    previewActive,
    sectionSpacing: settings.sectionSpacing,
    separatorSpacing: settings.separatorSpacing,
    fontSize: settings.manualFontSize,
  });

  const fontSize = settings.autoFit
    ? fitResult.fontSize
    : settings.manualFontSize;
  const lineHeightMultiplier = settings.autoFit
    ? fitResult.lineHeightMultiplier
    : settings.manualLineHeightMultiplier;
  const fits = fitResult.measuredHeight <= maxContentHeight;
  const fillPercent = Math.min(
    (fitResult.measuredHeight / maxContentHeight) * 100,
    100,
  );

  const contentStyle = useMemo(
    () =>
      getResumeContentStyle({
        fontSize,
        lineHeightMultiplier,
        padding: settings.padding,
        sectionSpacing: settings.sectionSpacing,
        itemSpacing: settings.itemSpacing,
        separatorSpacing: settings.separatorSpacing,
      }),
    [
      fontSize,
      lineHeightMultiplier,
      settings.itemSpacing,
      settings.padding,
      settings.sectionSpacing,
      settings.separatorSpacing,
    ],
  );

  const settingsPanelValues = useMemo(
    () => ({
      autoFit: settings.autoFit,
      fontSize,
      itemSpacing: settings.itemSpacing,
      lineHeightMultiplier,
      maxFontSize: settings.maxFontSize,
      padding: settings.padding,
      sectionSpacing: settings.sectionSpacing,
      separatorSpacing: settings.separatorSpacing,
    }),
    [fontSize, lineHeightMultiplier, settings],
  );

  const examples = useMemo(
    () =>
      RESUMES.map((resume, index) => ({
        id: String(index),
        label: getResumeName(resume, index),
      })),
    [],
  );

  const finishLayoutAdjustment = useCallback(() => {
    if (adjustmentTimerRef.current !== null) {
      window.clearTimeout(adjustmentTimerRef.current);
      adjustmentTimerRef.current = null;
    }
    setIsAdjustingLayout(false);
  }, []);

  const handleLayoutChange = useCallback(
    (key: LayoutSettingKey, value: number) => {
      setSettings(previous => ({...previous, [key]: value}));
      if (!settings.autoFit) return;

      setIsAdjustingLayout(true);
      if (adjustmentTimerRef.current !== null) {
        window.clearTimeout(adjustmentTimerRef.current);
      }
      adjustmentTimerRef.current = window.setTimeout(() => {
        adjustmentTimerRef.current = null;
        setIsAdjustingLayout(false);
      }, FIT_IDLE_DELAY);
    },
    [settings.autoFit],
  );

  const handleAutoFitChange = useCallback(
    (selected: boolean) => {
      finishLayoutAdjustment();
      setSettings(previous =>
        selected
          ? {...previous, autoFit: true}
          : {
              ...previous,
              autoFit: false,
              manualFontSize: previous.autoFit
                ? fitResult.fontSize
                : previous.manualFontSize,
              manualLineHeightMultiplier: previous.autoFit
                ? fitResult.lineHeightMultiplier
                : previous.manualLineHeightMultiplier,
            },
      );
    },
    [
      finishLayoutAdjustment,
      fitResult.fontSize,
      fitResult.lineHeightMultiplier,
    ],
  );

  const handleFontSizeChange = useCallback(
    (value: number) => {
      finishLayoutAdjustment();
      setSettings(previous => ({
        ...previous,
        autoFit: false,
        manualFontSize: value,
        manualLineHeightMultiplier: previous.autoFit
          ? fitResult.lineHeightMultiplier
          : previous.manualLineHeightMultiplier,
      }));
    },
    [finishLayoutAdjustment, fitResult.lineHeightMultiplier],
  );

  const handleLineHeightChange = useCallback(
    (value: number) => {
      finishLayoutAdjustment();
      setSettings(previous => ({
        ...previous,
        autoFit: false,
        manualFontSize: previous.autoFit
          ? fitResult.fontSize
          : previous.manualFontSize,
        manualLineHeightMultiplier: value,
      }));
    },
    [finishLayoutAdjustment, fitResult.fontSize],
  );

  const handleResetSettings = useCallback(() => {
    finishLayoutAdjustment();
    setSettings({...DEFAULT_RESUME_SETTINGS});
  }, [finishLayoutAdjustment]);

  const handleMarkdownChange = useCallback((value: string) => {
    setUndoMarkdown(null);
    setMarkdown(value);
  }, []);

  const handleExampleSelect = useCallback(
    (id: string) => {
      const next = RESUMES[Number(id)];
      if (next === undefined || next === markdown) return;
      setUndoMarkdown(previous => previous ?? markdown);
      setMarkdown(next);
    },
    [markdown],
  );

  const handleUndoExample = useCallback(() => {
    if (undoMarkdown === null) return;
    setMarkdown(undoMarkdown);
    setUndoMarkdown(null);
  }, [undoMarkdown]);

  const handleExportPdf = useCallback(() => {
    const print = () =>
      exportPdf(pageRef.current, {pageWidth: PAGE_WIDTH, markdown});

    if (!isTwoPane && activeTab !== 'preview') {
      setActiveTab('preview');
      window.requestAnimationFrame(() => window.requestAnimationFrame(print));
      return;
    }

    print();
  }, [activeTab, isTwoPane, markdown]);

  const renderPreview = (active: boolean) => (
    <ResumePreview
      active={active}
      contentRef={contentRef}
      contentStyle={contentStyle}
      fillPercent={fillPercent}
      fits={fits}
      markdown={deferredMarkdown}
      maxContentHeight={maxContentHeight}
      measuredHeight={fitResult.measuredHeight}
      onShowMarginGuideChange={setShowMarginGuide}
      pageRef={pageRef}
      padding={settings.padding}
      showMarginGuide={showMarginGuide}
    />
  );

  const renderSettingsPanel = (onClose?: () => void) => (
    <SettingsPanel
      fillPercent={fillPercent}
      fits={fits}
      maxContentHeight={maxContentHeight}
      measuredHeight={fitResult.measuredHeight}
      onAutoFitChange={handleAutoFitChange}
      onClose={onClose}
      onFontSizeChange={handleFontSizeChange}
      onLayoutChange={handleLayoutChange}
      onLayoutChangeEnd={finishLayoutAdjustment}
      onLineHeightChange={handleLineHeightChange}
      onReset={handleResetSettings}
      values={settingsPanelValues}
    />
  );

  const settingsControl = !hasInlineSettings ? (
    <SettingsDialog>{close => renderSettingsPanel(close)}</SettingsDialog>
  ) : undefined;

  return (
    <div className="app-shell">
      <AppHeader
        examples={examples}
        onExampleSelect={handleExampleSelect}
        onExport={handleExportPdf}
        onUndoExample={undoMarkdown !== null ? handleUndoExample : undefined}
        saveStatus={saveStatus}
        settingsControl={settingsControl}
      />

      <main className="workspace-shell">
        {isTwoPane ? (
          <div
            className={`workspace-grid ${hasInlineSettings ? 'has-inline-settings' : ''}`}
          >
            <MarkdownEditor
              markdown={markdown}
              onChange={handleMarkdownChange}
            />
            {renderPreview(true)}
            {hasInlineSettings && renderSettingsPanel()}
          </div>
        ) : (
          <Tabs
            className="mobile-workspace-tabs"
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
          >
            <TabList
              aria-label="Choose workspace view"
              className="mobile-tab-list"
            >
              <Tab id="editor" className="mobile-tab">
                Write
              </Tab>
              <Tab id="preview" className="mobile-tab">
                Preview
              </Tab>
            </TabList>
            <TabPanels className="mobile-tab-panels">
              <TabPanel id="editor" className="mobile-tab-panel">
                <MarkdownEditor
                  markdown={markdown}
                  onChange={handleMarkdownChange}
                />
              </TabPanel>
              <TabPanel id="preview" className="mobile-tab-panel">
                {renderPreview(activeTab === 'preview')}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </main>
    </div>
  );
}
