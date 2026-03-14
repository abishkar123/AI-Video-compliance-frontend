import React, { useRef } from 'react';
import { Search, Zap, Upload, Loader2 } from 'lucide-react';
import { showError } from '../utils/toast';
import { Card } from './shared/Card';

interface AuditFormProps {
  videoUrl: string;
  isSubmitting: boolean;
  onVideoUrlChange: (url: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  videoUrl,
  isSubmitting,
  onVideoUrlChange,
  onFileSelect,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      showError('Please enter a video URL');
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      showError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(videoUrl)) {
      onSubmit(e);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="max-w-2xl mx-auto p-8 border-slate-200">
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Upload video for audit
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select a video or paste a link from YouTube/TikTok
            </p>
          </div>

          <div
            className="border-2 border-dashed border-slate-300 hover:border-sky-500/50 hover:bg-sky-50/50 transition-all rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer group relative"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={onFileSelect}
              disabled={isSubmitting}
            />
            <div className="w-16 h-16 bg-slate-100 group-hover:bg-slate-200 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-sky-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Select video to upload
            </h3>
            <p className="text-slate-500 text-sm mb-6">Or drag and drop a file</p>
            <p className="text-xs text-slate-400 mb-6">MP4 or WebM • Up to 10 minutes</p>

            <button
              type="button"
              className="bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold py-2.5 px-6 rounded-lg transition-colors border border-transparent hover:border-sky-200 focus:outline-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              Select file
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold tracking-widest my-6 uppercase">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span>Or paste link</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-4 top-0 bottom-0 flex items-center justify-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="url-input"
              type="url"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              placeholder="e.g., https://youtube.com/watch?v=..."
              className="w-full pl-12 pr-40 py-4 bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all text-slate-900 text-sm shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              Analyze
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
