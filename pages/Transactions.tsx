import React, { useState } from 'react';
import { useFinance, getCategoryIcon } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Search, Wallet, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const { state, dispatch, formatRupiah } = useFinance();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Swipe State
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const filtered = state.transactions.filter(t => {
    const cat = state.categories.find(c => c.id === t.categoryId);
    const matchesSearch = (t.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (cat?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>, id: string) => {
      e.stopPropagation();
      if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini? Saldo akan dikembalikan.")) {
          dispatch({ type: 'DELETE_TRANSACTION', payload: id });
          showToast('Transaksi berhasil dihapus', 'info');
          setSwipedId(null);
      }
  };

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent, id: string) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
      // Close other swipes when starting a new one
      if (swipedId && swipedId !== id) {
          setSwipedId(null);
      }
  };

  const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (id: string) => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
          setSwipedId(id);
      }
      
      if (isRightSwipe) {
          if (swipedId === id) setSwipedId(null);
      }
  };

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950 overflow-x-hidden">
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
             {filtered.map((t, index) => {
                 const cat = state.categories.find(c => c.id === t.categoryId);
                 const Icon = getCategoryIcon(cat?.icon || 'Circle');
                 const isSwiped = swipedId === t.id;

                 return (
                    <div key={t.id} className="relative rounded-xl overflow-hidden mb-3">
                        {/* Background Delete Button (Revealed on Swipe) */}
                        <div 
                            className="absolute inset-y-0 right-0 w-24 bg-red-500 flex items-center justify-center text-white cursor-pointer z-0 rounded-r-xl"
                            onClick={(e) => handleDelete(e, t.id)}
                        >
                            <Trash2 size={24} />
                        </div>

                        {/* Foreground Content */}
                        <div 
                            className={`bg-white dark:bg-slate-900 p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-slate-800 relative z-10 transition-transform duration-300 ease-out ${isSwiped ? '-translate-x-24' : 'translate-x-0'}`}
                            onTouchStart={(e) => onTouchStart(e, t.id)}
                            onTouchMove={onTouchMove}
                            onTouchEnd={() => onTouchEnd(t.id)}
                            onClick={() => { if(isSwiped) setSwipedId(null) }}
                        >
                            <div className="flex items-center gap-4 flex-1 overflow-hidden pointer-events-none">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0" style={{ backgroundColor: cat?.color || '#cbd5e1' }}>
                                    <Icon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-sm dark:text-white line-clamp-1">{t.note || cat?.name || 'Tanpa Keterangan'}</h4>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 ml-2">
                                <span className={`font-bold text-sm whitespace-nowrap pointer-events-none ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                                </span>
                                {/* Small delete button for desktop / accessibility */}
                                <button 
                                    onClick={(e) => handleDelete(e, t.id)}
                                    className={`p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer ${isSwiped ? 'opacity-0' : 'opacity-100'}`}
                                    title="Hapus Transaksi"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
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