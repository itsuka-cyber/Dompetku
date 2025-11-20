import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIosDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      // Show IOS prompt after a small delay if not dismissed before
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
         setTimeout(() => setIsVisible(true), 2000);
      }
    }

    // Check for Android/Desktop Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed it recently
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remind again in future session, or set permanent dismiss:
    // localStorage.setItem('pwa_prompt_dismissed', 'true'); 
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none pb-safe">
      <div className="bg-white dark:bg-slate-800 m-4 p-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 pointer-events-auto w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-300">
        
        <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
                <div className="bg-gradient-to-br from-primary to-secondary w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white">
                    <Download size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Install Aplikasi</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-tight">
                        Pasang DompetKu di HP kamu agar lebih cepat dan bisa dipakai offline!
                    </p>
                </div>
            </div>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={20} />
            </button>
        </div>

        {isIOS ? (
            <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl text-sm text-gray-600 dark:text-slate-300 space-y-2">
                <p className="flex items-center gap-2">
                    1. Tap tombol <Share size={16} className="text-blue-500"/> <strong>Share</strong> di bawah browser.
                </p>
                <p className="flex items-center gap-2">
                    2. Pilih <PlusSquare size={16} className="text-gray-500"/> <strong>Add to Home Screen</strong>.
                </p>
            </div>
        ) : (
            <button 
                onClick={handleInstallClick}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-transform"
            >
                Install Sekarang
            </button>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;