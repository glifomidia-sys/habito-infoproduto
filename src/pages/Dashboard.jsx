import { useApp } from '../store/AppContext'
import { CheckCircle2, Circle, ArrowRight, Clock, MapPin, TrendingUp, Target, Flame } from 'lucide-react'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card animate-fade-in">
      <p className="text-xs text-text-sub font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-text">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function ProgressRing({ pct, size = 64 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} strokeWidth="4" stroke="#e5e7eb" fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r} strokeWidth="4"
        stroke="#10b981" fill="none" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        className="ring-progress transition-all duration-700"
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="13" fill="#10b981" fontWeight="600">
        {pct}%
      </text>
    </svg>
  )
}

export default function Dashboard({ setPage }) {
  const { todayHabits, todayCompletions, toggleHabit, tasks, weeklyAdherence, bestStreak } = useApp()

  const habits = todayHabits()
  const done = todayCompletions.length
  const total = habits.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  const urgentTasks = tasks.filter(t => t.urgent && !t.done)

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-text-sub mb-1">{greeting} · Foque no agora</p>
          <h1 className="text-2xl font-bold text-text leading-tight">Construa hábitos que duram</h1>
        </div>
        <ProgressRing pct={pct} size={72} />
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Progresso diário" value={`${pct}%`} />
        <StatCard label="Conclusões do dia" value={`${done}/${total}`} sub="hábitos" />
        <StatCard label="Maior sequência" value={`${bestStreak()}d`} />
      </div>

      {/* habits today */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Hábitos para Concluir</h2>
          <button onClick={() => setPage('habits')}
            className="text-xs text-accent font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            Ver semana <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {habits.length === 0 && (
            <div className="bg-bg-card border border-border rounded-xl p-6 text-center text-text-sub text-sm shadow-card">
              Nenhum hábito para hoje.{' '}
              <button onClick={() => setPage('habits')} className="text-accent hover:underline">Adicionar</button>
            </div>
          )}
          {habits.map(h => {
            const isDone = todayCompletions.includes(h.id)
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border text-left
                  transition-all bg-bg-card shadow-card group
                  ${isDone ? 'border-accent/30 bg-accent-light/30' : 'border-border hover:border-border-strong'}
                `}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 bg-bg"
                  style={{ background: `${h.color}18` }}>
                  {h.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
                    {h.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-text-sub">
                      <Clock size={11} /> {h.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-sub">
                      <MapPin size={11} /> {h.place}
                    </span>
                  </div>
                </div>
                <div className={`shrink-0 transition-colors ${isDone ? 'text-accent' : 'text-text-muted group-hover:text-text-sub'}`}>
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* urgent tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Tem que Fazer</h2>
          <button onClick={() => setPage('ddd')}
            className="text-xs text-accent font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            Abrir DDD <ArrowRight size={12} />
          </button>
        </div>
        {urgentTasks.length === 0 ? (
          <div className="bg-bg-card border border-border rounded-xl p-4 text-sm text-text-sub shadow-card">
            Nenhuma tarefa urgente.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {urgentTasks.map(t => (
              <div key={t.id}
                className="flex items-center gap-3 p-4 bg-bg-card border border-border rounded-xl shadow-card">
                <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                <p className="text-sm text-text flex-1">{t.title}</p>
                <span className="text-[10px] font-semibold text-danger bg-danger-light px-2 py-0.5 rounded-full">
                  urgente
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setPage('habits')}
          className="p-4 bg-accent text-white rounded-xl text-sm font-semibold
            hover:bg-accent-dark transition-colors text-left shadow-sm"
        >
          Abrir hábitos →
        </button>
        <button
          onClick={() => setPage('pomodoro')}
          className="p-4 bg-bg-card border border-border rounded-xl text-sm font-semibold text-text
            hover:bg-bg-hover transition-colors text-left shadow-card"
        >
          Iniciar foco →
        </button>
      </div>
    </div>
  )
}
