import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {page, userEvent} from 'vitest/browser';
import {render} from 'vitest-browser-react';

import {App} from './app';
import './index.css';

const STORAGE_KEY = 'one-page-resume:markdown';

async function openStyleSettingsIfNeeded() {
  const trigger = page.getByRole('button', {
    name: 'Open resume style settings',
  });
  if (trigger.query()) await trigger.click();
}

describe('App resume preview', () => {
  beforeEach(() => {
    localStorage.setItem(
      STORAGE_KEY,
      [
        '# Semantic preview',
        '',
        '## Experience',
        '',
        '- [x] Styled task item',
        '  - Nested list item',
        '',
        '| Feature | Status |',
        '| --- | --- |',
        '| Escaped \\| pipe | **Ready** |',
        '',
        'Visit [**the docs**](https://example.com) and ~~remove this~~.',
        '',
        '```tsx',
        'const answer = 42;',
        '```',
      ].join('\n'),
    );
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('renders GFM as semantic content inside the resume Typeset preset', async () => {
    await render(<App />);

    const preview = document.querySelector<HTMLElement>(
      '[data-pagefit-page] .typeset',
    );
    expect(preview).not.toBeNull();
    expect(preview?.classList.contains('typeset-resume')).toBe(true);
    expect(preview?.querySelector('h1')?.textContent).toBe('Semantic preview');
    expect(preview?.querySelector('input[type="checkbox"]')).toBeChecked();
    expect(preview?.querySelector('ul ul > li')?.textContent).toBe(
      'Nested list item',
    );
    expect(preview?.querySelector('table thead th')?.textContent).toBe(
      'Feature',
    );
    expect(preview?.querySelector('table tbody td')?.textContent).toBe(
      'Escaped | pipe',
    );
    expect(preview?.querySelector('.typeset-scroll > table')).not.toBeNull();
    expect(preview?.querySelector('a > strong')?.textContent).toBe('the docs');
    expect(preview?.querySelector('del')?.textContent).toBe('remove this');
    expect(preview?.querySelector('pre > code')?.textContent).toBe(
      'const answer = 42;\n',
    );

    const heading = preview?.querySelector('h1');
    const taskList = preview?.querySelector('ul.contains-task-list');
    const nestedList = preview?.querySelector('ul ul');
    const table = preview?.querySelector('table');
    const code = preview?.querySelector('pre');
    if (!heading || !taskList || !nestedList || !table || !code) {
      throw new Error(
        'The Typeset preview did not render every expected element.',
      );
    }
    expect(getComputedStyle(heading).fontFamily).toContain('Geist Variable');
    expect(getComputedStyle(taskList).listStyleType).toBe('none');
    expect(getComputedStyle(nestedList).listStyleType).toBe('circle');
    expect(getComputedStyle(table).borderBlockEndStyle).toBe('solid');
    expect(getComputedStyle(code).fontFamily).toContain('Geist Mono Variable');
  });

  it('establishes a visible light theme on the white paper', async () => {
    await render(<App />);

    const paper = document.querySelector<HTMLElement>('[data-pagefit-page]');
    const content = paper?.querySelector<HTMLElement>('[data-resume-content]');
    const heading = content?.querySelector<HTMLElement>('h1');
    if (!paper || !content || !heading) {
      throw new Error('The resume preview did not render.');
    }

    expect(getComputedStyle(paper).backgroundColor).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(content).color).toBe('rgb(23, 23, 23)');
    expect(getComputedStyle(heading).color).toBe('rgb(23, 23, 23)');
  });

  it('fits against the rendered Typeset height and applies spacing controls', async () => {
    await render(<App />);
    await document.fonts.ready;

    const paper = document.querySelector<HTMLElement>('[data-pagefit-page]');
    const content = paper?.querySelector<HTMLElement>('[data-resume-content]');
    if (!paper || !content) {
      throw new Error('The resume preview did not render.');
    }

    await expect
      .poll(() => content.scrollHeight <= paper.clientHeight)
      .toBe(true);
    expect(document.body.textContent).toContain('Fits on 1 page');
    expect(paper.querySelector('[data-overflow]')).toBeNull();

    await openStyleSettingsIfNeeded();
    await page.getByRole('slider', {name: 'Sections'}).fill('30');
    const section = content.querySelector<HTMLElement>('h2');
    if (!section) {
      throw new Error('The test resume needs a section heading.');
    }
    await expect
      .poll(() => getComputedStyle(section).marginBlockStart)
      .toBe('30px');

    await expect
      .poll(() => content.scrollHeight <= paper.clientHeight)
      .toBe(true);
  });

  it('keeps margin guides opt-in and exposes them from the preview toolbar', async () => {
    await render(<App />);

    const paper = document.querySelector<HTMLElement>('[data-pagefit-page]');
    if (!paper) throw new Error('The resume preview did not render.');

    expect(paper.querySelector('[data-margin-guide]')).toBeNull();
    await page.getByRole('button', {name: 'Show margin guides'}).click();
    expect(paper.querySelector('[data-margin-guide]')).not.toBeNull();
  });

  it('shows manual typography controls only when auto-fit is disabled', async () => {
    await render(<App />);
    await openStyleSettingsIfNeeded();

    await expect
      .element(page.getByRole('slider', {name: 'Maximum text size'}))
      .toBeVisible();
    expect(
      page.getByRole('slider', {name: 'Text size', exact: true}).query(),
    ).toBeNull();

    const autoFitInput = await page.getByRole('switch').findElement();
    const autoFitSwitch = autoFitInput.closest<HTMLElement>('.switch-control');
    if (!autoFitSwitch) throw new Error('The auto-fit switch did not render.');
    await userEvent.click(autoFitSwitch);

    await expect
      .element(page.getByText('Text size', {exact: true}))
      .toBeVisible();
    await expect
      .element(page.getByText('Line height', {exact: true}))
      .toBeVisible();
  });

  it('loads named examples without losing the previous document', async () => {
    await render(<App />);

    await page.getByRole('button', {name: 'Choose a resume example'}).click();
    await page.getByRole('menuitem', {name: 'Milo Vex'}).click();
    await expect.element(page.getByText('Undo example')).toBeVisible();

    await page.getByText('Undo example').click();
    await expect
      .element(page.getByRole('heading', {name: 'Semantic preview'}))
      .toBeVisible();
  });
});
