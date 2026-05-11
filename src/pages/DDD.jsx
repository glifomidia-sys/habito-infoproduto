import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { Plus, Trash2, CheckCircle2, Circle, Info, X } from 'lucide-react'

function AddTaskModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', urgent: false })
  const submit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onAdd(form)
    onClose()
  }
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-strong rounded-2xl w-full max-w-sm p-6 animate-scale-in shadow-card-depth">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text">Nova tarefa</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-hover">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-sub font-medium mb-1.5 block">Descrição</label>
            <textarea
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="O que precisa ser feito?"
              rows={3}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text
                placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none transition-all"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${form.urgent ? 'bg-danger' : 'bg-bg-alt border border-border'}`}
              onClick={() => setForm(p => ({ ...p, urgent: !p.urgent }))}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.urgent ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-text-sub">Marcar como urgente</span>
          </label>
          <button type="submit"
            className="py-3 font-semibold text-sm rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#07070a' }}>
            Adicionar tarefa
          </button>
        </form>
      </div>
    </div>
  )
}

export default function DDD() {
  const { tasks, addTask, toggleTask, removeTask } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState('pending')

  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const displayed = tab === 'pending' ? pending : done
  const progressPct = tasks.length === 0 ? 0 : (done.length / tasks.length) * 100

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">DDD</h1>
          <p className="text-sm text-text-muted mt-0.5">Dirty Dozen — faça o que deve ser feito</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 font-semibold text-sm px-4 py-2.5
            rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#07070a' }}
        >
          <Plus size={15} /> Nova
        </button>
      </div>

      {/* Info box */}
      <div className="bg-accent-glow border border-border-accent rounded-xl p-4 flex items-start gap-3">
        <Info size={14} className="text-accent mt-0.5 shrink-0" />
        <p className="text-xs text-text-sub leading-relaxed">
          O método DDD foca nas tarefas que <span className="font-semibold text-text">realmente importam</span> —
          as que trazem consequências se não forem feitas.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-bg-card border border-border rounded-2xl p-4">
        <div className="flex justify-between items-center text-xs mb-3">
          <span className="text-text-muted font-medium uppercase tracking-wider">Progresso do dia</span>
          <span className="font-bold font-mono text-gradient-amber">{done.length}/{tasks.length}</span>
        </div>
        <div className="w-full h-2 bg-bg-alt rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #d97706, #fbbf24)',
            }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="inline-flex bg-bg-alt rounded-2xl p-1 gap-1 self-start">
        {[['pending', `Pendentes (${pending.length})`], ['done', `Concluídas (${done.length})`]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all
              ${tab === val
                ? 'bg-accent-light text-accent'
                : 'text-text-muted hover:text-text-sub'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 stagger-children">
        {displayed.length === 0 && (
          <div className="py-12 text-center text-text-sub text-sm bg-bg-card border border-border rounded-2xl">
            {tab === 'pending' ? 'Nenhuma tarefa pendente.' : 'Nenhuma tarefa concluída ainda.'}
          </div>
        )}
        {displayed.map(t => (
          <div key={t.id}
            className={`
              flex items-center gap-4 p-4 rounded-xl border group transition-all duration-150 bg-bg-card animate-slide-up
              ${t.urgent && !t.done
                ? 'border-border border-l-2 border-l-danger'
                : 'border-border hover:border-border-strong'}
              ${t.done ? 'opacity-60' : ''}
            `}>
            <button onClick={() => toggleTask(t.id)}
              className={`shrink-0 transition-colors ${t.done ? 'text-accent' : 'text-text-muted hover:text-text-sub'}`}>
              {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${t.done ? 'line-through text-text-muted' : 'text-text font-medium'}`}>
                {t.title}
              </p>
              {t.urgent && !t.done && (
                <span className="text-[10px] font-bold text-danger bg-danger-light px-2 py-0.5 rounded-full mt-1.5 inline-block tracking-wide">
                  URGENTE
                </span>
              )}
            </div>
            <button onClick={() => removeTask(t.id)}
              className="text-text-muted hover:text-danger transition-all opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
    </div>
  )
}
