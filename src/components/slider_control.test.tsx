import {describe, it, expect} from 'vitest';
import {page} from 'vitest/browser';
import {render} from 'vitest-browser-react';

import {SliderControl} from './slider_control';

describe('SliderControl', () => {
  it('displays the provided label', async () => {
    await render(
      <SliderControl
        label="Font size"
        value={14}
        onChange={() => {}}
        min={8}
        max={20}
        step={1}
      />,
    );

    await expect.element(page.getByText('Font size')).toBeVisible();
  });

  it('formats the value with the given formatter', async () => {
    await render(
      <SliderControl
        label="Font size"
        value={14}
        onChange={() => {}}
        min={8}
        max={20}
        step={1}
        format={v => `${v}px`}
      />,
    );

    await expect.element(page.getByText('14px')).toBeVisible();
  });

  it('displays the raw value when no formatter is provided', async () => {
    await render(
      <SliderControl
        label="Zoom"
        value={2}
        onChange={() => {}}
        min={0}
        max={4}
        step={1}
      />,
    );

    await expect.element(page.getByText('2')).toBeVisible();
  });

  it('renders a range slider bound to the given min, max, and value', async () => {
    await render(
      <SliderControl
        label="Zoom"
        value={1}
        onChange={() => {}}
        min={0}
        max={2}
        step={0.1}
      />,
    );

    const slider = page.getByRole('slider');
    await expect.element(slider).toHaveValue('1');
    await expect.element(slider).toHaveAttribute('min', '0');
    await expect.element(slider).toHaveAttribute('max', '2');
  });

  it('updates the displayed value when the value prop changes', async () => {
    const {rerender} = await render(
      <SliderControl
        label="Zoom"
        value={1}
        onChange={() => {}}
        min={0}
        max={2}
        step={0.1}
        format={v => `${v.toFixed(1)}x`}
      />,
    );

    await rerender(
      <SliderControl
        label="Zoom"
        value={1.5}
        onChange={() => {}}
        min={0}
        max={2}
        step={0.1}
        format={v => `${v.toFixed(1)}x`}
      />,
    );

    await expect.element(page.getByText('1.5x')).toBeVisible();
  });

  it('reports the new value to onChange when the user moves the slider', async () => {
    let reportedValue: number | undefined;
    await render(
      <SliderControl
        label="Zoom"
        value={1}
        onChange={v => {
          reportedValue = v;
        }}
        min={0}
        max={2}
        step={0.5}
      />,
    );

    await page.getByRole('slider').fill('1.5');

    expect(reportedValue).toBe(1.5);
  });
});
