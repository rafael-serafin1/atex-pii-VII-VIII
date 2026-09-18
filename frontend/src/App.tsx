import Header from '../features/modules/Header';
import Body from '../features/modules/Body';
import Footer from '../features/modules/Footer';
import { PAGE_META, type Page } from '../features/components/Nav/Nav';
import { useState } from 'react';

function App() {
  const [page, setPage] = useState<Page>('aluno')
  const meta = PAGE_META[page];
  
  console.dir(meta)

  return (
    <div className="pcb-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Header page={page} setPage={setPage} />
      <Body page={page} setPage={setPage} meta={meta} />
      <Footer />
    </div>
  )
}

export default App
