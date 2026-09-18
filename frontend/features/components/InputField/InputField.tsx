import { PinIcon } from '../icons/PinIcon';

export function InputField({ label, optional, error, children }: { label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
        <PinIcon />{label}
        {optional && <span style={{ color: '#3a6a3a', fontSize: '0.6rem', marginLeft: 4 }}>(OPCIONAL)</span>}
        {!optional && <span style={{ color: 'var(--color-text-muted)' }}> *</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: '0.65rem', color: '#ff6666', display: 'block', marginTop: 4 }}>{error}</span>}
    </div>
  )
}