import { useApp } from '../store/AppContext'
import { TrendingUp, Flame, Target, Calendar } from 'lucide-react'

const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function HeatBar({ pct, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-full h-16 rounded-lg relative overflow-hidden bg-bg">
        <div
          className="absolute bottom-0 w-full rounded-lg transition-all duration-700"
          style={{ height: `${Math.max(pct, 4)}%`, background: '#10b981', opacity: pct === 0 ? 0.2 : 0.7 + pct * 0.003 }}
        />
      </div>
      <span className="text-[10px] text-text-muted">{label}</span>
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
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text">Estatísticas</h1>
        <p className="text-sm text-text-sub mt-0.5">Seu desempenho ao longo do tempo</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Aderência semanal', value: `${adherence}%`, icon: TrendingUp },
          { label: 'Maior sequência',   value: `${bestStreak}d`, icon: Flame },
          { label: 'Total concluídos',  value: totalDone,         icon: Target },
          { label: 'Hábitos ativos',    value: habits.length,     icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-sub font-medium">{label}</span>
              <Icon size={14} className="text-text-muted" />
            </div>
            <p className="text-2xl font-bold text-text">{value}</p>
          </div>
        ))}
      </div>

      {/* weekly chart */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-text mb-4">Últimos 7 dias</h2>
        <div className="grid grid-cols-7 gap-2">
          {last7.map((d, i) => <HeatBar key={i} pct={d.pct} label={d.label} />)}
        </div>
      </div>

      {/* per habit */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-semibold text-text mb-4">Por hábito</h2>
        {habits.length === 0 && (
          <p className="text-sm text-text-sub text-center py-4">Sem hábitos cadastrados.</p>
        )}
        <div className="flex flex-col gap-4">
          {habits.map(h => {
            const streak = getStreak(h.id)
            const totalH = Object.values(completions).filter(arr => arr.includes(h.id)).length
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border border-border"
                  style={{ background: `${h.color}15` }}>
                  {h.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text font-medium truncate">{h.name}</span>
                    <span className="text-xs text-text-sub ml-2 shrink-0">{totalH}x</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, totalH * 5)}%`, background: h.color }} />
                  </div>
                </div>
                {streak > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium shrink-0">
                    <Flame size={11} /> {streak}d
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
