
export default function Footer() {
    return (
    <>
        {/* Footer */}
        <footer style={{
            position: 'relative',
            zIndex: 10,
            background: 'rgba(6, 14, 6, 0.92)',
            borderTop: '1px solid var(--color-pcb-trace)',
            backdropFilter: 'blur(8px)',
            padding: '1rem 2rem',
        }}>
            <div style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    © 2026 NavCode Instituto de Tecnologia
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-pcb-trace)', marginRight: 4 }}>✉</span>
                    contato.navcode01@gmail.com
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-pcb-trace)', marginRight: 4 }}>☏</span>
                    (11) 3000-0000
                    </span>
                </div>
            </div>
        </footer>
    </>
    );
}