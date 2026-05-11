import { useApp } from '../store/AppContext'
import { Trophy, Lock, Star, Flame } from 'lucide-react'

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text">Baú de conquistas</h1>
        <p className="text-sm text-text-sub mt-0.5">{unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas</p>
      </div>

      {/* progress */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <span className="text-sm font-semibold text-text">Progresso geral</span>
          </div>
          <span className="text-sm font-bold text-accent">{Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-700"
            style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-text-sub uppercase tracking-wider mb-3">Desbloqueadas</h2>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map(a => (
              <div key={a.id} className="bg-bg-card border border-border rounded-xl p-4 shadow-card relative">
                <div className="text-3xl mb-2">{a.icon}</div>
                <p className="text-sm font-semibold text-text">{a.title}</p>
                <p className="text-xs text-text-sub mt-0.5">{a.desc}</p>
                <div className="absolute top-3 right-3">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Bloqueadas</h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map(a => (
              <div key={a.id} className="bg-bg border border-border rounded-xl p-4 relative opacity-60">
                <div className="text-3xl mb-2 grayscale opacity-40">{a.icon}</div>
                <p className="text-sm font-medium text-text-sub">{a.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{a.desc}</p>
                <div className="absolute top-3 right-3">
                  <Lock size={13} className="text-text-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
