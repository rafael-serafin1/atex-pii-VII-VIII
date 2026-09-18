import type { Page } from "../components/Nav/Nav";
import { AlunoPage } from "../pages/Aluno";
import { CursoPage } from "../pages/Curso";
import { AgendaPage } from "../pages/Agenda";
import { diasAula } from "../components/Form/FormHandlers";

export default function Body({ page, setPage, meta }: { page: Page, setPage: (p: Page) => void, meta: any }) {
  return (
    <main style={{
        flex: 1,
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: meta.wide ? 860 : 520 }}>
          <div style={{ position: 'relative' }}>
            {/* Corner brackets */}
            {(['tl','tr','bl','br'] as const).map(c => (
              <div key={c} style={{ position: 'absolute', width: 20, height: 20, pointerEvents: 'none', ...(c === 'tl' ? { top: -8, left: -8, borderTop: '2px solid var(--color-neon-dim)', borderLeft: '2px solid var(--color-neon-dim)' } : c === 'tr' ? { top: -8, right: -8, borderTop: '2px solid var(--color-neon-dim)', borderRight: '2px solid var(--color-neon-dim)' } : c === 'bl' ? { bottom: -8, left: -8, borderBottom: '2px solid var(--color-neon-dim)', borderLeft: '2px solid var(--color-neon-dim)' } : { bottom: -8, right: -8, borderBottom: '2px solid var(--color-neon-dim)', borderRight: '2px solid var(--color-neon-dim)' }) }} />
            ))}

            <div style={{ background: 'rgba(11,26,14,0.88)', border: '1px solid var(--color-pcb-trace)', backdropFilter: 'blur(10px)', padding: '2rem 2.25rem' }}>
              {/* Panel header */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 6px #39ff14' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }} />
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b87333', boxShadow: '0 0 4px #b87333' }} />
                  <div style={{ flex: 1, height: 1, background: 'var(--color-pcb-trace)', marginLeft: 4 }} />
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}>{meta.tag}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 600, color: '#c8f5c8', margin: 0, letterSpacing: '0.08em' }}>{meta.title}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{meta.desc}</p>
              </div>

              {page === 'aluno'  && <AlunoPage />}
              {page === 'curso'  && <CursoPage />}
              {page === 'agenda' && <AgendaPage diasAula={diasAula} />}
            </div>
          </div>
        </div>
      </main>
  );
}