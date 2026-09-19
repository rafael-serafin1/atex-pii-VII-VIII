import { ArduinoBoardIcon } from '../components/icons/ArduinoBoardIcon';
import { PinIcon } from '../components/icons/PinIcon';
import { NavBar } from '../components/Nav/Nav';
import { type Page } from '../components/NavDown/NavDown';
import './Modules.css';

export default function Header({ page, setPage }: { page: Page, setPage: (p: Page) => void }) {
  return (
    <header 
      className="hero-header"
      style={{
        position: 'relative',
        zIndex: 20,
        background: 'rgba(6, 14, 6, 0.92)',
        borderBottom: '1px solid var(--color-pcb-trace)',
        boxShadow: '0 1px 0 rgba(57,255,20,0.08), 0 4px 24px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        padding: '0 2rem',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem 0', display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Arduino-style board icon */}
            <ArduinoBoardIcon />
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
                fontWeight: 700,
                color: '#39ff14',
                textShadow: '0 0 8px rgba(57,255,20,0.5)',
                margin: 0,
                letterSpacing: '0.1em',
                lineHeight: 1.1,
              }}>
                ARDUINO FUNDAMENTALS
              </h1>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--color-text-muted)',
                margin: 0,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                <PinIcon />NavCode Instituto de Tecnologia 
              </p>
            </div>
          </div>

          <NavBar page={page} setPage={setPage} />
        </div>
    </header>
  );
}