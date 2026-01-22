
import React from 'react';
import { EmployeeProfile } from '../types';
import { User, LogOut, Home, ClipboardList } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  profile: EmployeeProfile | null;
  onLogout: () => void;
  onGoHome: () => void;
  onGoHistory: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, profile, onLogout, onGoHome, onGoHistory }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Sidebar - Mobile top nav, Desktop sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-tertiary flex flex-col sticky top-0 md:h-screen z-10">
        <div className="p-6 border-b border-tertiary flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            EC
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">EmployeeCare</h1>
            <p className="text-xs text-slate-500">Management Suite</p>
          </div>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-tertiary hover:text-primary-700 rounded-lg transition-colors whitespace-nowrap w-full text-left"
          >
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <button 
            onClick={onGoHistory}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-tertiary hover:text-primary-700 rounded-lg transition-colors whitespace-nowrap w-full text-left"
          >
            <ClipboardList size={20} />
            <span className="font-medium">My Requests</span>
          </button>
        </nav>

        <div className="p-4 border-t border-tertiary hidden md:block">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-slate-600">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{profile?.name}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.position}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-tertiary px-6 flex items-center justify-between md:hidden">
            <span className="font-bold text-primary-500">EC Portal</span>
            <button onClick={onLogout} className="text-red-500 p-2"><LogOut size={20}/></button>
        </header>
        {children}
      </main>
    </div>
  );
};
