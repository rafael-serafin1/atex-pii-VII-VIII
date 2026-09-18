export type Page = 'aluno' | 'curso' | 'agenda'

export const NAV: { id: Page; label: string }[] = [
  { id: 'aluno',  label: 'ALUNO'  },
  { id: 'curso',  label: 'CURSO'  },
  { id: 'agenda', label: 'AGENDA' },
]

export const PAGE_META: Record<Page, { title: string; desc: string; tag: string; wide?: boolean }> = {
  aluno:  { title: 'CADASTRO DE ALUNO',  desc: 'Preencha os dados para confirmar sua inscrição no curso.',         tag: 'REG_ALUNO_v1.0' },
  curso:  { title: 'CADASTRO DE CURSO',  desc: 'Registre um novo curso no sistema da instituição.',                 tag: 'REG_CURSO_v1.0', wide: true },
  agenda: { title: 'DIAS DE CURSO',      desc: 'Cronograma de aulas — clique em um card para ver a lista de presença.', tag: 'AGENDA_v1.0', wide: true },
}

export function NavBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
    return (
    <>
        <nav style={{ display: 'flex', gap: 4 }}>
            {NAV.map(item => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', padding: '0.35rem 0.85rem', cursor: 'pointer', border: '1px solid', transition: 'all 0.2s', background: active ? 'rgba(57,255,20,0.1)' : 'transparent', borderColor: active ? 'rgba(57,255,20,0.5)' : 'var(--color-pcb-trace)', color: active ? '#39ff14' : 'var(--color-text-muted)', textShadow: active ? '0 0 6px rgba(57,255,20,0.4)' : 'none', boxShadow: active ? '0 0 8px rgba(57,255,20,0.1)' : 'none' }}
                  onMouseOver={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(57,255,20,0.25)'; e.currentTarget.style.color = '#c8f5c8' } }}
                  onMouseOut={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--color-pcb-trace)'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}
                >
                  {active && <span style={{ marginRight: 5 }}>▶</span>}
                  {item.label}
                </button>
              )
            })}
        </nav>
    </>
    );
}