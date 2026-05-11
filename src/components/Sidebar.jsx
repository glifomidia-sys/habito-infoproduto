import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Início' },
  { id: 'habits',    label: 'Hábitos' },
  { id: 'ddd',       label: 'DDD' },
  { id: 'pomodoro',  label: 'Pomodoro' },
  { id: 'stats',     label: 'Estatísticas' },
  { id: 'bau',       label: 'Baú' },
]

export default function Sidebar({ page, setPage }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        relative flex flex-col bg-bg-sidebar border-r border-border
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-14' : 'w-60'}
      `}
    >
      {/* logo */}
      <div className={`px-5 py-5 border-b border-border ${collapsed ? 'px-3' : ''}`}>
        {!collapsed ? (
          <div>
            <p className="text-sm font-bold text-text tracking-tight leading-tight">HabitFlow</p>
            <p className="text-xs text-text-sub mt-0.5">Hábitos &amp; foco</p>
          </div>
        ) : (
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center mx-auto">
            <span className="text-white text-xs font-bold">H</span>
          </div>
        )}
      </div>

      {/* theme badge */}
      {!collapsed && (
        <div className="px-5 pt-4 pb-1">
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">
            Tema Lumina · v1
          </span>
        </div>
      )}

      {/* nav */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
        {navItems.map(({ id, label }, idx) => {
          const active = page === id
          const num = String(idx + 1).padStart(2, '0')
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left
                transition-all duration-150 group
                ${active
                  ? 'bg-white text-text shadow-sm border border-border'
                  : 'text-text-sub hover:bg-bg-hover hover:text-text'}
                ${collapsed ? 'justify-center px-0' : ''}
              `}
            >
              <span className={`text-xs font-semibold tabular-nums shrink-0 ${active ? 'text-accent' : 'text-text-muted'}`}>
                {num}
              </span>
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}
              {collapsed && (
                <span className="
                  absolute left-full ml-3 px-2 py-1 bg-text text-white text-xs
                  rounded-md opacity-0 group-hover:opacity-100 pointer-events-none
                  whitespace-nowrap z-50
                ">
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* collapse toggle */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-6 w-6 h-6 bg-bg-card border border-border
          rounded-full flex items-center justify-center text-text-sub
          hover:text-text hover:border-border-strong transition-all z-10 shadow-sm"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
