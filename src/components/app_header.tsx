import {
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components';
import type {Key, ReactNode} from 'react';

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
    <header className="app-header">
      <div className="app-brand">
        <span className="app-mark">
          <DocumentIcon />
        </span>
        <span className="app-title">One Page Resume</span>
      </div>

      <div className="save-status" data-status={saveStatus} role="status">
        <span className="save-status-dot" />
        <span>{SAVE_LABELS[saveStatus]}</span>
      </div>

      <div className="app-actions">
        {onUndoExample && (
          <Button
            className="header-button header-button-quiet undo-example-button"
            onPress={onUndoExample}
          >
            Undo example
          </Button>
        )}

        <MenuTrigger>
          <Button
            className="header-button header-button-quiet"
            aria-label="Choose a resume example"
          >
            <ExamplesIcon className="button-icon examples-icon" />
            <span className="header-action-label">Examples</span>
            <ChevronDownIcon className="button-icon button-icon-small" />
          </Button>
          <Popover
            className="example-popover"
            placement="bottom end"
            offset={8}
          >
            <Menu
              aria-label="Resume examples"
              className="example-menu"
              onAction={handleExampleAction}
            >
              {examples.map(example => (
                <MenuItem
                  id={example.id}
                  key={example.id}
                  className="example-menu-item"
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
          className="header-icon-button github-action"
        >
          <GithubIcon />
        </Link>

        {settingsControl}

        <Button
          className="header-button header-button-primary"
          onPress={onExport}
        >
          <DownloadIcon className="button-icon" />
          <span className="export-label">Export PDF</span>
        </Button>
      </div>
    </header>
  );
}
