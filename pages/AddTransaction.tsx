import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance, getCategoryIcon, iconMap } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Category } from '../types';
import { ChevronLeft, Calendar, FileText, Plus, X } from 'lucide-react';

const AddTransaction = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Category Creation Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Circle');

  const filteredCategories = state.categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      amount: parseInt(amount),
      categoryId,
      type,
      date: new Date(date).toISOString(),
      note,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    showToast('Transaksi berhasil disimpan', 'success');
    navigate('/');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newCatName) return;

      const newCat: Category = {
          id: crypto.randomUUID(),
          name: newCatName,
          icon: newCatIcon,
          color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
          type
      };
      dispatch({ type: 'ADD_CATEGORY', payload: newCat });
      setCategoryId(newCat.id);
      
      // Reset
      setShowCatModal(false);
      setNewCatName('');
      setNewCatIcon('Circle');
      showToast('Kategori berhasil dibuat', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 relative">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full dark:text-white">
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold dark:text-white">Tambah Transaksi</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        
        {/* Type Toggle */}
        <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategoryId(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              type === 'expense' 
                ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' 
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategoryId(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              type === 'income' 
                ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' 
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            Pemasukan
          </button>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Jumlah (Rp)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-slate-700 focus:border-primary outline-none py-2 dark:text-white placeholder-gray-300"
            autoFocus
            required
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Kategori</label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map(cat => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                    categoryId === cat.id 
                      ? 'border-primary bg-primary/5 dark:bg-primary/20' 
                      : 'border-transparent bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm mb-1" style={{ backgroundColor: cat.color }}>
                      <Icon size={20} />
                  </div>
                  <span className="text-[10px] text-center font-medium dark:text-slate-300 truncate w-full">{cat.name}</span>
                </button>
              );
            })}
            <button 
                type="button" 
                onClick={() => setShowCatModal(true)}
                className="flex flex-col items-center p-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800"
            >
                 <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-slate-800 mb-1">
                    <Plus size={20} />
                 </div>
                 <span className="text-[10px] text-center font-medium text-gray-400">Tambah</span>
            </button>
          </div>
        </div>

        {/* Date & Note */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
                <Calendar className="text-gray-400" size={20} />
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 bg-transparent outline-none dark:text-white"
                />
            </div>
            <div className="flex items-center gap-3">
                <FileText className="text-gray-400" size={20} />
                <input 
                    type="text" 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Catatan (Opsional)"
                    className="flex-1 bg-transparent outline-none dark:text-white"
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={!amount || !categoryId}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none mt-8 active:scale-[0.98] transition-transform"
        >
          Simpan Transaksi
        </button>
      </form>

      {/* Custom Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg dark:text-white">Buat Kategori Baru</h3>
                    <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Kategori</label>
                        <input 
                            type="text" 
                            value={newCatName}
                            onChange={e => setNewCatName(e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:border-primary outline-none dark:text-white"
                            placeholder="Misal: Jajan, Pulsa"
                            autoFocus
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-2 block">Pilih Ikon</label>
                        <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                            {Object.keys(iconMap).map((iconName) => {
                                const Icon = iconMap[iconName];
                                const isSelected = newCatIcon === iconName;
                                return (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => setNewCatIcon(iconName)}
                                        className={`p-2 rounded-lg flex items-center justify-center transition-all aspect-square ${
                                            isSelected 
                                            ? 'bg-primary text-white shadow-md' 
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon size={20} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 mt-2">
                        Simpan Kategori
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AddTransaction;