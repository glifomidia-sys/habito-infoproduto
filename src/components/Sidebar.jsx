import { useState } from 'react'
import {
  LayoutDashboard, Sparkles, ListTodo, Timer, BarChart2, Trophy,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Início',        Icon: LayoutDashboard },
  { id: 'habits',    label: 'Hábitos',       Icon: Sparkles },
  { id: 'ddd',       label: 'DDD',           Icon: ListTodo },
  { id: 'pomodoro',  label: 'Pomodoro',      Icon: Timer },
  { id: 'stats',     label: 'Estatísticas',  Icon: BarChart2 },
  { id: 'bau',       label: 'Baú',           Icon: Trophy },
]

export default function Sidebar({ page, setPage }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        relative flex flex-col bg-bg-sidebar
        shadow-[1px_0_0_rgba(255,255,255,0.05)]
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-[52px]' : 'w-[220px]'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }}>
          <Zap size={15} className="text-bg" fill="currentColor" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold tracking-tight leading-tight text-gradient-amber">HabitFlow</p>
            <p className="text-[10px] text-text-muted mt-0.5 tracking-wide">Hábitos &amp; foco</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-1">
        {navItems.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              title={collapsed ? label : undefined}
              className={`
                relative flex items-center gap-3 py-2.5 rounded-xl w-full text-left
                transition-all duration-150 group
                ${collapsed ? 'justify-center px-0' : 'px-3'}
                ${active
                  ? 'bg-accent-light text-text'
                  : 'text-text-muted hover:bg-bg-hover hover:text-text-sub'}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" />
              )}
              <Icon
                size={17}
                className={`shrink-0 transition-colors ${active ? 'text-accent' : 'text-text-muted group-hover:text-text-sub'}`}
              />
              {!collapsed && (
                <span className={`text-sm font-medium truncate ${active ? 'text-text' : ''}`}>
                  {label}
                </span>
              )}
              {collapsed && (
                <span className="
                  absolute left-full ml-3 px-2.5 py-1 bg-bg-alt text-text text-xs font-medium
                  rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none
                  whitespace-nowrap z-50 border border-border shadow-card
                  transition-opacity duration-100
                ">
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span className="text-[10px] text-text-muted tracking-widest uppercase">Dark Amber · v2</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-[22px] w-6 h-6 bg-bg-alt border border-border
          rounded-full flex items-center justify-center text-text-muted
          hover:text-accent hover:border-border-accent transition-all z-10 shadow-sm"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </aside>
  )
}
