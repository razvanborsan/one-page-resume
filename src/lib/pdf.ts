export interface ExportPdfOptions {
  pageWidth: number;
  markdown: string;
}

interface HiddenElement {
  el: HTMLElement;
  prev: string;
}

interface AncestorSaved {
  el: HTMLElement;
  overflow: string;
  transform: string;
  position: string;
  visibility: string;
  background: string;
}

export function exportPdf(
  pageEl: HTMLElement | null,
  {pageWidth, markdown}: ExportPdfOptions,
): void {
  if (!pageEl) return;

  const hiddenElements: HiddenElement[] = [];
  const ancestorSaved: AncestorSaved[] = [];
  let current: HTMLElement = pageEl;
  while (current.parentElement) {
    const parent = current.parentElement;
    for (const child of Array.from(parent.children)) {
      const sibling = child as HTMLElement;
      if (sibling !== current) {
        hiddenElements.push({el: sibling, prev: sibling.style.display});
        sibling.style.display = 'none';
      }
    }
    if (parent !== document.body) {
      ancestorSaved.push({
        el: parent,
        overflow: parent.style.overflow,
        transform: parent.style.transform,
        position: parent.style.position,
        visibility: parent.style.visibility,
        background: parent.style.background,
      });
      parent.style.overflow = 'visible';
      parent.style.transform = 'none';
      parent.style.visibility = 'visible';
      parent.style.background = 'none';
    }
    current = parent;
  }

  const pageSaved = {
    position: pageEl.style.position,
    top: pageEl.style.top,
    left: pageEl.style.left,
    transform: pageEl.style.transform,
    transformOrigin: pageEl.style.transformOrigin,
    boxShadow: pageEl.style.boxShadow,
    background: pageEl.style.background,
  };
  const printScale = 794 / pageWidth;
  pageEl.style.position = 'fixed';
  pageEl.style.top = '0';
  pageEl.style.left = '0';
  pageEl.style.transform = `scale(${printScale})`;
  pageEl.style.transformOrigin = 'top left';
  pageEl.style.boxShadow = 'none';
  pageEl.style.background = 'white';

  const guides = pageEl.querySelectorAll<HTMLElement>(
    '[data-margin-guide],[data-overflow]',
  );
  for (const g of guides) {
    g.style.display = 'none';
  }

  const style = document.createElement('style');
  style.textContent = `
    @page { size: A4; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body::before { display: none !important; }
  `;
  document.head.appendChild(style);

  const savedTitle = document.title;
  const nameMatch = markdown.match(/^# (.+)/m);
  document.title = nameMatch ? `${nameMatch[1]} Resume` : 'Resume';

  const restore = () => {
    style.remove();
    for (const g of guides) {
      g.style.display = '';
    }
    Object.assign(pageEl.style, pageSaved);
    for (const s of ancestorSaved) {
      s.el.style.overflow = s.overflow;
      s.el.style.transform = s.transform;
      s.el.style.position = s.position;
      s.el.style.visibility = s.visibility;
      s.el.style.background = s.background;
    }
    for (const h of hiddenElements) {
      h.el.style.display = h.prev;
    }
    document.title = savedTitle;
    window.onafterprint = null;
  };

  window.onafterprint = restore;
  window.print();
}
