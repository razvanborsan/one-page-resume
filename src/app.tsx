import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {ToggleButton, ToggleButtonGroup} from 'react-aria-components';
import type {Key} from 'react-aria-components';

import {MarkdownEditor} from './components/markdown_editor';
import {ResumePreview} from './components/resume_preview';
import {SettingsPanel} from './components/settings_panel';
import {RESUMES, DEFAULT_MD} from './data/resumes';
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

export function App() {
  const [markdown, setMarkdown] = useState(loadInitialMarkdown);
  const deferredMarkdown = useDeferredValue(markdown);
  const [settings, setSettings] = useState(DEFAULT_RESUME_SETTINGS);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [isAdjustingLayout, setIsAdjustingLayout] = useState(false);
  const adjustmentTimerRef = useRef<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const maxContentHeight = PAGE_HEIGHT - settings.padding * 2;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, markdown);
      } catch {
        // Ignore write failures (e.g. quota exceeded or unavailable storage).
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
    previewActive: activeTab === 'preview',
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

  const handleExportPdf = useCallback(() => {
    exportPdf(pageRef.current, {pageWidth: PAGE_WIDTH, markdown});
  }, [markdown]);

  const handleShuffle = useCallback(() => {
    setMarkdown(previous => {
      const others = RESUMES.filter(resume => resume !== previous);
      return others[Math.floor(Math.random() * others.length)];
    });
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col sm:flex-row bg-neutral-900 text-white min-h-0 overflow-hidden">
        <ToggleButtonGroup
          aria-label="Choose view"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[activeTab]}
          onSelectionChange={(keys: Set<Key>) => {
            const [key] = keys;
            if (key !== undefined) setActiveTab(String(key));
          }}
          className="sm:hidden flex border-b border-neutral-800 shrink-0"
        >
          {(
            [
              ['editor', 'Editor'],
              ['preview', 'Preview'],
              ['settings', 'Settings'],
            ] as const
          ).map(([key, label]) => (
            <ToggleButton
              key={key}
              id={key}
              className="flex-1 py-2.5 text-xs uppercase tracking-widest transition-colors cursor-pointer text-neutral-500 data-hovered:text-neutral-300 data-selected:text-white data-selected:border-b-2 data-selected:border-white outline-none data-focus-visible:ring-1 data-focus-visible:ring-inset data-focus-visible:ring-white/60"
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <MarkdownEditor
          active={activeTab === 'editor'}
          markdown={markdown}
          onChange={setMarkdown}
        />

        <ResumePreview
          active={activeTab === 'preview'}
          contentRef={contentRef}
          contentStyle={contentStyle}
          fits={fits}
          markdown={deferredMarkdown}
          pageRef={pageRef}
          padding={settings.padding}
        />

        <SettingsPanel
          active={activeTab === 'settings'}
          fillPercent={fillPercent}
          fits={fits}
          maxContentHeight={maxContentHeight}
          measuredHeight={fitResult.measuredHeight}
          measureTime={fitResult.measureTime}
          onAutoFitChange={handleAutoFitChange}
          onExport={handleExportPdf}
          onFontSizeChange={handleFontSizeChange}
          onLayoutChange={handleLayoutChange}
          onLayoutChangeEnd={finishLayoutAdjustment}
          onLineHeightChange={handleLineHeightChange}
          onShuffle={handleShuffle}
          values={settingsPanelValues}
        />
      </main>
    </div>
  );
}
