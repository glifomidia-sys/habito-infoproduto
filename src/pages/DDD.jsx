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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 animate-fade-in shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Nova tarefa</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-sub font-medium mb-1 block">Descrição</label>
            <textarea
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="O que precisa ser feito?"
              rows={3}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text
                placeholder-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full relative transition-colors ${form.urgent ? 'bg-danger' : 'bg-border-strong'}`}
              onClick={() => setForm(p => ({ ...p, urgent: !p.urgent }))}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.urgent ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-text">Marcar como urgente</span>
          </label>
          <button type="submit"
            className="py-2.5 bg-accent text-white font-semibold text-sm rounded-xl hover:bg-accent-dark transition-colors shadow-sm">
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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">DDD</h1>
          <p className="text-sm text-text-sub mt-0.5">Dirty Dozen — faça o que deve ser feito</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent text-white font-semibold text-sm px-4 py-2.5
            rounded-xl hover:bg-accent-dark transition-colors shadow-sm"
        >
          <Plus size={16} /> Nova
        </button>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-4 flex items-start gap-3 shadow-card">
        <Info size={15} className="text-text-sub mt-0.5 shrink-0" />
        <p className="text-xs text-text-sub leading-relaxed">
          O método DDD foca nas tarefas que <span className="font-medium text-text">realmente importam</span> —
          as que trazem consequências se não forem feitas.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="flex justify-between text-xs text-text-sub mb-2">
          <span>Progresso do dia</span>
          <span className="font-medium text-accent">{done.length}/{tasks.length} concluídas</span>
        </div>
        <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${tasks.length === 0 ? 0 : (done.length / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        {[['pending', `Pendentes (${pending.length})`], ['done', `Concluídas (${done.length})`]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all
              ${tab === val
                ? 'bg-accent-light border-accent text-accent-dark'
                : 'bg-bg-card border-border text-text-sub hover:bg-bg-hover'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {displayed.length === 0 && (
          <div className="py-12 text-center text-text-sub text-sm bg-bg-card border border-border rounded-xl shadow-card">
            {tab === 'pending' ? 'Nenhuma tarefa pendente.' : 'Nenhuma tarefa concluída ainda.'}
          </div>
        )}
        {displayed.map(t => (
          <div key={t.id}
            className={`flex items-center gap-4 p-4 rounded-xl border group shadow-card transition-all bg-bg-card
              ${t.urgent && !t.done ? 'border-l-2 border-l-danger border-border' : 'border-border'}
              ${t.done ? 'opacity-60' : ''}`}>
            <button onClick={() => toggleTask(t.id)}
              className={`shrink-0 transition-colors ${t.done ? 'text-accent' : 'text-text-muted hover:text-text-sub'}`}>
              {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${t.done ? 'line-through text-text-muted' : 'text-text'}`}>{t.title}</p>
              {t.urgent && !t.done && (
                <span className="text-[10px] font-semibold text-danger bg-danger-light px-2 py-0.5 rounded-full mt-1.5 inline-block">
                  URGENTE
                </span>
              )}
            </div>
            <button onClick={() => removeTask(t.id)}
              className="text-text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} />}
    </div>
  )
}
