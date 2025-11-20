import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Reports = () => {
  const { state, formatRupiah } = useFinance();
  const [activeTab, setActiveTab] = useState<'month' | 'trend'>('month');
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate Monthly Data
  const monthlyTransactions = state.transactions.filter(
    t => new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear
  );

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savingRate = income > 0 ? ((income - expense) / income) * 100 : 0;

  // Pie Chart Data
  const expenseCategories = state.categories.filter(c => c.type === 'expense');
  const pieData = expenseCategories.map(cat => ({
    name: cat.name,
    value: monthlyTransactions
        .filter(t => t.categoryId === cat.id)
        .reduce((acc, curr) => acc + curr.amount, 0),
    color: cat.color
  })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // Bar Chart Data (Last 6 months)
  const barData = [];
  for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const monthTrans = state.transactions.filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === m && td.getFullYear() === y;
      });
      
      barData.push({
          name: d.toLocaleString('id-ID', { month: 'short' }),
          masuk: monthTrans.filter(t => t.type === 'income').reduce((a,b) => a + b.amount, 0),
          keluar: monthTrans.filter(t => t.type === 'expense').reduce((a,b) => a + b.amount, 0),
      });
  }

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Laporan Keuangan</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border-b-4 border-emerald-500">
              <p className="text-[10px] text-gray-500 uppercase">Pemasukan</p>
              <p className="font-bold text-emerald-600 text-sm truncate">{formatRupiah(income)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border-b-4 border-red-500">
              <p className="text-[10px] text-gray-500 uppercase">Pengeluaran</p>
              <p className="font-bold text-red-600 text-sm truncate">{formatRupiah(expense)}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border-b-4 border-blue-500">
              <p className="text-[10px] text-gray-500 uppercase">Saving Rate</p>
              <p className="font-bold text-blue-600 text-sm">{savingRate.toFixed(1)}%</p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setActiveTab('month')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'month' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500'}`}
          >
            Bulan Ini
          </button>
          <button 
            onClick={() => setActiveTab('trend')}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'trend' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-gray-500'}`}
          >
            Tren 6 Bulan
          </button>
      </div>

      {/* Chart Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm mb-6 min-h-[300px] flex flex-col">
        {activeTab === 'month' ? (
            <>
                <h3 className="font-semibold mb-4 dark:text-white">Pengeluaran per Kategori</h3>
                {pieData.length > 0 ? (
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatRupiah(value)} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-12 text-center pointer-events-none">
                            <p className="text-[10px] text-gray-400">Total</p>
                            <p className="font-bold text-sm dark:text-white">{formatRupiah(expense)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">Belum ada data pengeluaran</div>
                )}
            </>
        ) : (
            <>
                <h3 className="font-semibold mb-4 dark:text-white">Arus Kas 6 Bulan</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value: number) => formatRupiah(value)}
                        />
                        <Legend iconType="circle" fontSize={10} wrapperStyle={{ paddingTop: '10px' }}/>
                        <Bar dataKey="masuk" name="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                        <Bar dataKey="keluar" name="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </>
        )}
      </div>

      {/* Breakdown List */}
      {activeTab === 'month' && pieData.length > 0 && (
          <div className="space-y-3">
              <h3 className="font-semibold dark:text-white">Rincian Detail</h3>
              {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium dark:text-slate-300">{item.name}</span>
                      </div>
                      <div className="text-right">
                          <p className="text-sm font-bold dark:text-white">{formatRupiah(item.value)}</p>
                          <p className="text-[10px] text-gray-400">{((item.value / expense) * 100).toFixed(1)}%</p>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default Reports;
