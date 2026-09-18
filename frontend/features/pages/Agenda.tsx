import { useState } from "react"
import * as Handlers from "../components/Form/FormHandlers"
import { DiaCard } from "../components/Card/CardAula"
import { AlunosModal } from "../components/Modal/Alunos/ModalAlunos"

export function AgendaPage({ diasAula }: { diasAula: Handlers.DiaAula[] }) {
  const [modalDia, setModalDia] = useState<Handlers.DiaAula | null>(null)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {diasAula.map(dia => (
          <DiaCard key={dia.id} dia={dia} onVerAlunos={() => setModalDia(dia)} />
        ))}
      </div>
      {modalDia && <AlunosModal dia={modalDia} onClose={() => setModalDia(null)} />}
    </>
  )
}