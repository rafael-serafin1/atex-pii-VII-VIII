import { Aluno, DiaAula } from "../../Form/FormHandlers"

export function PresencaBadge({ status }: { status: Aluno['presenca'] }) {
  const map = {
    presente:    { label: 'PRESENTE',    color: '#39ff14', bg: 'rgba(57,255,20,0.08)',   border: 'rgba(57,255,20,0.3)' },
    ausente:     { label: 'AUSENTE',     color: '#ff4444', bg: 'rgba(255,68,68,0.08)',   border: 'rgba(255,68,68,0.3)' },
    justificado: { label: 'JUSTIFICADO', color: '#00d4ff', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.3)' },
  };
  const s = map[status];

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: '2px 8px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}


export function AlunosModal({ dia, onClose }: { dia: DiaAula; onClose: () => void }) {
  const presentes   = dia.alunos.filter(a => a.presenca === 'presente').length
  const ausentes    = dia.alunos.filter(a => a.presenca === 'ausente').length
  const justificados = dia.alunos.filter(a => a.presenca === 'justificado').length

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: '100%', maxWidth: 560, background: '#0b1a0e', border: '1px solid var(--color-pcb-trace)', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: -6, left: -6, width: 16, height: 16, borderTop: '2px solid var(--color-neon-dim)', borderLeft: '2px solid var(--color-neon-dim)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderTop: '2px solid var(--color-neon-dim)', borderRight: '2px solid var(--color-neon-dim)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -6, left: -6, width: 16, height: 16, borderBottom: '2px solid var(--color-neon-dim)', borderLeft: '2px solid var(--color-neon-dim)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -6, right: -6, width: 16, height: 16, borderBottom: '2px solid var(--color-neon-dim)', borderRight: '2px solid var(--color-neon-dim)', pointerEvents: 'none' }} />

        {/* Modal header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-pcb-trace)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 5px #39ff14' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}>LISTA_PRESENÇA</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#c8f5c8', margin: 0, letterSpacing: '0.06em', lineHeight: 1.3 }}>{dia.titulo}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              {dia.dia} · {dia.horario}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid var(--color-pcb-trace)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,68,68,0.5)'; e.currentTarget.style.color = '#ff6666' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-pcb-trace)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
            aria-label="Fechar"
          >✕</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--color-pcb-trace)' }}>
          {[
            { label: 'PRESENTES', value: presentes, color: '#39ff14' },
            { label: 'AUSENTES', value: ausentes, color: '#ff4444' },
            { label: 'JUSTIFICADOS', value: justificados, color: '#00d4ff' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#0b1a0e', padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: stat.color, textShadow: `0 0 8px ${stat.color}66`, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.5rem', padding: '0.6rem 1.5rem', borderBottom: '1px solid var(--color-pcb-trace)', background: 'rgba(26,74,34,0.15)' }}>
          {['MATRÍCULA', 'NOME', 'PRESENÇA'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {dia.alunos.map((aluno, i) => (
            <div
              key={aluno.matricula}
              style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '0.5rem', alignItems: 'center', padding: '0.7rem 1.5rem', borderBottom: i < dia.alunos.length - 1 ? '1px solid rgba(26,74,34,0.4)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(26,74,34,0.06)', transition: 'background 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(57,255,20,0.04)' }}
              onMouseOut={e => { e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(26,74,34,0.06)' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#b87333', letterSpacing: '0.04em' }}>{aluno.matricula}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-main)' }}>{aluno.nome}</span>
              <PresencaBadge status={aluno.presenca} />
            </div>
          ))}
        </div>

        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--color-pcb-trace)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
          {dia.alunos.length} aluno{dia.alunos.length !== 1 ? 's' : ''} matriculado{dia.alunos.length !== 1 ? 's' : ''} · clique fora para fechar
        </div>
      </div>
    </div>
  )
}