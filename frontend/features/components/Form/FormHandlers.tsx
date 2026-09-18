export type FormData = {
  nome: string
  sobrenome: string
  email: string
  telefone: string
}

export type AlunoForm = { nome: string; sobrenome: string; email: string; telefone: string }
export type CursoForm = { nome: string; codigo: string; descricao: string; cargaHoraria: string; modalidade: string; vagas: string; dataInicio: string; instrutor: string }
export type FormErrors = Record<string, string>

export type Aluno = { matricula: string; nome: string; presenca: 'presente' | 'ausente' | 'justificado' }

export type DiaAula = {
  id: number
  titulo: string
  resumo: string
  dia: string
  horario: string
  alunos: Aluno[]
}

/* são as "aulas" */
export const diasAula: DiaAula[] = [
  {
    id: 1,
    titulo: 'Introdução ao Arduino',
    resumo: 'Apresentação da plataforma, história, componentes da placa e configuração do ambiente de desenvolvimento (IDE).',
    dia: 'Segunda-feira, 06/10/2025',
    horario: '19:00 \- 21:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'presente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'presente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'ausente' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'presente' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'justificado' },
    ],
  },
  {
    id: 2,
    titulo: 'Programação Básica em C++',
    resumo: 'Estrutura de um sketch, variáveis, tipos de dados, operadores, estruturas condicionais e loops aplicados ao Arduino.',
    dia: 'Quarta-feira, 08/10/2025',
    horario: '19:00 \- 21:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'presente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'ausente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'presente' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'presente' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'presente' },
    ],
  },
  {
    id: 3,
    titulo: 'Entradas e Saídas Digitais',
    resumo: 'Controle de LEDs, leitura de botões, conceito de pull-up/pull-down, debounce e boas práticas de circuito.',
    dia: 'Segunda-feira, 13/10/2025',
    horario: '19:00 \- 21:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'ausente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'presente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'presente' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'justificado' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'presente' },
    ],
  },
  {
    id: 4,
    titulo: 'Sensores Analógicos',
    resumo: 'Leitura de sensores de temperatura, luz (LDR) e potenciômetro via entradas analógicas. Conversão ADC e mapeamento de valores.',
    dia: 'Quarta-feira, 15/10/2025',
    horario: '19:00 \- 21:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'presente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'presente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'presente' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'presente' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'ausente' },
    ],
  },
  {
    id: 5,
    titulo: 'Comunicação Serial e LCD',
    resumo: 'Protocolo UART, monitor serial, biblioteca LiquidCrystal, exibição de dados de sensores em display 16x2.',
    dia: 'Segunda-feira, 20/10/2025',
    horario: '19:00 \- 21:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'presente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'presente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'justificado' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'presente' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'presente' },
    ],
  },
  {
    id: 6,
    titulo: 'Projeto Final — Estação de Monitoramento',
    resumo: 'Integração de sensores de temperatura e umidade, display LCD e alertas com LED e buzzer em projeto autônomo.',
    dia: 'Quarta-feira, 22/10/2025',
    horario: '18:00 \- 22:00',
    alunos: [
      { matricula: 'ARD-2025-001', nome: 'João Silva', presenca: 'presente' },
      { matricula: 'ARD-2025-002', nome: 'Maria Oliveira', presenca: 'presente' },
      { matricula: 'ARD-2025-003', nome: 'Carlos Mendes', presenca: 'presente' },
      { matricula: 'ARD-2025-004', nome: 'Ana Costa', presenca: 'presente' },
      { matricula: 'ARD-2025-005', nome: 'Pedro Souza', presenca: 'presente' },
    ],
  },
]