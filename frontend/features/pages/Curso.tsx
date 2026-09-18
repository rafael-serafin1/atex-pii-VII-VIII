import { useState } from "react"
import { CursoForm, FormErrors } from "../components/Form/FormHandlers"
import { InputField } from "../components/InputField/InputField"
import { SubmitButton } from "../components/SubmitButton/SubmitButton"
import { SuccessPanel } from "../modules/SuccessPanel"
import { TraceLabel } from "../components/TraceLabels/TraceLabels"

export function CursoPage() {
  const [form, setForm] = useState<CursoForm>({ nome: '', codigo: '', descricao: '', cargaHoraria: '', modalidade: '', vagas: '', dataInicio: '', instrutor: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): FormErrors {
    const e: FormErrors = {}
    
    if (!form.nome.trim()) 
        e.nome = 'Campo obrigatório'
    if (!form.codigo.trim()) 
        e.codigo = 'Campo obrigatório'
    if (!form.cargaHoraria.trim()) 
        e.cargaHoraria = 'Campo obrigatório'
    else if (isNaN(Number(form.cargaHoraria)) || Number(form.cargaHoraria) <= 0) 
        e.cargaHoraria = 'Valor inválido'
    if (!form.modalidade) 
        e.modalidade = 'Selecione uma modalidade'
    if (!form.vagas.trim()) 
        e.vagas = 'Campo obrigatório'
    else if (isNaN(Number(form.vagas)) || Number(form.vagas) <= 0) 
        e.vagas = 'Valor inválido'
    if (!form.dataInicio) 
        e.dataInicio = 'Campo obrigatório'
    if (!form.instrutor.trim()) 
        e.instrutor = 'Campo obrigatório'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitted(true)
  }

  function handleChange(field: keyof CursoForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (submitted) {
    return <SuccessPanel title="CURSO CADASTRADO" message={`O curso "${form.nome}" foi registrado com sucesso no sistema.`} onReset={() => { setSubmitted(false); setForm({ nome: '', codigo: '', descricao: '', cargaHoraria: '', modalidade: '', vagas: '', dataInicio: '', instrutor: '' }) }} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TraceLabel text="Identificação do Curso" />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <InputField label="NOME DO CURSO" error={errors.nome}>
          <input className="input-field" type="text" placeholder="Ex: Arduino para Iniciantes" value={form.nome} onChange={e => handleChange('nome', e.target.value)} style={errors.nome ? { borderColor: '#ff4444' } : {}} />
        </InputField>
        <InputField label="CÓDIGO" error={errors.codigo}>
          <input className="input-field" type="text" placeholder="Ex: ARD-101" value={form.codigo} onChange={e => handleChange('codigo', e.target.value)} style={errors.codigo ? { borderColor: '#ff4444' } : {}} />
        </InputField>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <InputField label="DESCRIÇÃO" optional>
          <textarea className="input-field" placeholder="Descreva brevemente o conteúdo e objetivos do curso..." value={form.descricao} onChange={e => handleChange('descricao', e.target.value)} rows={3} style={{ resize: 'vertical', minHeight: 80 }} />
        </InputField>
      </div>
      <TraceLabel text="Configuração" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
        <InputField label="CARGA HORÁRIA (h)" error={errors.cargaHoraria}>
          <input className="input-field" type="number" min="1" placeholder="Ex: 40" value={form.cargaHoraria} onChange={e => handleChange('cargaHoraria', e.target.value)} style={errors.cargaHoraria ? { borderColor: '#ff4444' } : {}} />
        </InputField>
        <InputField label="VAGAS" error={errors.vagas}>
          <input className="input-field" type="number" min="1" placeholder="Ex: 30" value={form.vagas} onChange={e => handleChange('vagas', e.target.value)} style={errors.vagas ? { borderColor: '#ff4444' } : {}} />
        </InputField>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <InputField label="MODALIDADE" error={errors.modalidade}>
          <select className="input-field" value={form.modalidade} onChange={e => handleChange('modalidade', e.target.value)} style={{ cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236a9a6a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', ...(errors.modalidade ? { borderColor: '#ff4444' } : {}) }}>
            <option value="" disabled style={{ background: '#0b1a0e' }}>Selecionar...</option>
            <option value="presencial" style={{ background: '#0b1a0e' }}>Presencial</option>
            <option value="online" style={{ background: '#0b1a0e' }}>Online</option>
            <option value="hibrido" style={{ background: '#0b1a0e' }}>Híbrido</option>
          </select>
        </InputField>
        <InputField label="DATA DE INÍCIO" error={errors.dataInicio}>
          <input className="input-field" type="date" value={form.dataInicio} onChange={e => handleChange('dataInicio', e.target.value)} style={{ colorScheme: 'dark', ...(errors.dataInicio ? { borderColor: '#ff4444' } : {}) }} />
        </InputField>
      </div>
      <TraceLabel text="Responsável" />
      <div style={{ marginTop: '1rem' }}>
        <InputField label="INSTRUTOR / RESPONSÁVEL" error={errors.instrutor}>
          <input className="input-field" type="text" placeholder="Ex: Prof. Maria Santos" value={form.instrutor} onChange={e => handleChange('instrutor', e.target.value)} style={errors.instrutor ? { borderColor: '#ff4444' } : {}} />
        </InputField>
      </div>
      <SubmitButton label="CADASTRAR CURSO" />
    </form>
  )
}