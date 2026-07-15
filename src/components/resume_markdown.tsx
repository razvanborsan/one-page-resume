import {memo} from 'react';
import Markdown from 'react-markdown';
import type {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COMPONENTS: Components = {
  table: ({node: _node, ...props}) => (
    <div className="typeset-scroll pagefit-scrollbar">
      <table {...props} />
    </div>
  ),
};

export const ResumeMarkdown = memo(function ResumeMarkdown({
  children,
}: {
  children: string;
}) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={COMPONENTS}>
      {children}
    </Markdown>
  );
});
