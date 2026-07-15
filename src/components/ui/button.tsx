import {cva} from 'class-variance-authority';

/**
 * Header button styling, shared by the text buttons (quiet / primary) and the
 * icon-only buttons in the app header. Returns a class string so it works with
 * both `Button` and `Link` from react-aria-components.
 *
 * Values mirror the previous `.header-button*` CSS exactly; RAC interaction
 * state is expressed with the `hovered:` / `pressed:` / `focus-visible:`
 * custom variants registered in index.css.
 */
export const headerButton = cva(
  'flex h-8 cursor-pointer items-center justify-center gap-[0.45rem] rounded-[0.6rem] border border-transparent leading-none no-underline outline-none transition-[background-color,border-color,color,transform] duration-[120ms] pressed:translate-y-px focus-visible:shadow-[0_0_0_2px_var(--app-surface),0_0_0_4px_var(--app-ring)]',
  {
    variants: {
      variant: {
        quiet:
          'bg-transparent px-[0.7rem] text-[0.78rem] font-[570] text-app-muted hovered:bg-app-surface-hover hovered:text-app-foreground',
        primary:
          'bg-app-foreground px-[0.8rem] text-[0.78rem] font-[570] text-white shadow-[0_1px_2px_oklch(0_0_0/12%)] hovered:bg-[oklch(0.28_0_0)]',
        icon: 'w-8 bg-transparent p-0 text-app-muted hovered:bg-app-surface-hover hovered:text-app-foreground',
      },
    },
    defaultVariants: {variant: 'quiet'},
  },
);
