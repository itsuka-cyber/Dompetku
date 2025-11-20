import React, { useState } from 'react';
import { useFinance, getCategoryIcon } from '../context/FinanceContext';
import { ArrowLeft, Search, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const { state, formatRupiah } = useFinance();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = state.transactions.filter(t => {
    const cat = state.categories.find(c => c.id === t.categoryId);
    const matchesSearch = (t.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (cat?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-slate-950 z-10 py-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full dark:text-white">
                <ArrowLeft />
            </button>
            <h1 className="text-xl font-bold dark:text-white">Riwayat Transaksi</h1>
        </div>

        <div className="space-y-4 mb-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input
                    type="text"
                    placeholder="Cari catatan atau kategori..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 outline-none focus:border-primary dark:text-white transition-colors"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['all', 'income', 'expense'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                            filterType === type 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-800'
                        }`}
                    >
                        {type === 'all' ? 'Semua' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3">
             {filtered.map(t => {
                 const cat = state.categories.find(c => c.id === t.categoryId);
                 const Icon = getCategoryIcon(cat?.icon || 'Circle');
                 return (
                    <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: cat?.color || '#cbd5e1' }}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm dark:text-white line-clamp-1">{t.note || cat?.name || 'Tanpa Keterangan'}</h4>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                            </div>
                        </div>
                        <span className={`font-bold text-sm whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                        </span>
                    </div>
                 );
             })}
             {filtered.length === 0 && (
                 <div className="text-center py-20 text-gray-400">
                     <p>Tidak ada transaksi ditemukan.</p>
                 </div>
             )}
        </div>
    </div>
  );
};

export default Transactions;