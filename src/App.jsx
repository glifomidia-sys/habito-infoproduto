import { useState } from 'react'
import { AppProvider } from './store/AppContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import DDD from './pages/DDD'
import Pomodoro from './pages/Pomodoro'
import Stats from './pages/Stats'
import Bau from './pages/Bau'

const PAGES = {
  dashboard: Dashboard,
  habits:    Habits,
  ddd:       DDD,
  pomodoro:  Pomodoro,
  stats:     Stats,
  bau:       Bau,
}

function AppShell() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page] || Dashboard

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar page={page} setPage={setPage} />
      <main className="flex-1 overflow-y-auto bg-bg">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Page setPage={setPage} />
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
