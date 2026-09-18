import { useState } from "react"
import { AlunoForm, FormErrors } from "../components/Form/FormHandlers"
import { InputField } from "../components/InputField/InputField"
import { SubmitButton } from "../components/SubmitButton/SubmitButton"
import { SuccessPanel } from "../modules/SuccessPanel"
import { TraceLabel } from "../components/TraceLabels/TraceLabels"

export function AlunoPage() {
  const [form, setForm] = useState<AlunoForm>({ nome: '', sobrenome: '', email: '', telefone: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.nome.trim()) e.nome = 'Campo obrigatório'
    if (!form.sobrenome.trim()) e.sobrenome = 'Campo obrigatório'
    if (!form.email.trim()) e.email = 'Campo obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitted(true)
  }

  function handleChange(field: keyof AlunoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (submitted) {
    return <SuccessPanel title="INSCRIÇÃO CONFIRMADA" message={`Obrigado, ${form.nome}! Entraremos em contato pelo e-mail institucional em breve.`} onReset={() => { setSubmitted(false); setForm({ nome: '', sobrenome: '', email: '', telefone: '' }) }} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TraceLabel text="Identificação" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <InputField label="NOME" error={errors.nome}>
          <input className="input-field" type="text" placeholder="Ex: João" value={form.nome} onChange={e => handleChange('nome', e.target.value)} style={errors.nome ? { borderColor: '#ff4444' } : {}} />
        </InputField>
        <InputField label="SOBRENOME" error={errors.sobrenome}>
          <input className="input-field" type="text" placeholder="Ex: Silva" value={form.sobrenome} onChange={e => handleChange('sobrenome', e.target.value)} style={errors.sobrenome ? { borderColor: '#ff4444' } : {}} />
        </InputField>
      </div>
      <TraceLabel text="Contato" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <InputField label="E-MAIL INSTITUCIONAL" error={errors.email}>
          <input className="input-field" type="email" placeholder="usuario@instituicao.edu.br" value={form.email} onChange={e => handleChange('email', e.target.value)} style={errors.email ? { borderColor: '#ff4444' } : {}} />
        </InputField>
        <InputField label="TELEFONE" optional>
          <input className="input-field" type="tel" placeholder="(11) 99999-9999" value={form.telefone} onChange={e => handleChange('telefone', e.target.value)} />
        </InputField>
      </div>
      <SubmitButton label="CONFIRMAR INSCRIÇÃO" />
    </form>
  )
}