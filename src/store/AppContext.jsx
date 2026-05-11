import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const today = () => new Date().toISOString().split('T')[0]

const defaultHabits = [
  { id: 1, name: 'Exercitar-se', time: '07:00', place: 'Academia', icon: '🏋️', color: '#00d4a3', days: [1,2,3,4,5] },
  { id: 2, name: 'Meditar', time: '06:30', place: 'Quarto', icon: '🧘', color: '#818cf8', days: [0,1,2,3,4,5,6] },
  { id: 3, name: 'Ler', time: '21:00', place: 'Sala', icon: '📚', color: '#f59e0b', days: [0,1,2,3,4,5,6] },
]

const defaultTasks = [
  { id: 1, title: 'Finalizar relatório mensal', urgent: true, done: false },
  { id: 2, title: 'Pagar conta de luz', urgent: true, done: false },
]

export function AppProvider({ children }) {
  const [habits, setHabits] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hz_habits')) || defaultHabits } catch { return defaultHabits }
  })
  const [completions, setCompletions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hz_completions')) || {} } catch { return {} }
  })
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hz_tasks')) || defaultTasks } catch { return defaultTasks }
  })
  const [achievements, setAchievements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hz_achievements')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('hz_habits', JSON.stringify(habits)) }, [habits])
  useEffect(() => { localStorage.setItem('hz_completions', JSON.stringify(completions)) }, [completions])
  useEffect(() => { localStorage.setItem('hz_tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => { localStorage.setItem('hz_achievements', JSON.stringify(achievements)) }, [achievements])

  const todayKey = today()

  const todayCompletions = completions[todayKey] || []

  const toggleHabit = (id) => {
    setCompletions(prev => {
      const day = prev[todayKey] || []
      const updated = day.includes(id) ? day.filter(x => x !== id) : [...day, id]
      return { ...prev, [todayKey]: updated }
    })
  }

  const addHabit = (habit) => {
    const id = Date.now()
    setHabits(prev => [...prev, { ...habit, id }])
  }

  const removeHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now(), done: false }])
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  // streak calculation
  const getStreak = (habitId) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if ((completions[key] || []).includes(habitId)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return streak
  }

  const weeklyAdherence = () => {
    if (habits.length === 0) return 0
    let total = 0, done = 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const dayOfWeek = d.getDay()
      const dayHabits = habits.filter(h => h.days.includes(dayOfWeek))
      total += dayHabits.length
      done += (completions[key] || []).filter(id => dayHabits.some(h => h.id === id)).length
    }
    return total === 0 ? 0 : Math.round((done / total) * 100)
  }

  const bestStreak = () => {
    if (habits.length === 0) return 0
    return Math.max(0, ...habits.map(h => getStreak(h.id)))
  }

  const todayHabits = () => {
    const dow = new Date().getDay()
    return habits.filter(h => h.days.includes(dow))
  }

  return (
    <AppContext.Provider value={{
      habits, addHabit, removeHabit,
      completions, todayCompletions, toggleHabit,
      tasks, addTask, toggleTask, removeTask,
      achievements,
      getStreak, weeklyAdherence, bestStreak,
      todayHabits,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
