using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

namespace frontends.Pages;

public class IndexModel : PageModel
{
    [BindProperty(SupportsGet = true)]
    public string Tela { get; set; } = "aluno";

    [BindProperty]
    public CadastroAluno Aluno { get; set; } = new();

    [BindProperty]
    public CadastroCurso Curso { get; set; } = new();

    [BindProperty]
    [Required(ErrorMessage = "Informe o código da aula")]
    public string CodigoPresenca { get; set; } = string.Empty;

    public bool CadastroConcluido { get; private set; }
    public string MensagemSucesso { get; private set; } = string.Empty;
    public IReadOnlyList<Aula> Aulas { get; } = CriarAulas();

    public void OnGet()
    {
        NormalizarTela();
    }

    public IActionResult OnPostCadastrarAluno()
    {
        Tela = "aluno";
        if (!ModelState.IsValid)
            return Page();

        CadastroConcluido = true;
        MensagemSucesso = $"Obrigado, {Aluno.Nome}! Entraremos em contato pelo e-mail institucional em breve.";
        return Page();
    }

    public IActionResult OnPostCadastrarCurso()
    {
        Tela = "curso";
        if (!ModelState.IsValid)
            return Page();

        CadastroConcluido = true;
        MensagemSucesso = $"O curso \"{Curso.Nome}\" foi registrado com sucesso no sistema.";
        return Page();
    }

    public IActionResult OnPostMarcarPresenca()
    {
        Tela = "presenca";
        if (!ModelState.IsValid)
            return Page();

        CadastroConcluido = true;
        MensagemSucesso = "O código foi recebido e a presença foi registrada nesta demonstração.";
        return Page();
    }

    private void NormalizarTela()
    {
        if (Tela is not ("aluno" or "curso" or "agenda" or "presenca"))
            Tela = "aluno";
    }

    private static IReadOnlyList<Aula> CriarAulas()
    {
        string[] matriculas = ["ARD-2025-001", "ARD-2025-002", "ARD-2025-003", "ARD-2025-004", "ARD-2025-005"];
        string[] nomes = ["João Silva", "Maria Oliveira", "Carlos Mendes", "Ana Costa", "Pedro Souza"];
        string[][] presencas =
        [
            ["presente", "presente", "ausente", "presente", "justificado"],
            ["presente", "ausente", "presente", "presente", "presente"],
            ["ausente", "presente", "presente", "justificado", "presente"],
            ["presente", "presente", "presente", "presente", "ausente"],
            ["presente", "presente", "justificado", "presente", "presente"],
            ["presente", "presente", "presente", "presente", "presente"]
        ];
        string[] titulos =
        [
            "Introdução ao Arduino", "Programação Básica em C++", "Entradas e Saídas Digitais",
            "Sensores Analógicos", "Comunicação Serial e LCD", "Projeto Final — Estação de Monitoramento"
        ];
        string[] resumos =
        [
            "Apresentação da plataforma, história, componentes da placa e configuração do ambiente de desenvolvimento (IDE).",
            "Estrutura de um sketch, variáveis, tipos de dados, operadores, estruturas condicionais e loops aplicados ao Arduino.",
            "Controle de LEDs, leitura de botões, conceito de pull-up/pull-down, debounce e boas práticas de circuito.",
            "Leitura de sensores de temperatura, luz (LDR) e potenciômetro via entradas analógicas. Conversão ADC e mapeamento de valores.",
            "Protocolo UART, monitor serial, biblioteca LiquidCrystal, exibição de dados de sensores em display 16x2.",
            "Integração de sensores de temperatura e umidade, display LCD e alertas com LED e buzzer em projeto autônomo."
        ];
        string[] dias =
        [
            "Segunda-feira, 06/10/2025", "Quarta-feira, 08/10/2025", "Segunda-feira, 13/10/2025",
            "Quarta-feira, 15/10/2025", "Segunda-feira, 20/10/2025", "Quarta-feira, 22/10/2025"
        ];
        string[] horarios = ["19:00 – 21:00", "19:00 – 21:00", "19:00 – 21:00", "19:00 – 21:00", "19:00 – 21:00", "18:00 – 22:00"];

        return Enumerable.Range(0, titulos.Length)
            .Select(index => new Aula(index + 1, titulos[index], resumos[index], dias[index], horarios[index],
                Enumerable.Range(0, nomes.Length)
                    .Select(studentIndex => new AlunoPresenca(matriculas[studentIndex], nomes[studentIndex], presencas[index][studentIndex]))
                    .ToList()))
            .ToList();
    }

    public sealed class CadastroAluno
    {
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Nome { get; set; } = string.Empty;
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Sobrenome { get; set; } = string.Empty;
        [Required(ErrorMessage = "Campo obrigatório")]
        [EmailAddress(ErrorMessage = "E-mail inválido")]
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
    }

    public sealed class CadastroCurso
    {
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Nome { get; set; } = string.Empty;
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Codigo { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        [Range(1, int.MaxValue, ErrorMessage = "Valor inválido")]
        public int? CargaHoraria { get; set; }
        [Required(ErrorMessage = "Selecione uma modalidade")]
        public string Modalidade { get; set; } = string.Empty;
        [Required(ErrorMessage = "Campo obrigatório")]
        [Range(1, int.MaxValue, ErrorMessage = "Valor inválido")]
        public int? Vagas { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        [DataType(DataType.Date)]
        public DateTime? DataInicio { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        public string Instrutor { get; set; } = string.Empty;
    }

    public sealed record Aula(int Id, string Titulo, string Resumo, string Dia, string Horario, IReadOnlyList<AlunoPresenca> Alunos);
    public sealed record AlunoPresenca(string Matricula, string Nome, string Presenca);
}
