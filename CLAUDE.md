# HabitFlow — Guia do Projeto

## Comandos
```bash
npm run dev      # http://localhost:5173
npm run build    # build de produção (rodar antes de qualquer PR)
npm run preview  # preview do build local
```

## Deploy
Push para `main` → GitHub Actions faz build e deploy automático.
- Repositório: https://github.com/glifomidia-sys/habito-infoproduto
- App online: https://glifomidia-sys.github.io/habito-infoproduto/

## Arquitetura

**Navegação:** `useState` em `App.jsx`. Mapa `PAGES` mapeia id → componente. Para nova página: adicionar em `PAGES` e em `navItems` no `Sidebar.jsx`.

**Estado global:** `src/store/AppContext.jsx` via Context API. Não adicionar Redux, Zustand ou similar.

**Persistência:** `localStorage` com prefixo `hz_` (`hz_habits`, `hz_completions`, `hz_tasks`, `hz_achievements`).

**Tailwind CSS v3** — não atualizar para v4. Usar sempre os tokens do `tailwind.config.js`.

**`vite.config.js`** tem `base: '/habito-infoproduto/'` — necessário para GitHub Pages. Não remover.

## Convenções de código
- `.jsx` para todos os componentes, PascalCase nos nomes
- Sem TypeScript
- IDs gerados com `Date.now()`
- Datas como string `"YYYY-MM-DD"`
- Páginas que precisam navegar recebem `setPage` como prop

## Design system — tema claro Lumina

| Token | Cor | Uso |
|---|---|---|
| `bg` | `#f9fafb` | Fundo da aplicação |
| `bg-card` | `#ffffff` | Cards e modais |
| `bg-sidebar` | `#f3f4f6` | Sidebar |
| `bg-hover` | `#f0f0f0` | Hover states |
| `border` | `#e5e7eb` | Bordas padrão |
| `text` | `#111827` | Texto principal |
| `text-sub` | `#6b7280` | Texto secundário |
| `text-muted` | `#9ca3af` | Texto apagado |
| `accent` | `#10b981` | Ação primária (verde) |
| `accent-light` | `#d1fae5` | Fundo de destaque |
| `accent-dark` | `#059669` | Hover do accent |
| `danger` | `#ef4444` | Urgente/erro |

**Padrões de componente:**
- Toda página: `animate-fade-in` na div raiz
- Card: `bg-bg-card border border-border rounded-xl shadow-card`
- Botão primário: `bg-accent text-white font-semibold rounded-xl hover:bg-accent-dark`
- Modal: `fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4`
- Input: `bg-bg border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent/20`

## Onde mexer

| O que mudar | Arquivo |
|---|---|
| Nova página | `src/App.jsx` (PAGES) + `src/components/Sidebar.jsx` (navItems) |
| Lógica de hábitos / streak | `src/store/AppContext.jsx` |
| Nova conquista | `src/pages/Bau.jsx` — array `ACHIEVEMENTS` |
| Cores e tokens | `tailwind.config.js` |
| Animações / scrollbar | `src/index.css` |
| CI/CD | `.github/workflows/deploy.yml` |

## O que não fazer
- Não hardcodar hex em classes Tailwind — usar tokens
- Não criar arquivos CSS além de `index.css`
- Não instalar bibliotecas de componentes (shadcn, MUI, Radix standalone...)
- Não usar `react-router-dom`
- Não adicionar TypeScript
- Não remover `base` do `vite.config.js`
- Não modificar `App.css` (intencionalmente vazio)
