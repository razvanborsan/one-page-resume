import {memo} from 'react';
import {Label, TextArea, TextField} from 'react-aria-components';

interface MarkdownEditorProps {
  active: boolean;
  markdown: string;
  onChange: (value: string) => void;
}

export const MarkdownEditor = memo(function MarkdownEditor({
  active,
  markdown,
  onChange,
}: MarkdownEditorProps) {
  return (
    <TextField
      value={markdown}
      onChange={onChange}
      className={`flex-1 min-w-0 self-stretch border-r border-neutral-800 flex-col ${active ? 'flex' : 'hidden'} sm:flex`}
    >
      <div className="px-4 py-3 border-b border-neutral-800">
        <Label className="text-xs text-neutral-500 uppercase tracking-widest">
          Markdown
        </Label>
      </div>
      <TextArea
        spellCheck={false}
        className="flex-1 bg-transparent text-neutral-300 text-sm font-mono leading-relaxed p-4 resize-none outline-none ring-0 focus:outline-none focus:ring-0 border-none placeholder-neutral-600 pagefit-scrollbar"
        style={{caretColor: '#fff'}}
      />
    </TextField>
  );
});
