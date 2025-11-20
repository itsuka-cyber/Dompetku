import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ToastProvider } from './context/ToastContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Transactions from './pages/Transactions';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { state } = useFinance();
  if (!state.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const { state } = useFinance();
  const location = useLocation();
  const hideNav = location.pathname === '/add' || location.pathname === '/onboarding';

  return (
    <div className={state.darkMode ? 'dark' : ''}>
       <div className="bg-gray-50 dark:bg-slate-950 min-h-screen max-w-md mx-auto relative shadow-2xl shadow-black overflow-hidden">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        </Routes>
        {!hideNav && state.isOnboarded && <BottomNav />}
        <PWAInstallPrompt />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <FinanceProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </FinanceProvider>
  );
};

export default App;