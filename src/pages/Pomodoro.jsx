import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const MODES = [
  { id: 'focus', label: 'Foco',        minutes: 25, color: '#f59e0b', track: 'rgba(245,158,11,0.10)' },
  { id: 'short', label: 'Pausa curta', minutes: 5,  color: '#818cf8', track: 'rgba(129,140,248,0.10)' },
  { id: 'long',  label: 'Pausa longa', minutes: 15, color: '#34d399', track: 'rgba(52,211,153,0.10)' },
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

  const size = 248
  const r = 104
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="flex flex-col gap-6 animate-slide-up items-center max-w-sm mx-auto">
      <div className="w-full">
        <h1 className="text-xl font-bold text-text">Pomodoro</h1>
        <p className="text-sm text-text-muted mt-0.5">Técnica de foco com intervalos</p>
      </div>

      {/* Mode pills */}
      <div className="flex bg-bg-alt rounded-2xl p-1 gap-1 w-full">
        {MODES.map((m, i) => (
          <button key={m.id} onClick={() => switchMode(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
              ${modeIdx === i
                ? 'text-bg font-bold'
                : 'text-text-muted hover:text-text-sub'}`}
            style={modeIdx === i ? { background: m.color } : {}}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div className="relative flex items-center justify-center my-2">
        <div className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            inset: '-20px',
            background: `radial-gradient(circle, ${mode.color} 0%, transparent 70%)`
          }} />
        <svg width={size} height={size} className="relative z-10">
          <circle cx={size/2} cy={size/2} r={r} strokeWidth="10" stroke={mode.track} fill="rgba(255,255,255,0.015)" />
          <circle
            cx={size/2} cy={size/2} r={r} strokeWidth="10"
            stroke={mode.color} fill="none" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            className="ring-progress transition-all duration-1000"
            style={{ filter: running ? `drop-shadow(0 0 10px ${mode.color}90)` : `drop-shadow(0 0 4px ${mode.color}50)` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center gap-1">
          <span className="font-mono text-[3.5rem] font-bold tabular-nums text-text leading-none tracking-tight">
            {pad(mins)}:{pad(secs)}
          </span>
          <span className="text-[10px] text-text-muted uppercase tracking-[0.25em] font-medium">{mode.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5">
        <button onClick={reset}
          className="w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center
            text-text-muted hover:text-text hover:border-border-strong transition-all">
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => setRunning(v => !v)}
          className="w-18 h-18 rounded-full flex items-center justify-center font-semibold
            transition-all hover:scale-105 active:scale-95"
          style={{
            width: 72, height: 72,
            background: `linear-gradient(135deg, ${mode.color}ee, ${mode.color}99)`,
            boxShadow: running
              ? `0 0 32px ${mode.color}60, 0 8px 24px ${mode.color}30`
              : `0 4px 20px ${mode.color}30`,
            color: '#07070a',
          }}
        >
          {running ? <Pause size={26} /> : <Play size={26} className="ml-1" />}
        </button>
        <div className="w-12 h-12" />
      </div>

      {/* Cycles */}
      <div className="w-full bg-bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Ciclos de foco</p>
          <p className="text-2xl font-bold font-mono text-gradient-amber mt-0.5">{cycles}</p>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.max(4, cycles + 1) }).map((_, i) => (
            <div key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i < cycles ? mode.color : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-text-muted text-center leading-relaxed">
        25 min foco · 5 min pausa · a cada 4 ciclos, 15 min de pausa longa
      </p>
    </div>
  )
}
