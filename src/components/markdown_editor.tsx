import {memo} from 'react';
import {Label, TextArea, TextField} from 'react-aria-components';

interface MarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor = memo(function MarkdownEditor({
  markdown,
  onChange,
}: MarkdownEditorProps) {
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;

  return (
    <TextField value={markdown} onChange={onChange} className="editor-panel">
      <div className="panel-header editor-header">
        <div>
          <span className="panel-eyebrow">Document</span>
          <Label className="panel-title">Markdown</Label>
        </div>
        <span className="editor-word-count">{wordCount} words</span>
      </div>
      <TextArea
        spellCheck={false}
        aria-label="Resume Markdown"
        className="markdown-textarea app-scrollbar"
      />
    </TextField>
  );
});
