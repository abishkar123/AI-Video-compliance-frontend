import React from 'react';
import { FileText, Upload } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-700 text-[var(--text-primary)]">
          Compliance Documents
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage the PDFs that form your RAG knowledge base.
        </p>
      </div>

      <div className="card p-6 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                        bg-brand-600/15 border border-brand-600/25 mb-2">
          <FileText className="w-6 h-6 text-brand-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
            Add PDFs to <code className="font-mono text-brand-400 text-xs">backend/data/</code>
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Then run <code className="font-mono text-brand-400">npm run index-docs</code> from the
            backend directory to chunk and embed them into Azure AI Search.
          </p>
        </div>
        <div className="text-left border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-surface)]">
          <p className="label mb-2">Quick start</p>
          <pre className="text-xs font-mono text-[var(--text-muted)] whitespace-pre-wrap">
{`# 1. Add compliance PDFs
cp ftc-guidelines.pdf backend/data/
cp youtube-policies.pdf backend/data/

# 2. Index them
cd backend && npm run index-docs`}
          </pre>
        </div>
      </div>
    </div>
  );
}
