import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Sparkles, X } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface WhatsAppShareWidgetProps {
  currentUrl?: string;
}

export const WhatsAppShareWidget: React.FC<WhatsAppShareWidgetProps> = ({ currentUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback to current browser location or standard app URL
  const siteUrl = typeof window !== 'undefined' 
    ? (currentUrl || window.location.href)
    : 'https://ais-pre-7jhft7fsbc4nlbh5xm6kd6-859149636008.asia-southeast1.run.app';

  const defaultShareMessage = `✨ Discover *openToSeeYourFuture* by Neha Arora ✨\n\nI just found this intuitive tarot reading sanctuary. You can do interactive card pulls (One Card, Past-Present-Future, Love & Celtic Cross spreads) and explore sacred ritual goods!\n\n🔮 Try your complimentary card reading here:\n${siteUrl}`;

  const whatsappDirectUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareMessage)}`;

  const handleOpenWhatsApp = () => {
    playChimeSound();
    window.open(whatsappDirectUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    playChimeSound();
    navigator.clipboard?.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMessage = () => {
    playChimeSound();
    navigator.clipboard?.writeText(defaultShareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Pill on bottom right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            playChimeSound();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#1C1A18] hover:bg-[#25D366] text-[#F5F1EB] rounded-full shadow-xl border border-[#C4A484]/40 hover:border-[#25D366] transition-all duration-300 group cursor-pointer"
          title="Share openToSeeYourFuture on WhatsApp"
        >
          <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">
            Share on WhatsApp
          </span>
        </button>
      </div>

      {/* Share Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-[#FAF7F2] rounded-xl border border-[#C4A484]/40 shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#E6E0D6]/50 cursor-pointer"
              aria-label="Close Share Dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#A98765] font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Share Sacred Sanctuary</span>
              </div>
              <h3 className="font-serif text-2xl text-[#1A1A1A]">
                Share on WhatsApp
              </h3>
              <p className="text-xs text-[#8E8271] font-light mt-1">
                Send an invitation to your friends, lovers, or family circle to draw their tarot cards on openToSeeYourFuture.
              </p>
            </div>

            {/* Preview Box */}
            <div className="p-3.5 bg-[#FCFAF7] rounded-lg border border-[#E6E0D6] space-y-2 text-xs text-[#1A1A1A]/80 font-mono leading-relaxed">
              <span className="text-[9px] uppercase tracking-wider text-[#8E8271] font-sans font-medium block">
                Message Preview:
              </span>
              <p className="line-clamp-4 italic text-[11px]">
                "{defaultShareMessage}"
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-medium rounded-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open in WhatsApp Directly</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyMessage}
                  className="py-2.5 px-3 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] bg-[#FCFAF7] text-[#1A1A1A] text-[11px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Text' : 'Copy Message'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] bg-[#FCFAF7] text-[#1A1A1A] text-[11px] uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Web Link</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-center text-[#8E8271] italic">
              Works on WhatsApp Web, Android, iOS and Desktop.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
