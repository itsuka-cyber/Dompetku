import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, PlusCircle, Target, Settings } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/reports', icon: PieChart, label: 'Laporan' },
    { path: '/add', icon: PlusCircle, label: 'Tambah', highlight: true },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Hide nav on onboarding
  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe pt-2 px-4 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link key={item.path} to={item.path} className="-mt-8">
                <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full shadow-lg shadow-indigo-500/30 text-white hover:scale-105 transition-transform">
                  <Icon size={28} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-400 dark:text-slate-500'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
