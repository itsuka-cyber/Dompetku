import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShieldCheck, PieChart } from 'lucide-react';

const Onboarding = () => {
  const { dispatch } = useFinance();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const slides = [
    {
      icon: Wallet,
      title: "Kelola Keuangan",
      desc: "Catat pemasukan dan pengeluaranmu dengan mudah dan cepat, tanpa internet."
    },
    {
      icon: PieChart,
      title: "Analisis Visual",
      desc: "Pantau kemana uangmu pergi dengan grafik interaktif yang menarik."
    },
    {
      icon: ShieldCheck,
      title: "Data Aman",
      desc: "Semua data tersimpan di HP kamu sendiri. Aman dan privasi terjaga."
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
        // Last step logic
    }
  };

  const handleFinish = () => {
      if(!name) return alert("Masukkan namamu dulu ya!");
      dispatch({ type: 'SET_ONBOARDING', payload: { done: true, name } });
      navigate('/');
  };

  const CurrentIcon = slides[step].icon;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center p-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200 dark:bg-teal-900/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10">
        <div className="mb-12 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform rotate-3">
                <CurrentIcon size={48} className="text-white" />
            </div>
        </div>

        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{slides[step].title}</h1>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">{slides[step].desc}</p>
        </div>

        {/* Input name at last step */}
        {step === slides.length - 1 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                <input 
                    type="text" 
                    placeholder="Siapa namamu?" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none text-center text-lg"
                />
            </div>
        )}

        <div className="flex gap-2 justify-center mb-12">
            {slides.map((_, idx) => (
                <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200 dark:bg-slate-800'}`}></div>
            ))}
        </div>

        <button 
            onClick={step === slides.length - 1 ? handleFinish : handleNext}
            className="w-full py-4 bg-gray-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
        >
            {step === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
