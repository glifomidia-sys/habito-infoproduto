# HabitZen — Guia do Projeto

## Comandos essenciais
```bash
npm run dev      # servidor local em http://localhost:5173
npm run build    # build de produção (checar erros antes de alterações grandes)
npm run preview  # preview do build
```

## Stack e decisões de arquitetura

**Sem roteador externo.** A navegação é feita via `useState` em `App.jsx`. O mapa `PAGES` define todas as páginas; para adicionar uma nova, basta inserir o componente nesse mapa e no `Sidebar.jsx`.

**Sem biblioteca de estado.** Todo o estado global vive em `src/store/AppContext.jsx` via Context API. Nunca adicione Redux, Zustand ou similar sem necessidade clara.

**Tailwind CSS v3** (não v4). As cores do projeto são tokens customizados — use sempre `surface-*` e `accent` do `tailwind.config.js`, nunca hardcode hex em classes.

**Persistência via localStorage.** As chaves são prefixadas com `hz_`. Qualquer novo estado global persistido deve seguir esse padrão.

## Convenções de código

- Componentes em PascalCase, arquivos com a extensão `.jsx`
- Sem TypeScript — não introduzir
- Sem arquivos de teste por enquanto
- `Date.now()` para geração de IDs
- Datas como string `"YYYY-MM-DD"` (via `.toISOString().split('T')[0]`)
- Nenhuma página usa `react-router` — recebem `setPage` como prop quando precisam navegar

## Design system

| Token | Valor | Uso |
|---|---|---|
| `surface-950` | `#07090f` | Background da aplicação |
| `surface-900` | `#0d1117` | Sidebar |
| `surface-800` | `#161b27` | Cards e modais |
| `surface-700` | `#1e2535` | Inputs, barras de progresso |
| `accent` | `#00d4a3` | Ações primárias, destaques |

- Toda página deve ter `animate-fade-in` na div raiz
- Modais: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4`
- Botão primário padrão: `bg-accent text-surface-950 font-semibold rounded-xl hover:bg-accent/90`
- Cards padrão: `bg-surface-800 border border-white/5 rounded-xl`

## Onde mexer em cada funcionalidade

| Funcionalidade | Arquivo |
|---|---|
| Adicionar nova página | `src/App.jsx` (PAGES map) + `src/components/Sidebar.jsx` (navItems) |
| Lógica de hábitos/streak | `src/store/AppContext.jsx` |
| Adicionar conquista no Baú | `src/pages/Bau.jsx` — array `ACHIEVEMENTS` |
| Paleta de cores | `tailwind.config.js` |
| Animações globais | `tailwind.config.js` + `src/index.css` |
| Scroll e scrollbar | `src/index.css` |

## O que não fazer
- Não criar novos arquivos CSS além de `index.css`
- Não instalar bibliotecas de componentes (shadcn, MUI, etc.) — design é próprio
- Não usar `react-router-dom`
- Não adicionar TypeScript
- Não modificar `App.css` (está intencionalmente vazio)
