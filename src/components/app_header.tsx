import {
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import type {Key, ReactNode} from 'react';

import {cn} from '../lib/utils';
import {headerButton} from './ui/button';
import {
  ChevronDownIcon,
  DocumentIcon,
  DownloadIcon,
  ExamplesIcon,
  GithubIcon,
} from './icons';

export type SaveStatus = 'saved' | 'saving' | 'unavailable';

interface ResumeExample {
  id: string;
  label: string;
}

interface AppHeaderProps {
  examples: ResumeExample[];
  onExampleSelect: (id: string) => void;
  onExport: () => void;
  onUndoExample?: () => void;
  saveStatus: SaveStatus;
  settingsControl?: ReactNode;
}

const SAVE_LABELS: Record<SaveStatus, string> = {
  saved: 'Saved locally',
  saving: 'Saving…',
  unavailable: 'Local saving unavailable',
};

export function AppHeader({
  examples,
  onExampleSelect,
  onExport,
  onUndoExample,
  saveStatus,
  settingsControl,
}: AppHeaderProps) {
  const handleExampleAction = (key: Key) => onExampleSelect(String(key));

  return (
    <header className="relative z-30 flex h-14 shrink-0 grow-0 basis-14 items-center gap-4 border-b border-app-border bg-white/84 px-5 backdrop-blur-[18px] max-md:h-13 max-md:basis-13 max-md:gap-2 max-md:px-[0.7rem]">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-[0.55rem] border border-app-border bg-app-surface shadow-[0_1px_2px_oklch(0_0_0/5%)]">
          <DocumentIcon className="size-[0.95rem]" />
        </span>
        <span className="overflow-hidden text-sm font-[640] tracking-[-0.015em] text-ellipsis whitespace-nowrap max-[21rem]:hidden">
          One Page Resume
        </span>
      </div>

      <div
        className="group/save flex items-center gap-[0.4rem] whitespace-nowrap text-xs text-app-muted max-md:hidden"
        data-status={saveStatus}
        role="status"
      >
        <span className="size-1.5 rounded-full bg-app-success group-data-[status=saving]/save:bg-app-subtle group-data-[status=unavailable]/save:bg-app-danger" />
        <span>{SAVE_LABELS[saveStatus]}</span>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-1.5 max-md:gap-[0.2rem]">
        {onUndoExample && (
          <Button
            className={cn(
              headerButton({variant: 'quiet'}),
              'max-md:px-[0.55rem] max-[26rem]:absolute max-[26rem]:top-[calc(100%+0.5rem)] max-[26rem]:right-[0.7rem] max-[26rem]:border-app-border max-[26rem]:bg-white max-[26rem]:px-[0.65rem] max-[26rem]:shadow-[0_8px_24px_oklch(0_0_0/12%)]',
            )}
            onPress={onUndoExample}
          >
            Undo example
          </Button>
        )}

        <MenuTrigger>
          <Button
            className={cn(
              headerButton({variant: 'quiet'}),
              'max-md:w-8 max-md:p-0',
            )}
            aria-label="Choose a resume example"
          >
            <ExamplesIcon className="size-[0.95rem]" />
            <span className="max-md:hidden">Examples</span>
            <ChevronDownIcon className="size-3 max-md:hidden" />
          </Button>
          <Popover
            className="max-h-[min(26rem,var(--available-height))] min-w-52 overflow-auto rounded-[0.8rem] border border-white/10 bg-panel-raised p-[0.35rem] text-ink-96 shadow-[0_18px_50px_oklch(0_0_0/24%)] outline-none backdrop-blur-[20px] entering:animate-[popover-in_120ms_ease-out]"
            placement="bottom end"
            offset={8}
          >
            <Menu
              aria-label="Resume examples"
              className="outline-none"
              onAction={handleExampleAction}
            >
              {examples.map(example => (
                <MenuItem
                  id={example.id}
                  key={example.id}
                  className="cursor-default rounded-[0.55rem] px-[0.65rem] py-[0.55rem] text-[0.8rem] font-[540] text-ink-78 outline-none focused:bg-white/10 focused:text-white hovered:bg-white/10 hovered:text-white"
                >
                  {example.label}
                </MenuItem>
              ))}
            </Menu>
          </Popover>
        </MenuTrigger>

        <Link
          href="https://github.com/razvanborsan/one-page-resume"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className={cn(headerButton({variant: 'icon'}), 'max-md:hidden')}
        >
          <GithubIcon className="size-[0.95rem]" />
        </Link>

        {settingsControl}

        <Button
          className={cn(
            headerButton({variant: 'primary'}),
            'max-md:w-8 max-md:p-0',
          )}
          onPress={onExport}
        >
          <DownloadIcon className="size-[0.95rem]" />
          <span className="max-md:hidden">Export PDF</span>
        </Button>
      </div>
    </header>
  );
}
