import { useApp } from '../store/AppContext'
import { CheckCircle2, Circle, ArrowRight, Clock, MapPin, Flame, ListTodo, Target } from 'lucide-react'

function BigProgressRing({ pct }) {
  const size = 156
  const r = (size - 18) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-35 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 65%)' }}
      />
      <svg width={size} height={size} className="relative z-10 animate-pulse-glow" style={{ borderRadius: '50%' }}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth="10"
          stroke="rgba(245,158,11,0.08)" fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r} strokeWidth="10"
          stroke="url(#dash-gradient)" fill="none" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-progress transition-all duration-1000"
          style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }}
        />
        <defs>
          <linearGradient id="dash-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <text x="50%" y="43%" textAnchor="middle" dy=".35em"
          fontSize="28" fill="#f0f0f5" fontWeight="700" fontFamily="'Space Mono', monospace">
          {pct}%
        </text>
        <text x="50%" y="62%" textAnchor="middle"
          fontSize="9" fill="#4a4a60" fontFamily="'Outfit', sans-serif" fontWeight="500" letterSpacing="2">
          HOJE
        </text>
      </svg>
    </div>
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
  const activeTasks = tasks.filter(t => !t.done)
  const adherence = weeklyAdherence ? weeklyAdherence() : 0

  return (
    <div className="flex flex-col gap-6 animate-slide-up">

      {/* hero — greeting + progress ring */}
      <div className="rounded-2xl border border-border overflow-hidden relative shadow-card"
        style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #131319 100%)' }}>
        <div className="absolute top-0 left-1/3 w-80 h-20 blur-3xl opacity-[0.07] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, transparent 70%)' }} />
        <div className="flex items-center justify-between p-6 gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-accent uppercase tracking-[0.2em] mb-2">
              {greeting} · Foque no agora
            </p>
            <h1 className="text-2xl font-bold text-text leading-snug mb-3">
              Construa <span className="text-gradient-amber">hábitos</span><br />que duram.
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              {done}/{total} concluídos · {adherence}% aderência semanal
            </p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setPage('habits')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-bg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }}>
                Hábitos <ArrowRight size={12} />
              </button>
              <button onClick={() => setPage('pomodoro')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-text-sub
                  border border-border hover:border-border-strong hover:text-text transition-all">
                Foco
              </button>
            </div>
          </div>
          <BigProgressRing pct={pct} />
        </div>
      </div>

      {/* stat grid */}
      <div className="grid grid-cols-3 gap-3 stagger-children">
        {[
          { label: 'Hoje', icon: <Target size={14} />, value: `${done}/${total}`, sub: 'hábitos' },
          { label: 'Streak', icon: <Flame size={14} className="text-accent" />, value: `${bestStreak()}`, sub: 'dias seguidos' },
          {
            label: 'Tarefas', icon: <ListTodo size={14} />,
            value: activeTasks.length,
            sub: urgentTasks.length > 0 ? `${urgentTasks.length} urgentes` : 'sem urgências',
            subDanger: urgentTasks.length > 0,
          },
        ].map(({ label, icon, value, sub, subDanger }) => (
          <div key={label} className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col gap-2 shadow-card animate-slide-up">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">{label}</p>
              <span className="text-text-muted">{icon}</span>
            </div>
            <p className="text-2xl font-bold font-mono text-gradient-amber tabular-nums leading-none">{value}</p>
            <p className={`text-xs ${subDanger ? 'text-danger' : 'text-text-muted'}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* habits today */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">Hoje</p>
            <h2 className="text-base font-bold text-text">Hábitos para concluir</h2>
          </div>
          <button onClick={() => setPage('habits')}
            className="text-xs text-text-muted font-medium flex items-center gap-1 hover:text-accent transition-colors">
            Ver todos <ArrowRight size={11} />
          </button>
        </div>
        <div className="flex flex-col gap-2 stagger-children">
          {habits.length === 0 && (
            <div className="bg-bg-card border border-border rounded-xl p-8 text-center text-text-sub text-sm">
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
                  transition-all duration-150 group animate-slide-up
                  ${isDone
                    ? 'border-border-accent bg-accent-glow'
                    : 'bg-bg-card border-border hover:border-border-strong hover:bg-bg-hover'}
                `}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${h.color}20`, border: `1px solid ${h.color}30` }}>
                  {h.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
                    {h.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock size={10} /> {h.time}
                    </span>
                    {h.place && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <MapPin size={10} /> {h.place}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`shrink-0 transition-colors ${isDone ? 'text-accent' : 'text-text-muted group-hover:text-text-sub'}`}>
                  {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* urgent tasks */}
      {urgentTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text">Tem que Fazer</h2>
            <button onClick={() => setPage('ddd')}
              className="text-xs text-text-muted font-medium flex items-center gap-1 hover:text-accent transition-colors">
              Abrir DDD <ArrowRight size={11} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {urgentTasks.map(t => (
              <div key={t.id}
                className="flex items-center gap-3 p-4 bg-bg-card border-l-2 border-l-danger border border-border rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                <p className="text-sm text-text flex-1 leading-snug">{t.title}</p>
                <span className="text-[10px] font-semibold text-danger bg-danger-light px-2 py-0.5 rounded-full shrink-0">
                  urgente
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
