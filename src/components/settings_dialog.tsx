import type {ReactNode} from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

import {cn} from '../lib/utils';
import {headerButton} from './ui/button';
import {SlidersIcon} from './icons';

interface SettingsDialogProps {
  children: (close: () => void) => ReactNode;
}

export function SettingsDialog({children}: SettingsDialogProps) {
  return (
    <DialogTrigger>
      <Button
        className={cn(
          headerButton({variant: 'quiet'}),
          'max-md:w-8 max-md:p-0',
        )}
        aria-label="Open resume style settings"
      >
        <SlidersIcon className="size-[0.95rem]" />
        <span className="max-md:hidden">Style</span>
      </Button>
      <ModalOverlay
        className="fixed inset-0 z-[100] flex items-end justify-center bg-scrim p-[0.6rem] backdrop-blur-[3px] entering:animate-[overlay-in_150ms_ease-out] md:max-[75rem]:items-stretch md:max-[75rem]:justify-end md:max-[75rem]:p-3"
        isDismissable
      >
        <Modal className="h-[min(86svh,46rem)] w-[min(100%,28rem)] overflow-hidden rounded-panel outline-none entering:animate-[sheet-in_180ms_ease-out] md:max-[75rem]:h-full md:max-[75rem]:w-[17rem] md:max-[75rem]:max-h-none md:max-[75rem]:entering:animate-[side-sheet-in_180ms_ease-out]">
          <Dialog
            aria-label="Resume style settings"
            className="h-full w-full outline-none"
          >
            {({close}) => children(close)}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
