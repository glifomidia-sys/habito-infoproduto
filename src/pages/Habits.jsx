import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { CheckCircle2, Circle, Plus, Trash2, Clock, MapPin, Flame, X } from 'lucide-react'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const ICONS = ['🏋️','🧘','📚','💧','🎯','🍎','🏃','✍️','🎨','🎵','💊','🌿']
const COLORS = ['#10b981','#6366f1','#f59e0b','#ec4899','#3b82f6','#f97316','#84cc16','#a855f7']

function AddHabitModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', time: '07:00', place: '', icon: '🎯', color: '#10b981', days: [1,2,3,4,5]
  })

  const toggleDay = (d) => {
    setForm(p => ({
      ...p,
      days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d]
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 animate-fade-in shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Novo hábito</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all
                    ${form.icon === ic ? 'border-accent bg-accent-light' : 'border-border bg-bg hover:bg-bg-hover'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Cor</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? 'border-text scale-110' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-1 block">Nome</label>
            <input
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Meditar, Ler, Exercitar..."
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text
                placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-sub font-medium mb-1 block">Horário</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text
                  focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
            </div>
            <div>
              <label className="text-xs text-text-sub font-medium mb-1 block">Local</label>
              <input value={form.place} onChange={e => setForm(p => ({ ...p, place: e.target.value }))}
                placeholder="Ex: Casa, Academia..."
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text
                  placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Dias da semana</label>
            <div className="flex gap-1.5">
              {DAYS.map((d, i) => (
                <button key={i} type="button" onClick={() => toggleDay(i)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${form.days.includes(i)
                      ? 'bg-accent-light border-accent text-accent-dark'
                      : 'bg-bg border-border text-text-sub hover:bg-bg-hover'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            className="mt-1 py-2.5 bg-accent text-white font-semibold text-sm rounded-xl
              hover:bg-accent-dark transition-colors shadow-sm">
            Adicionar hábito
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Habits() {
  const { habits, addHabit, removeHabit, todayCompletions, toggleHabit, getStreak } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const dow = new Date().getDay()
  const displayed = filter === 'today' ? habits.filter(h => h.days.includes(dow)) : habits

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Hábitos</h1>
          <p className="text-sm text-text-sub mt-0.5">{habits.length} hábito{habits.length !== 1 ? 's' : ''} cadastrado{habits.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent text-white font-semibold text-sm px-4 py-2.5
            rounded-xl hover:bg-accent-dark transition-colors shadow-sm"
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      <div className="flex gap-2">
        {[['all','Todos'],['today','Hoje']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all
              ${filter === val
                ? 'bg-accent-light border-accent text-accent-dark'
                : 'bg-bg-card border-border text-text-sub hover:bg-bg-hover'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {displayed.length === 0 && (
          <div className="py-16 text-center text-text-sub text-sm bg-bg-card border border-border rounded-xl shadow-card">
            Nenhum hábito aqui.{' '}
            <button onClick={() => setShowModal(true)} className="text-accent hover:underline">Criar o primeiro</button>
          </div>
        )}
        {displayed.map(h => {
          const isDone = todayCompletions.includes(h.id)
          const streak = getStreak(h.id)
          return (
            <div key={h.id}
              className="bg-bg-card border border-border rounded-xl p-4 flex items-center gap-4 group shadow-card">
              <button onClick={() => toggleHabit(h.id)} className="shrink-0">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-border"
                  style={{ background: `${h.color}15` }}>
                  {h.icon}
                </div>
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
                  {h.name}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-text-sub">
                    <Clock size={11} /> {h.time}
                  </span>
                  {h.place && (
                    <span className="flex items-center gap-1 text-xs text-text-sub">
                      <MapPin size={11} /> {h.place}
                    </span>
                  )}
                  {streak > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <Flame size={11} /> {streak}d
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-2">
                  {DAYS.map((d, i) => (
                    <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                      ${h.days.includes(i) ? 'text-accent-dark bg-accent-light' : 'text-text-muted bg-bg'}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleHabit(h.id)}
                  className={`transition-colors ${isDone ? 'text-accent' : 'text-text-muted hover:text-text-sub'}`}>
                  {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <button onClick={() => removeHabit(h.id)}
                  className="text-text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && <AddHabitModal onClose={() => setShowModal(false)} onAdd={addHabit} />}
    </div>
  )
}
