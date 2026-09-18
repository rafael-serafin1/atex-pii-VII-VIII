import {PinIcon} from '../icons/PinIcon';
import {TraceLabel} from '../TraceLabels/TraceLabels';
import * as Forms from './FormHandlers'
import type { Dispatch, SetStateAction } from 'react'

type FormProps = {
  form: Forms.FormData
  errors: Forms.FormErrors
  setForm: Dispatch<SetStateAction<Forms.FormData>>
  setErrors: Dispatch<SetStateAction<Forms.FormErrors>>
  setSubmitted: Dispatch<SetStateAction<boolean>>
}

export function Form({ form, errors, setForm, setErrors, setSubmitted }: FormProps) {
    function validate(form: Forms.FormData): Forms.FormErrors {
        const e: Forms.FormErrors = {}
    
        if (!form.nome.trim()) 
            e.nome = 'Campo obrigatório'
        if (!form.sobrenome.trim()) 
            e.sobrenome = 'Campo obrigatório'
    
        if (!form.email.trim()) {
          e.email = 'Campo obrigatório'
        } 
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          e.email = 'E-mail inválido'
        }
    
        return e
    }
    
    function handleSubmit(form: Forms.FormData, e: React.FormEvent) {
        e.preventDefault()
        const errs = validate(form)
    
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
    
        setSubmitted(true)
    }

    function handleChange(errors: Forms.FormErrors, field: keyof Forms.FormData, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
    
        if (errors[field]) 
            setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return (
        <>
            <form onSubmit={e => handleSubmit(form, e)} noValidate>
              <TraceLabel text="Identificação" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    <PinIcon />NOME *
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Ex: João"
                    value={form.nome}
                    onChange={e => handleChange(errors, 'nome', e.target.value)}
                    style={errors.nome ? { borderColor: '#ff4444' } : {}}
                  />
                  {errors.nome && <span style={{ fontSize: '0.65rem', color: '#ff6666', display: 'block', marginTop: 4 }}>{errors.nome}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    <PinIcon />SOBRENOME *
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Ex: Silva"
                    value={form.sobrenome}
                    onChange={e => handleChange(errors, 'sobrenome', e.target.value)}
                    style={errors.sobrenome ? { borderColor: '#ff4444' } : {}}
                  />
                  {errors.sobrenome && <span style={{ fontSize: '0.65rem', color: '#ff6666', display: 'block', marginTop: 4 }}>{errors.sobrenome}</span>}
                </div>
              </div>
              <TraceLabel text="Contato" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    <PinIcon />E-MAIL INSTITUCIONAL *
                  </label>
                  <input
                    className="input-field"
                    type="email"
                    placeholder="usuario@instituicao.edu.br"
                    value={form.email}
                    onChange={e => handleChange(errors, 'email', e.target.value)}
                    style={errors.email ? { borderColor: '#ff4444' } : {}}
                  />
                  {errors.email && <span style={{ fontSize: '0.65rem', color: '#ff6666', display: 'block', marginTop: 4 }}>{errors.email}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
                    <PinIcon />TELEFONE{' '}
                    <span style={{ color: '#3a6a3a', fontSize: '0.6rem' }}>(OPCIONAL)</span>
                  </label>
                  <input
                    className="input-field"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={form.telefone}
                    onChange={e => handleChange(errors, 'telefone', e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(57, 255, 20, 0.08)',
                    border: '1px solid rgba(57, 255, 20, 0.4)',
                    color: '#39ff14',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textShadow: '0 0 8px rgba(57,255,20,0.4)',
                  }}
                  onMouseOver={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(57, 255, 20, 0.15)'
                    el.style.boxShadow = '0 0 16px rgba(57,255,20,0.2)'
                  }}
                  onMouseOut={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(57, 255, 20, 0.08)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  CONFIRMAR INSCRIÇÃO
                </button>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
                  * Campos obrigatórios
                </p>
              </div>
            </form>
        </>
    );
}