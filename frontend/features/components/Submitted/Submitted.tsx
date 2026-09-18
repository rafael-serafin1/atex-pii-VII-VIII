import * as Forms from '../Form/FormHandlers'
import type { Dispatch, SetStateAction } from 'react'

type FormProps = {
  form: Forms.FormData;
  setForm: Dispatch<SetStateAction<Forms.FormData>>;
  setSubmitted: Dispatch<SetStateAction<boolean>>
};

const checkIcon: string = '/check_icon.svg';

export function Submitted({ form, setForm, setSubmitted }: FormProps) {
    return (
    <>
      <div style={{
        padding: '2rem',
        border: '1px solid rgba(57,255,20,0.3)',
        background: 'rgba(57,255,20,0.05)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>
          <img src={checkIcon} style={{ margin: '0 auto', display: 'block' }} />
        </div>
        
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#39ff14', textShadow: '0 0 8px rgba(57,255,20,0.4)', letterSpacing: '0.1em', margin: '0 0 8px' }}>
          INSCRIÇÃO CONFIRMADA
        </p>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Obrigado, {form.nome}! Entraremos em contato pelo e-mail institucional em breve.
        </p>

        <button
          className='new-subscription'
          onClick={() => { setSubmitted(false); setForm({ nome: '', sobrenome: '', email: '', telefone: '' }) }}
          style={{
            marginTop: '1.25rem',
            background: 'none',
            border: '1px solid var(--color-pcb-trace)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseOver={e => { (e.target as HTMLElement).style.borderColor = 'rgba(57,255,20,0.4)'; (e.target as HTMLElement).style.color = '#c8f5c8' }}
          onMouseOut={e => { (e.target as HTMLElement).style.borderColor = 'var(--color-pcb-trace)'; (e.target as HTMLElement).style.color = 'var(--color-text-muted)' }}
        >
          NOVA INSCRIÇÃO
        </button>
      </div>   
    </>
    );
}