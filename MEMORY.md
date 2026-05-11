# HabitFlow — Memória do Projeto

## Identidade
- Nome do app: **HabitFlow** · subtítulo "Hábitos & foco"
- Tema visual: **Lumina** (claro, inspirado em https://sistema-de-habitos.lovable.app/)
- Repositório: https://github.com/glifomidia-sys/habito-infoproduto
- Deploy: https://glifomidia-sys.github.io/habito-infoproduto/

## Stack
- React 19 + Vite 8 (sem TypeScript)
- Tailwind CSS v3 (NÃO v4)
- lucide-react para ícones
- Navegação via `useState` — sem react-router
- Estado global via Context API — sem Redux/Zustand
- Persistência: localStorage com prefixo `hz_`

## Estrutura de arquivos
```
src/
  App.jsx              # AppProvider + AppShell; mapa PAGES para navegação
  App.css              # Vazio — não usar
  index.css            # Tailwind directives, Inter font, scrollbar, .ring-progress
  store/
    AppContext.jsx      # Source of truth: habits, completions, tasks, achievements
  components/
    Sidebar.jsx        # Colapsa/expande; itens numerados 01-06; item ativo com bg-card+shadow
  pages/
    Dashboard.jsx      # Saudação, ProgressRing SVG, 3 StatCards, hábitos do dia, urgentes
    Habits.jsx         # CRUD + AddHabitModal (picker ícone/cor/dias), filtro Todos/Hoje
    DDD.jsx            # Dirty Dozen — tarefas urgentes, abas Pendentes/Concluídas
    Pomodoro.jsx       # Timer SVG 3 modos (25/5/15min), ciclos
    Stats.jsx          # HeatBar 7 dias, 4 métricas, breakdown por hábito
    Bau.jsx            # 8 conquistas com lógica dinâmica, desbloqueio automático
```

## Design tokens (tailwind.config.js) — tema claro Lumina
- `bg` (#f9fafb) — fundo principal
- `bg-card` (#ffffff) — cards e modais
- `bg-sidebar` (#f3f4f6) — sidebar
- `bg-hover` (#f0f0f0) — estados hover
- `border` (#e5e7eb) — bordas padrão
- `border-strong` (#d1d5db) — bordas de foco
- `text` (#111827) — texto principal
- `text-sub` (#6b7280) — texto secundário
- `text-muted` (#9ca3af) — texto apagado
- `accent` (#10b981) — verde (ação primária)
- `accent-light` (#d1fae5) — fundo verde claro
- `accent-dark` (#059669) — hover do accent
- `danger` (#ef4444) — vermelho urgente
- `danger-light` (#fee2e2) — fundo vermelho claro
- `shadow-card` — sombra sutil nos cards

## Modelo de dados (AppContext)
```js
// Habit
{ id: Date.now(), name: string, time: "HH:MM", place: string,
  icon: emoji, color: "#hex", days: number[] /* 0=Dom..6=Sáb */ }

// Completions
{ "YYYY-MM-DD": [habitId, ...] }

// Task
{ id: Date.now(), title: string, urgent: boolean, done: boolean }
```

## Padrões importantes
- IDs: `Date.now()`
- Data de hoje: `new Date().toISOString().split('T')[0]`
- Streak: calculado retroativamente até quebra de dia
- `weeklyAdherence()`: denominador = hábitos válidos por dia da semana
- Páginas que navegam recebem `setPage` como prop
- Modais: `fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50`
- SVG rings: `.ring-progress` aplica `transform: rotate(-90deg)` via index.css
- `vite.config.js` tem `base: '/habito-infoproduto/'` para GitHub Pages

## Deploy
- GitHub Actions: `.github/workflows/deploy.yml`
- Trigger: push para `main` → build → deploy automático no GitHub Pages
