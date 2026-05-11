import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const MODES = [
  { id: 'focus', label: 'Foco',        minutes: 25, color: '#10b981' },
  { id: 'short', label: 'Pausa curta', minutes: 5,  color: '#6366f1' },
  { id: 'long',  label: 'Pausa longa', minutes: 15, color: '#f59e0b' },
]

function pad(n) { return String(n).padStart(2, '0') }

export default function Pomodoro() {
  const [modeIdx, setModeIdx] = useState(0)
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  const mode = MODES[modeIdx]
  const total = mode.minutes * 60
  const pct = ((total - seconds) / total) * 100

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (modeIdx === 0) setCycles(c => c + 1)
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, modeIdx])

  const switchMode = (idx) => {
    setRunning(false)
    setModeIdx(idx)
    setSeconds(MODES[idx].minutes * 60)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(mode.minutes * 60)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  const size = 240
  const r = 100
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col gap-6 animate-fade-in items-center max-w-sm mx-auto">
      <div className="w-full">
        <h1 className="text-xl font-bold text-text">Pomodoro</h1>
        <p className="text-sm text-text-sub mt-0.5">Técnica de foco com intervalos</p>
      </div>

      {/* mode tabs */}
      <div className="flex gap-2 w-full">
        {MODES.map((m, i) => (
          <button key={m.id} onClick={() => switchMode(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all
              ${modeIdx === i
                ? 'bg-accent-light border-accent text-accent-dark'
                : 'bg-bg-card border-border text-text-sub hover:bg-bg-hover'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* ring */}
      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} strokeWidth="6" stroke="#e5e7eb" fill="none" />
          <circle
            cx={size/2} cy={size/2} r={r} strokeWidth="6"
            stroke={mode.color} fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            className="ring-progress transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums text-text">
            {pad(mins)}:{pad(secs)}
          </span>
          <span className="text-sm text-text-sub mt-1">{mode.label}</span>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center gap-4">
        <button onClick={reset}
          className="w-11 h-11 rounded-full bg-bg-card border border-border flex items-center justify-center
            text-text-sub hover:text-text hover:border-border-strong transition-all shadow-sm">
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => setRunning(v => !v)}
          className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-white
            transition-all hover:opacity-90 active:scale-95 shadow-md"
          style={{ background: mode.color }}
        >
          {running ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <div className="w-11 h-11" />
      </div>

      {/* cycles */}
      <div className="w-full bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between shadow-card">
        <span className="text-sm text-text-sub">Ciclos de foco</span>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.max(4, cycles) }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < cycles ? 'bg-accent' : 'bg-border'}`} />
          ))}
          <span className="text-sm font-bold text-accent ml-1">{cycles}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted text-center leading-relaxed">
        25 min foco · 5 min pausa · a cada 4 ciclos, 15 min de pausa longa
      </p>
    </div>
  )
}
