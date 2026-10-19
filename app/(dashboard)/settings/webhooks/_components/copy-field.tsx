'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

/** Salt-okunur bir degeri kopyalama butonuyla gosterir. */
export function CopyField({ label, value, mono = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} kopyalandı`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Kopyalanamadı');
    }
  }

  return (
    <div>
      <p className="mb-1 text-[12px] font-medium text-[#5c5a52]">{label}</p>
      <div className="flex items-stretch gap-2">
        <code
          className={`flex-1 overflow-x-auto rounded-[8px] border border-[#e8e1cf] bg-[#fbf8f1] px-3 py-2 text-[12px] text-[#1a1a18] ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border border-[#e8e1cf] bg-white px-3 text-[12px] font-medium text-[#1a1a18] hover:bg-[#f4efe3]"
        >
          {copied ? (
            <Check className="size-3.5 text-[#1f8a5b]" />
          ) : (
            <Copy className="size-3.5" />
          )}
          Kopyala
        </button>
      </div>
    </div>
  );
}
