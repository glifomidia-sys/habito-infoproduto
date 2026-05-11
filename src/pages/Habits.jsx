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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-md p-6 animate-scale-in shadow-card-depth">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text">Novo hábito</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-hover">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Ícone</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(p => ({ ...p, icon: ic }))}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all
                    ${form.icon === ic
                      ? 'border-accent bg-accent-light shadow-glow-sm'
                      : 'border-border bg-bg-alt hover:bg-bg-hover'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Cor</label>
            <div className="flex gap-2.5">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-bg-card scale-110' : 'opacity-70 hover:opacity-100'}`}
                  style={{ background: c, ringColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-1.5 block">Nome</label>
            <input
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Meditar, Ler, Exercitar..."
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text
                placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-sub font-medium mb-1.5 block">Horário</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text
                  focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all" />
            </div>
            <div>
              <label className="text-xs text-text-sub font-medium mb-1.5 block">Local</label>
              <input value={form.place} onChange={e => setForm(p => ({ ...p, place: e.target.value }))}
                placeholder="Ex: Casa, Academia..."
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text
                  placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-sub font-medium mb-2 block">Dias da semana</label>
            <div className="flex gap-1.5">
              {DAYS.map((d, i) => (
                <button key={i} type="button" onClick={() => toggleDay(i)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
                    ${form.days.includes(i)
                      ? 'bg-accent-light border-border-accent text-accent'
                      : 'bg-bg border-border text-text-muted hover:text-text-sub hover:bg-bg-hover'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button type="submit"
            className="mt-1 py-3 font-semibold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#07070a' }}>
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
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Hábitos</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {habits.length} hábito{habits.length !== 1 ? 's' : ''} cadastrado{habits.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-semibold text-sm px-4 py-2.5
            rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#07070a' }}
        >
          <Plus size={15} /> Novo
        </button>
      </div>

      {/* Filter pills */}
      <div className="inline-flex bg-bg-alt rounded-2xl p-1 gap-1 self-start">
        {[['all','Todos'],['today','Hoje']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all
              ${filter === val
                ? 'bg-accent-light text-accent'
                : 'text-text-muted hover:text-text-sub'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 stagger-children">
        {displayed.length === 0 && (
          <div className="py-16 text-center text-text-sub text-sm bg-bg-card border border-border rounded-2xl">
            Nenhum hábito aqui.{' '}
            <button onClick={() => setShowModal(true)} className="text-accent hover:underline">Criar o primeiro</button>
          </div>
        )}
        {displayed.map(h => {
          const isDone = todayCompletions.includes(h.id)
          const streak = getStreak(h.id)
          return (
            <div key={h.id}
              className={`bg-bg-card border rounded-2xl p-4 flex items-center gap-4 group transition-all duration-150 animate-slide-up
                ${isDone ? 'border-border-accent' : 'border-border hover:border-border-strong'}`}>

              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${h.color}18`, border: `1px solid ${h.color}30` }}>
                {h.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
                  {h.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock size={10} /> {h.time}
                  </span>
                  {h.place && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin size={10} /> {h.place}
                    </span>
                  )}
                  {streak > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold font-mono text-gradient-amber">
                      <Flame size={11} className="text-accent" /> {streak}d
                    </span>
                  )}
                </div>
                <div className="flex gap-1 mt-2.5">
                  {DAYS.map((d, i) => (
                    <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide
                      ${h.days.includes(i)
                        ? 'text-accent bg-accent-light'
                        : 'text-text-muted bg-bg-alt'}`}>
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
                  className="text-text-muted hover:text-danger transition-all opacity-0 group-hover:opacity-100">
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
