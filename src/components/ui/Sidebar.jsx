import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, History,
  FileText, ChevronLeft, ChevronRight, Zap, GitBranch,
} from 'lucide-react';
import useStore from '../../store/useStore';

const NAV = [
  { to: '/',       icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/audit',  icon: ShieldCheck,     label: 'New Audit'     },
  { to: '/history',icon: History,         label: 'History'       },
  { to: '/graph',  icon: GitBranch,       label: 'Graph Monitor' },
  { to: '/docs',   icon: FileText,        label: 'Documents'     },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <aside
      className={`flex flex-col h-screen bg-[var(--bg-surface)] border-r border-[var(--border)]
                  transition-all duration-300 ${sidebarOpen ? 'w-56' : 'w-16'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {sidebarOpen && (
          <span className="font-display font-700 text-sm text-[var(--text-primary)] truncate">
            ComplianceQA
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150
               ${isActive
                 ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                 : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5'}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="m-3 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]
                   hover:bg-white/5 transition-all border border-[var(--border)]
                   flex items-center justify-center"
      >
        {sidebarOpen
          ? <ChevronLeft  className="w-4 h-4" />
          : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
