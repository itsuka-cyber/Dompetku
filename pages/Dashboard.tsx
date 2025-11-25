import React, { useState } from 'react';
import { useFinance, getCategoryIcon } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank, Plus, ArrowRight, MoreHorizontal, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { state, formatRupiah, dispatch } = useFinance();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = state.transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const budgetProgress = state.budget.limit > 0 ? Math.min((monthlyExpenses / state.budget.limit) * 100, 100) : 0;

  // Data for mini pie chart
  const expenseCategories = state.categories.filter(c => c.type === 'expense');
  const pieData = expenseCategories.map(cat => ({
    name: cat.name,
    value: state.transactions
        .filter(t => t.categoryId === cat.id && new Date(t.date).getMonth() === currentMonth)
        .reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(d => d.value > 0);


  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if(!transferAmount) return;
    const amount = parseInt(transferAmount);
    dispatch({ type: 'TRANSFER_TO_SAVINGS', payload: amount });
    showToast(amount > 0 ? 'Berhasil ditabung!' : 'Penarikan berhasil!', 'success');
    setTransferAmount('');
    setShowTransfer(false);
  };

  return (
    <div className="p-5 pb-24 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">Halo,</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{state.userName || 'Pengguna'}</h1>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
          {(state.userName?.[0] || 'U').toUpperCase()}
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm mb-1">Saldo Utama</p>
          <h2 className="text-3xl font-bold mb-6">{formatRupiah(state.balance)}</h2>
          
          <div className="flex justify-between items-end">
            <div>
                <p className="text-indigo-100 text-xs mb-1">Tabungan</p>
                <p className="font-semibold flex items-center gap-2">
                    <PiggyBank size={16} /> {formatRupiah(state.savings)}
                </p>
            </div>
            <button 
                onClick={() => setShowTransfer(!showTransfer)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                {showTransfer ? 'Batal' : 'Tabung'}
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Input Area */}
      {showTransfer && (
          <form onSubmit={handleTransfer} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
              <label className="block text-sm font-medium mb-2 dark:text-slate-300">Transfer ke Tabungan (atau (-) untuk tarik)</label>
              <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="Contoh: 50000"
                  />
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-medium">
                      Proses
                  </button>
              </div>
          </form>
      )}

      {/* Budget Stats */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 relative">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Budget Bulanan</h3>
            <span className="text-xs text-gray-500">
                {state.budget.enabled ? `${Math.round(budgetProgress)}% terpakai` : 'Tidak Aktif'}
            </span>
        </div>
        
        {state.budget.enabled ? (
            <>
                <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            budgetProgress > 90 ? 'bg-red-500' : budgetProgress > 75 ? 'bg-orange-500' : 'bg-primary'
                        }`}
                        style={{ width: `${budgetProgress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400">
                    <span>Terpakai: {formatRupiah(monthlyExpenses)}</span>
                    <span>Limit: {formatRupiah(state.budget.limit)}</span>
                </div>
            </>
        ) : (
            <div className="flex justify-between items-center">
                 <p className="text-xs text-gray-500 dark:text-slate-400">Total Pengeluaran: <span className="font-semibold text-gray-800 dark:text-white">{formatRupiah(monthlyExpenses)}</span></p>
                 <button onClick={() => navigate('/settings')} className="text-xs text-primary font-medium flex items-center gap-1">
                     <Settings size={12} /> Atur Budget
                 </button>
            </div>
        )}
      </div>

      {/* Quick Actions & Goals Preview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm dark:text-white">Pengeluaran</h3>
                <Link to="/reports" className="text-primary"><ArrowRight size={16}/></Link>
             </div>
             <div className="h-24 relative">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={40}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => formatRupiah(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">Belum ada data</div>
                )}
             </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm dark:text-white">Goal Aktif</h3>
                <Link to="/goals" className="text-primary"><Plus size={16}/></Link>
            </div>
            <div className="space-y-3">
                {state.goals.slice(0, 2).map(goal => (
                    <div key={goal.id}>
                        <div className="flex justify-between text-xs mb-1 dark:text-slate-300">
                            <span>{goal.name}</span>
                            <span>{Math.round((goal.savedAmount / goal.targetAmount) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full">
                            <div 
                                className="h-full bg-accent rounded-full" 
                                style={{ width: `${Math.min((goal.savedAmount / goal.targetAmount) * 100, 100)}%`, backgroundColor: goal.color }}
                            ></div>
                        </div>
                    </div>
                ))}
                {state.goals.length === 0 && <p className="text-xs text-gray-400">Belum ada goal.</p>}
            </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg dark:text-white">Transaksi Terakhir</h3>
              <Link to="/transactions" className="text-sm text-primary font-medium">Lihat Semua</Link>
          </div>
          
          <div className="space-y-3">
              {state.transactions.slice(0, 5).map((t, index) => {
                  const cat = state.categories.find(c => c.id === t.categoryId);
                  const Icon = getCategoryIcon(cat?.icon || 'Circle');
                  return (
                      <div 
                        key={t.id} 
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                      >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-white`} style={{ backgroundColor: cat?.color || '#94a3b8' }}>
                              <Icon size={20} />
                          </div>
                          <div className="flex-1">
                              <h4 className="font-semibold text-sm dark:text-white">{t.note || cat?.name || 'Transaksi'}</h4>
                              <p className="text-xs text-gray-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString('id-ID')}</p>
                          </div>
                          <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                          </span>
                      </div>
                  );
              })}
              {state.transactions.length === 0 && (
                  <div className="text-center py-10 text-gray-400">Belum ada transaksi. Yuk mulai catat!</div>
              )}
          </div>
      </div>
    </div>
  );
};

export default Dashboard;