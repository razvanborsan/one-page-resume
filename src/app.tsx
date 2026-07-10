import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {
  Button,
  Link,
  SwitchField,
  SwitchButton,
  TextField,
  TextArea,
  Label,
  Meter,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-aria-components';
import type {Key} from 'react-aria-components';

import {RESUMES, DEFAULT_MD} from './data/resumes';
import {parseMarkdown} from './lib/markdown';
import {applyResumeStyles, COLORS} from './lib/resume_styles';
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  DEFAULT_PADDING,
  BODY_FONT,
  MONO_FONT,
  LINE_HEIGHT_MIN,
  LINE_HEIGHT_MAX,
  LINE_HEIGHT_DEFAULT,
  DEFAULT_MAX_FONT_SIZE,
  measureBlocks,
  layoutBlocks,
  findOptimalFit,
} from './lib/layout';
import type {PositionedItem} from './lib/layout';
import {exportPdf} from './lib/pdf';
import {SliderControl} from './components/slider_control';

const STORAGE_KEY = 'always-fit-resume:markdown';

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
  const [fontSize, setFontSize] = useState(11);
  const [padding, setPadding] = useState(DEFAULT_PADDING);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lineHeightMultiplier, setLineHeightMultiplier] =
    useState(LINE_HEIGHT_DEFAULT);
  const [maxFontSize, setMaxFontSize] = useState(DEFAULT_MAX_FONT_SIZE);
  const [sectionSpacing, setSectionSpacing] = useState(18);
  const [itemSpacing, setItemSpacing] = useState(10);
  const [separatorSpacing, setSeparatorSpacing] = useState(16);
  const [autoFit, setAutoFit] = useState(true);
  const [pageScale, setPageScale] = useState(1);
  const [activeTab, setActiveTab] = useState('preview');
  const pageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const contentWidth = PAGE_WIDTH - padding * 2;
  const maxContentHeight = PAGE_HEIGHT - padding * 2;

  const spacing = useMemo(
    () => ({
      section: sectionSpacing,
      item: itemSpacing,
      separator: separatorSpacing,
    }),
    [sectionSpacing, itemSpacing, separatorSpacing],
  );

  const blocks = useMemo(
    () => applyResumeStyles(parseMarkdown(markdown)),
    [markdown],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, markdown);
    } catch {
      // Ignore write failures (e.g. quota exceeded or unavailable storage).
    }
  }, [markdown]);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      const sx = width / PAGE_WIDTH;
      const sy = height / PAGE_HEIGHT;
      setPageScale(Math.min(sx, sy, 1));
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, []);

  const {measuredHeight, measureTime} = useMemo(() => {
    if (!fontsLoaded) return {measuredHeight: 0, measureTime: 0};
    const t0 = performance.now();
    const h = measureBlocks(blocks, {
      fontSize,
      contentWidth,
      lineHeightMultiplier,
      spacing,
    });
    return {
      measuredHeight: Math.round(h),
      measureTime: +(performance.now() - t0).toFixed(2),
    };
  }, [
    blocks,
    fontSize,
    contentWidth,
    lineHeightMultiplier,
    spacing,
    fontsLoaded,
  ]);

  const positionedItems: PositionedItem[] = useMemo(() => {
    if (!fontsLoaded) return [];
    return layoutBlocks(blocks, {
      fontSize,
      contentWidth,
      padding,
      lineHeightMultiplier,
      spacing,
    });
  }, [
    blocks,
    fontSize,
    contentWidth,
    padding,
    lineHeightMultiplier,
    spacing,
    fontsLoaded,
  ]);

  useEffect(() => {
    if (!fontsLoaded || !autoFit) return;
    const {fontSize: optFs, lineHeightMultiplier: optLh} = findOptimalFit(
      blocks,
      {contentWidth, maxContentHeight, maxFontSize, spacing},
    );
    setFontSize(Math.min(optFs, maxFontSize));
    setLineHeightMultiplier(optLh);
  }, [
    blocks,
    autoFit,
    fontsLoaded,
    contentWidth,
    maxContentHeight,
    maxFontSize,
    spacing,
  ]);

  const handleFontSizeSlider = (v: number) => {
    setAutoFit(false);
    setFontSize(v);
  };

  const handleLineHeightSlider = (v: number) => {
    setAutoFit(false);
    setLineHeightMultiplier(v);
  };

  const handleExportPdf = useCallback(() => {
    exportPdf(pageRef.current, {pageWidth: PAGE_WIDTH, markdown});
  }, [markdown]);

  const handleShuffle = useCallback(() => {
    const others = RESUMES.filter(r => r !== markdown);
    setMarkdown(others[Math.floor(Math.random() * others.length)]);
  }, [markdown]);

  const fits = measuredHeight <= maxContentHeight;
  const fillPercent = Math.min((measuredHeight / maxContentHeight) * 100, 100);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col sm:flex-row bg-neutral-900 text-white min-h-0 overflow-hidden">
        {/* Mobile view switcher */}
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

        {/* Markdown editor */}
        <TextField
          value={markdown}
          onChange={setMarkdown}
          className={`flex-1 min-w-0 self-stretch border-r border-neutral-800 flex-col ${activeTab === 'editor' ? 'flex' : 'hidden'} sm:flex`}
        >
          <div className="px-4 py-3 border-b border-neutral-800">
            <Label className="text-xs text-neutral-500 uppercase tracking-widest">
              Markdown
            </Label>
          </div>
          <TextArea
            spellCheck={false}
            className="flex-1 bg-transparent text-neutral-300 text-sm font-mono leading-relaxed p-4 resize-none outline-none ring-0 focus:outline-none focus:ring-0 border-none placeholder-neutral-600 pagefit-scrollbar"
            style={{caretColor: '#fff'}}
          />
        </TextField>

        {/* A4 Page */}
        <div
          ref={previewRef}
          className={`flex-1 min-w-0 items-center justify-center overflow-hidden p-4 sm:p-8 ${activeTab === 'preview' ? 'flex' : 'hidden'} sm:flex`}
        >
          <div
            ref={pageRef}
            data-pagefit-page
            className="relative bg-white shadow-2xl shadow-black/50 shrink-0"
            style={{
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
              overflow: 'hidden',
              transform: `scale(${pageScale})`,
              transformOrigin: 'center center',
            }}
          >
            {positionedItems.map((item, i) => {
              if (item.type === 'hr') {
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: padding,
                      right: padding,
                      top: item.y,
                      height: 1,
                      backgroundColor: '#ddd',
                    }}
                  />
                );
              }
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    fontSize: item.fontSize,
                    fontWeight: item.fontWeight,
                    fontStyle: item.fontStyle,
                    fontFamily: item.fontFamily ?? BODY_FONT,
                    lineHeight: `${item.lineHeight}px`,
                    color: item.color,
                    whiteSpace: 'pre',
                  }}
                >
                  {item.parts
                    ? item.parts.map((part, j) => (
                        <span
                          key={j}
                          style={{
                            fontWeight: part.bold ? 'bold' : undefined,
                            fontStyle: part.italic ? 'italic' : undefined,
                            fontFamily: part.code ? MONO_FONT : undefined,
                            backgroundColor: part.code
                              ? COLORS.inlineCodeBg
                              : undefined,
                            borderRadius: part.code ? 3 : undefined,
                            color: part.link ? COLORS.inlineLink : undefined,
                            textDecoration: part.link ? 'underline' : undefined,
                          }}
                        >
                          {part.text}
                        </span>
                      ))
                    : item.text}
                </div>
              );
            })}

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

        {/* Right panel */}
        <div
          className={`w-full sm:w-72 sm:shrink-0 self-stretch sm:border-l border-neutral-800 px-5 py-4 flex-col gap-4 overflow-y-auto ${activeTab === 'settings' ? 'flex' : 'hidden'} sm:flex`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Always Fit Resume
              </h1>
              <Link
                href="https://github.com/vladartym/always-fit-resume"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                className="text-neutral-500 hover:text-white transition-colors outline-none rounded data-focus-visible:ring-2 data-focus-visible:ring-white/60"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </Link>
            </div>
            <div className="text-neutral-400 text-sm leading-relaxed space-y-2">
              <p>
                A resume builder using{' '}
                <Link
                  href="https://github.com/chenglou/pretext"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors cursor-pointer outline-none rounded data-focus-visible:ring-2 data-focus-visible:ring-white/60"
                >
                  pretext
                </Link>{' '}
                for instant, DOM-free text measurement.
              </p>
              <p>
                Write markdown on the left. The preview auto-scales{' '}
                <span className="font-semibold text-neutral-300">
                  font size
                </span>{' '}
                and{' '}
                <span className="font-semibold text-neutral-300">
                  line spacing
                </span>{' '}
                to fit everything on one A4 page.
              </p>
            </div>
            <Button
              onPress={handleShuffle}
              className="mt-3 w-full px-3 py-2 text-sm font-medium border border-neutral-700 text-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-800 hover:text-white transition-colors outline-none data-focus-visible:ring-2 data-focus-visible:ring-white/60"
            >
              Shuffle Resume
            </Button>
          </div>

          {/* Auto-fit toggle */}
          <SwitchField isSelected={autoFit} onChange={setAutoFit}>
            <SwitchButton className="group flex w-full items-center justify-between cursor-pointer">
              <span className="text-xs text-neutral-500 uppercase tracking-widest">
                Auto-fit
              </span>
              <span className="w-10 h-5 rounded-full bg-neutral-700 group-data-selected:bg-emerald-500 transition-colors relative shrink-0 group-data-focus-visible:ring-2 group-data-focus-visible:ring-white/60 group-data-focus-visible:ring-offset-2 group-data-focus-visible:ring-offset-neutral-900">
                <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform group-data-selected:translate-x-5" />
              </span>
            </SwitchButton>
          </SwitchField>

          <SliderControl
            label="Max Font Size"
            value={maxFontSize}
            onChange={setMaxFontSize}
            min={8}
            max={24}
            step={0.5}
            format={v => `${v}px`}
            valueWidth="w-16"
          />

          <SliderControl
            label="Font Scale"
            value={fontSize}
            onChange={handleFontSizeSlider}
            min={6}
            max={24}
            step={0.01}
            format={v => `${((v / 16) * 100).toFixed(1)}%`}
            valueWidth="w-16"
          />

          <SliderControl
            label="Line Spacing"
            value={lineHeightMultiplier}
            onChange={handleLineHeightSlider}
            min={LINE_HEIGHT_MIN}
            max={LINE_HEIGHT_MAX}
            step={0.001}
            format={v => `${v.toFixed(2)}x`}
          />

          <SliderControl
            label="Page Margin"
            value={padding}
            onChange={setPadding}
            min={16}
            max={80}
            step={1}
            format={v => `${v}px`}
          />

          <SliderControl
            label="Section Spacing"
            value={sectionSpacing}
            onChange={setSectionSpacing}
            min={0}
            max={48}
            step={1}
            format={v => `${v}px`}
            tooltip="Gap before section headers like Experience, Education, and Skills."
          />

          <SliderControl
            label="Item Spacing"
            value={itemSpacing}
            onChange={setItemSpacing}
            min={0}
            max={30}
            step={1}
            format={v => `${v}px`}
            tooltip="Gap between entries within a section, like between different jobs or degrees."
          />

          <SliderControl
            label="Separator Spacing"
            value={separatorSpacing}
            onChange={setSeparatorSpacing}
            min={0}
            max={30}
            step={1}
            format={v => `${v}px`}
            tooltip="Padding above and below the horizontal rule divider."
          />

          {/* Page fit */}
          <Meter value={fillPercent}>
            <Label className="block text-xs text-neutral-500 uppercase tracking-widest mb-1.5">
              Page Fit
            </Label>
            <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${fillPercent}%`,
                  backgroundColor: fits
                    ? 'rgb(52, 211, 153)'
                    : 'rgb(248, 113, 113)',
                }}
              />
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span
                className={`font-medium ${fits ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {fits
                  ? 'Fits on 1 page'
                  : `Overflow +${measuredHeight - maxContentHeight}px`}
              </span>
              <span className="text-neutral-600 font-mono tabular-nums">
                {measuredHeight}/{maxContentHeight}px · {measureTime}ms
              </span>
            </div>
          </Meter>

          {/* Export */}
          <Button
            onPress={handleExportPdf}
            className="mt-auto w-full px-3 py-2 text-sm font-medium bg-white text-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-200 transition-colors outline-none data-focus-visible:ring-2 data-focus-visible:ring-white/60 data-focus-visible:ring-offset-2 data-focus-visible:ring-offset-neutral-900"
          >
            Export as PDF
          </Button>
        </div>
      </main>
    </div>
  );
}
