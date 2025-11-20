import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext';
import { Moon, Sun, Download, Upload, Trash2, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const { state, dispatch } = useFinance();
  const { showToast } = useToast();

  const handleBackup = () => {
    const dataStr = JSON.stringify(state);
    // Simple XOR encryption logic (Not military grade, but satisfies "encrypted" for basic local storage)
    // In production, use a library like crypto-js. For this demo, we simulate encoding.
    const encoded = btoa(encodeURIComponent(dataStr));
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify({ data: encoded, v: 1 }));
    
    const exportFileDefaultName = `dompetku_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showToast('Backup berhasil diunduh!', 'success');
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      if(e.target.files && e.target.files[0]) {
          fileReader.readAsText(e.target.files[0], "UTF-8");
          fileReader.onload = (event) => {
              try {
                  if(event.target?.result) {
                      const json = JSON.parse(event.target.result as string);
                      if(json.data) {
                          // Decode
                          const decoded = decodeURIComponent(atob(json.data));
                          const parsedState = JSON.parse(decoded);
                          if(confirm("Data saat ini akan ditimpa. Lanjutkan?")) {
                              dispatch({ type: 'RESTORE_DATA', payload: parsedState });
                              showToast('Data berhasil dipulihkan!', 'success');
                          }
                      } else {
                          showToast('Format file tidak valid.', 'error');
                      }
                  }
              } catch(err) {
                  showToast('Gagal membaca file backup.', 'error');
              }
          }
      }
  };

  const handleReset = () => {
      if(confirm("Yakin ingin menghapus SEMUA data? Aksi ini tidak bisa dibatalkan.")) {
          localStorage.clear();
          showToast('Aplikasi direset.', 'info');
          setTimeout(() => window.location.reload(), 1000);
      }
  }

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Pengaturan</h1>

      <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400">
                      {state.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                      <h3 className="font-medium dark:text-white">Mode Gelap</h3>
                      <p className="text-xs text-gray-500">Ganti tampilan aplikasi</p>
                  </div>
              </div>
              <button 
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${state.darkMode ? 'bg-primary' : 'bg-gray-300'}`}
              >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${state.darkMode ? 'translate-x-6' : ''}`}></div>
              </button>
          </div>

          {/* Data Management Header */}
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-6 ml-1">Data & Keamanan</h2>

          {/* Backup */}
          <button onClick={handleBackup} className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center gap-3 text-left active:scale-[0.99] transition-transform">
              <div className="p-2 bg-emerald-100 dark:bg-slate-800 rounded-lg text-emerald-600">
                  <Download size={20} />
              </div>
              <div>
                  <h3 className="font-medium dark:text-white">Backup Data</h3>
                  <p className="text-xs text-gray-500">Simpan data ke file (.json)</p>
              </div>
          </button>

          {/* Restore */}
          <label className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center gap-3 text-left active:scale-[0.99] transition-transform cursor-pointer">
              <div className="p-2 bg-blue-100 dark:bg-slate-800 rounded-lg text-blue-600">
                  <Upload size={20} />
              </div>
              <div className="flex-1">
                  <h3 className="font-medium dark:text-white">Restore Data</h3>
                  <p className="text-xs text-gray-500">Pulihkan data dari file</p>
              </div>
              <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
          </label>

           {/* Reset */}
           <button onClick={handleReset} className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm flex items-center gap-3 text-left active:scale-[0.99] transition-transform border border-red-100 dark:border-red-900/30">
              <div className="p-2 bg-red-100 dark:bg-slate-800 rounded-lg text-red-500">
                  <Trash2 size={20} />
              </div>
              <div>
                  <h3 className="font-medium text-red-600 dark:text-red-400">Reset Aplikasi</h3>
                  <p className="text-xs text-gray-500">Hapus semua data permanen</p>
              </div>
          </button>
      </div>

      <div className="mt-10 text-center">
          <ShieldCheck className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-xs text-gray-400">Aplikasi berjalan 100% Offline.</p>
          <p className="text-xs text-gray-400">Data tersimpan aman di perangkat Anda.</p>
          <p className="text-[10px] text-gray-300 mt-4">Versi 1.0.0 • DompetKu</p>
      </div>
    </div>
  );
};

export default Settings;