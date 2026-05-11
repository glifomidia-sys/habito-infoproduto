import { useApp } from '../store/AppContext'
import { TrendingUp, Flame, Target, Calendar } from 'lucide-react'

const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function HeatBar({ pct, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex flex-col justify-end" style={{ height: 64, width: '100%' }}>
        {pct > 0 && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-accent font-bold whitespace-nowrap">
            {pct}%
          </span>
        )}
        <div className="w-full rounded-lg overflow-hidden bg-bg-alt" style={{ height: '100%' }}>
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${Math.max(pct, 3)}%`,
              background: pct === 0
                ? 'rgba(255,255,255,0.04)'
                : 'linear-gradient(to top, #d97706, #fbbf24)',
              marginTop: 'auto',
            }}
          />
        </div>
      </div>
      <span className="text-[10px] text-text-muted font-medium">{label}</span>
    </div>
  )
}

export default function Stats() {
  const { habits, completions, getStreak, weeklyAdherence } = useApp()

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().split('T')[0]
    const dow = d.getDay()
    const dayHabits = habits.filter(h => h.days.includes(dow))
    const done = (completions[key] || []).filter(id => dayHabits.some(h => h.id === id))
    const pct = dayHabits.length === 0 ? 0 : Math.round((done.length / dayHabits.length) * 100)
    return { pct, label: DAYS_SHORT[dow] }
  })

  const adherence = weeklyAdherence()
  const bestStreak = habits.length === 0 ? 0 : Math.max(0, ...habits.map(h => getStreak(h.id)))
  const totalDone = Object.values(completions).flat().length

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-text">Estatísticas</h1>
        <p className="text-sm text-text-muted mt-0.5">Seu desempenho ao longo do tempo</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 stagger-children">
        {[
          { label: 'Aderência semanal', value: `${adherence}%`, icon: TrendingUp },
          { label: 'Maior sequência',   value: `${bestStreak}d`, icon: Flame },
          { label: 'Total concluídos',  value: totalDone,         icon: Target },
          { label: 'Hábitos ativos',    value: habits.length,     icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-bg-card border border-border rounded-2xl p-5 flex flex-col gap-2 animate-slide-up shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{label}</span>
              <Icon size={13} className="text-text-muted" />
            </div>
            <p className="text-3xl font-bold font-mono text-gradient-amber leading-none">{value}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-text mb-6">Últimos 7 dias</h2>
        <div className="grid grid-cols-7 gap-2">
          {last7.map((d, i) => <HeatBar key={i} pct={d.pct} label={d.label} />)}
        </div>
      </div>

      {/* Per habit */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-text mb-4">Por hábito</h2>
        {habits.length === 0 && (
          <p className="text-sm text-text-sub text-center py-4">Sem hábitos cadastrados.</p>
        )}
        <div className="flex flex-col gap-4">
          {habits.map(h => {
            const streak = getStreak(h.id)
            const totalH = Object.values(completions).filter(arr => arr.includes(h.id)).length
            return (
              <div key={h.id} className="flex items-center gap-3 group hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${h.color}18`, border: `1px solid ${h.color}28` }}>
                  {h.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text font-semibold truncate">{h.name}</span>
                    <span className="text-xs font-mono text-text-muted ml-2 shrink-0">{totalH}×</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-alt rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, totalH * 5)}%`,
                        background: `linear-gradient(90deg, ${h.color}99, ${h.color})`,
                      }} />
                  </div>
                </div>
                {streak > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold font-mono text-gradient-amber shrink-0">
                    <Flame size={11} className="text-accent" /> {streak}d
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
