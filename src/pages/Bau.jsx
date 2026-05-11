import { useApp } from '../store/AppContext'
import { Trophy, Lock, Star } from 'lucide-react'

const ACHIEVEMENTS = [
  {
    id: 'first_habit',
    icon: '🌱',
    title: 'Primeiros passos',
    desc: 'Conclua seu primeiro hábito',
    check: ({ completions }) => Object.values(completions).some(arr => arr.length > 0),
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: 'Em chamas',
    desc: 'Mantenha sequência de 3 dias',
    check: ({ habits, getStreak }) => habits.some(h => getStreak(h.id) >= 3),
  },
  {
    id: 'streak_7',
    icon: '⚡',
    title: 'Semana perfeita',
    desc: 'Sequência de 7 dias consecutivos',
    check: ({ habits, getStreak }) => habits.some(h => getStreak(h.id) >= 7),
  },
  {
    id: 'habits_5',
    icon: '🎯',
    title: 'Multitarefas',
    desc: 'Cadastre 5 hábitos',
    check: ({ habits }) => habits.length >= 5,
  },
  {
    id: 'perfect_day',
    icon: '💎',
    title: 'Dia perfeito',
    desc: 'Conclua todos os hábitos do dia',
    check: ({ completions, habits }) => {
      return Object.entries(completions).some(([key, done]) => {
        const d = new Date(key)
        const dow = d.getDay()
        const dayHabits = habits.filter(h => h.days.includes(dow))
        return dayHabits.length > 0 && dayHabits.every(h => done.includes(h.id))
      })
    },
  },
  {
    id: 'total_10',
    icon: '🏅',
    title: 'Décima vez',
    desc: 'Alcance 10 conclusões totais',
    check: ({ completions }) => Object.values(completions).flat().length >= 10,
  },
  {
    id: 'total_50',
    icon: '👑',
    title: 'Mestre dos hábitos',
    desc: '50 conclusões totais',
    check: ({ completions }) => Object.values(completions).flat().length >= 50,
  },
  {
    id: 'tasks_done',
    icon: '✅',
    title: 'Executor',
    desc: 'Conclua uma tarefa no DDD',
    check: ({ tasks }) => tasks.some(t => t.done),
  },
]

export default function Bau() {
  const ctx = useApp()
  const unlocked = ACHIEVEMENTS.filter(a => a.check(ctx))
  const locked = ACHIEVEMENTS.filter(a => !a.check(ctx))
  const progressPct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-text">Baú de conquistas</h1>
        <p className="text-sm text-text-muted mt-0.5">{unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas</p>
      </div>

      {/* Progress card */}
      <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-light flex items-center justify-center">
              <Trophy size={15} className="text-accent" />
            </div>
            <span className="text-sm font-semibold text-text">Progresso geral</span>
          </div>
          <span className="text-2xl font-bold font-mono text-gradient-amber">{progressPct}%</span>
        </div>
        <div className="w-full h-2 bg-bg-alt rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%`,
              background: 'linear-gradient(90deg, #d97706, #fbbf24)',
            }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">{unlocked.length} de {ACHIEVEMENTS.length} conquistas desbloqueadas</p>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Desbloqueadas</h2>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map(a => (
              <div key={a.id}
                className="relative rounded-2xl p-4 overflow-hidden transition-all hover:scale-[1.01]"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(13,13,20,1) 65%)',
                  border: '1px solid rgba(245,158,11,0.22)',
                  boxShadow: '0 0 24px rgba(245,158,11,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}>
                <div className="text-3xl mb-3 animate-float">{a.icon}</div>
                <p className="text-sm font-bold text-text leading-tight">{a.title}</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{a.desc}</p>
                <div className="absolute top-3 right-3">
                  <Star size={13} className="text-accent" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Bloqueadas</h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map(a => (
              <div key={a.id}
                className="bg-bg-card border border-border rounded-2xl p-4 relative opacity-40 transition-opacity hover:opacity-60">
                <div className="text-3xl mb-3 grayscale">{a.icon}</div>
                <p className="text-sm font-semibold text-text-sub leading-tight">{a.title}</p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">{a.desc}</p>
                <div className="absolute top-3 right-3">
                  <Lock size={12} className="text-text-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
