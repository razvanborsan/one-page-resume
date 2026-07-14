# One Page Resume

A resume builder that auto-scales font size and line spacing to always fit on one A4 page.

Write your resume in Markdown. The preview renders semantic HTML with
[react-markdown](https://github.com/remarkjs/react-markdown), GFM extensions,
and [shadcn/typeset](https://ui.shadcn.com/docs/typeset).

## Features

- **Auto-fit**: Binary search finds the optimal font size and line height to fill exactly one page
- **Markdown editor**: Render headings, lists, links, tables, task lists, blockquotes, and fenced code
- **Live preview**: Scaled A4 page preview updates as you type
- **Fine-grained controls**: Font size, line spacing, page margin, section spacing, item spacing, separator spacing
- **PDF export**: Print to PDF with proper A4 sizing
- **Mobile friendly**: Tab-based layout on small screens
- **10 sample resumes**: Hit "Shuffle" to see different layouts

## Quick Start

```bash
git clone https://github.com/razvanborsan/one-page-resume.git
cd one-page-resume
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## How It Works

Markdown is parsed into semantic React elements and styled by a CV-specific
Typeset preset. Because the browser is the final authority on font metrics,
wrapping, tables, and CSS spacing, the auto-fit calculation measures that same
rendered element rather than maintaining a second approximation of the layout.

The fitter performs a small binary search directly against the preview:

**Pass 1**: Binary search for the maximum font size at the tightest line spacing (1.15x).

**Pass 2**: With that font size locked, binary search for the maximum line height (up to 1.8x) that still fits.

The result is a preview and page-fit indicator derived from the same DOM that is
exported to PDF. Add more content and the font shrinks; remove content and it
grows.

### PDF Export

The export uses the browser's native `window.print()` — no server, no headless browser, no PDF library. Before printing, it temporarily restructures the page: hides everything except the resume, removes the scaled preview transform, repositions the page at the top-left of the viewport at the exact scale needed to fill an A4 sheet (794px wide), injects a `@page { size: A4; margin: 0 }` style, and sets the document title to the person's name so the downloaded file is named nicely. After printing (or cancelling), all styles are restored. The result is a pixel-perfect A4 PDF that matches what you see in the preview.

## Markdown Format

```markdown
# Your Name

Your Title
City, State · email@example.com · github.com/you

---

A brief summary about yourself.

## EXPERIENCE

### Job Title — Company

2020 — Present

- Accomplishment one
- Accomplishment two

## EDUCATION

### Degree — University

Details about your education

## SKILLS

Skill 1 · Skill 2 · Skill 3
```

## Tech Stack

- [React](https://react.dev)
- [react-markdown](https://github.com/remarkjs/react-markdown) with [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [shadcn/typeset](https://ui.shadcn.com/docs/typeset)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vite.dev)

## Credits

Forked from [always-fit-resume](https://github.com/vladartym/always-fit-resume) by Vlad Artym.

## License

MIT
