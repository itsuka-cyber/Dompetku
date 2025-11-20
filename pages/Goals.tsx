import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Goals = () => {
  const { state, dispatch, formatRupiah } = useFinance();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch({
          type: 'ADD_GOAL',
          payload: {
              id: crypto.randomUUID(),
              name,
              targetAmount: parseInt(target),
              savedAmount: 0,
              deadline,
              color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random hex
          }
      });
      showToast('Target keuangan berhasil dibuat!', 'success');
      setIsAdding(false);
      setName('');
      setTarget('');
      setDeadline('');
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Hapus goal ini?")) {
          dispatch({ type: 'DELETE_GOAL', payload: id });
          showToast('Target dihapus.', 'info');
      }
  }

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Target Keuangan</h1>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-primary text-white p-2 rounded-full shadow-lg shadow-indigo-500/30"
          >
              <Plus />
          </button>
      </div>

      {isAdding && (
          <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 p-4 rounded-xl mb-6 animate-in fade-in slide-in-from-top-4 shadow-sm">
              <h3 className="font-semibold mb-4 dark:text-white">Buat Goal Baru</h3>
              <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Nama Goal (mis: Beli HP)" 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    value={name} 
                    onChange={e=>setName(e.target.value)} 
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Target (Rp)" 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    value={target} 
                    onChange={e=>setTarget(e.target.value)} 
                    required
                  />
                  <input 
                    type="date" 
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    value={deadline} 
                    onChange={e=>setDeadline(e.target.value)} 
                    required
                  />
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/30">Simpan Goal</button>
              </div>
          </form>
      )}

      <div className="grid gap-4">
          {state.goals.map(goal => {
              const percent = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
              const chartData = [
                  { name: 'Saved', value: goal.savedAmount, color: goal.color },
                  { name: 'Remaining', value: Math.max(0, goal.targetAmount - goal.savedAmount), color: '#e2e8f0' }
              ];

              return (
                <div key={goal.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex gap-4 items-center">
                    <div className="w-20 h-20 relative shrink-0">
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" innerRadius={25} outerRadius={35} startAngle={90} endAngle={-270}>
                                    {chartData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                                </Pie>
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-white">
                             {percent}%
                         </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-800 dark:text-white">{goal.name}</h3>
                            <button onClick={() => handleDelete(goal.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Target: {formatRupiah(goal.targetAmount)}</p>
                        <div className="flex justify-between text-[10px] text-gray-400">
                            <span>Terkumpul: {formatRupiah(goal.savedAmount)}</span>
                            <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                        {/* Simulation of Adding money to goal */}
                        <div className="mt-3 flex gap-2">
                             <button 
                                onClick={() => {
                                    const updated = {...goal, savedAmount: goal.savedAmount + 50000};
                                    dispatch({type: 'UPDATE_GOAL', payload: updated});
                                    showToast('Ditambahkan Rp 50.000', 'success');
                                }}
                                className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-primary font-medium"
                            >
                                + Rp 50rb
                             </button>
                             <button 
                                onClick={() => {
                                    const updated = {...goal, savedAmount: goal.savedAmount + 100000};
                                    dispatch({type: 'UPDATE_GOAL', payload: updated});
                                    showToast('Ditambahkan Rp 100.000', 'success');
                                }}
                                className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-primary font-medium"
                            >
                                + Rp 100rb
                             </button>
                        </div>
                    </div>
                </div>
              );
          })}
      </div>
    </div>
  );
};

export default Goals;