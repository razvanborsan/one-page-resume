import type {ReactNode} from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

import {SlidersIcon} from './icons';

interface SettingsDialogProps {
  children: (close: () => void) => ReactNode;
}

export function SettingsDialog({children}: SettingsDialogProps) {
  return (
    <DialogTrigger>
      <Button
        className="header-button header-button-quiet style-trigger"
        aria-label="Open resume style settings"
      >
        <SlidersIcon className="button-icon" />
        <span className="style-trigger-label">Style</span>
      </Button>
      <ModalOverlay className="settings-modal-overlay" isDismissable>
        <Modal className="settings-modal">
          <Dialog
            aria-label="Resume style settings"
            className="settings-dialog"
          >
            {({close}) => children(close)}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
