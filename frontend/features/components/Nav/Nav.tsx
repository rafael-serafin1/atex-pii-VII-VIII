import { type Page, NAV_GROUPS, NavDropdown } from '../NavDown/NavDown'
import './Nav.css'

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
      <nav className="navbar" style={{ display: 'flex', gap: 4 }}>
        {
          NAV_GROUPS.map(group => (
            <NavDropdown key={group.label} group={group} page={page} onSelect={setPage} />
          ))
        }
      </nav>
    </>
    );
}