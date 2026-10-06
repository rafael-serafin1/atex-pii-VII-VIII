using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using System.ComponentModel.DataAnnotations;
using backend.model;
using backend.repo;

namespace frontends.Pages;

public class IndexModel : PageModel
{
    private readonly AlunoRepository _alunoRepository;
    private readonly CursoRepository _cursoRepository;
    private readonly AulaRepository _aulaRepository;
    private readonly PresencaRepository _presencaRepository;

    private readonly ILogger<IndexModel> _logger;

    public IndexModel(AlunoRepository alunoRepository, CursoRepository cursoRepository, AulaRepository aulaRepository, PresencaRepository presencaRepository, ILogger<IndexModel> logger)
    {
        _alunoRepository = alunoRepository;
        _cursoRepository = cursoRepository;
        _aulaRepository = aulaRepository;
        _presencaRepository = presencaRepository;
        _logger = logger;
    }

    [BindProperty(SupportsGet = true)]
    public string Tela { get; set; } = "aluno";

    [BindProperty]
    public CadastroAluno Aluno { get; set; } = new();

    [BindProperty]
    public CadastroCurso Curso { get; set; } = new();

    [BindProperty]
    public CadastroAula Aula { get; set; } = new();

    [BindProperty]
    public int? AulaSelecionada { get; set; }

    [BindProperty]
    public List<int> AlunosPresentes { get; set; } = [];

    [BindProperty]
    public Dictionary<int, string> Observacoes { get; set; } = [];

    public bool CadastroConcluido { get; private set; }
    public string MensagemSucesso { get; private set; } = string.Empty;
    public IReadOnlyList<CursoComAulas> AgendaCursos { get; private set; } = [];
    public IReadOnlyList<Alunos> AlunosCadastrados { get; private set; } = [];
    public IReadOnlyList<Aulas> AulasCadastradas { get; private set; } = [];
    public IReadOnlyList<Cursos> CursosCadastrados { get; private set; } = [];

    public IActionResult OnGet()
    {
        NormalizarTela();

        if (Tela == "agenda")
        {
            try
            {
                var aulas = _aulaRepository.GetAllAulas();
                AgendaCursos = _cursoRepository.GetAllCursos()
                    .Select(curso => new CursoComAulas(
                        curso,
                        aulas.Where(aula => aula.IdCurso == curso.Id)
                            .OrderBy(aula => aula.DataAula)
                            .ToList()))
                    .ToList();
            }
            catch (SqlException exception)
            {
                _logger.LogError(exception, "Falha ao carregar cursos e aulas para a agenda");
                ModelState.AddModelError(string.Empty, "Não foi possível carregar a agenda. Tente novamente mais tarde.");
            }
        }

        if (Tela == "presenca")
            CarregarDadosPresenca();

        if (Tela == "aula")
            CarregarCursos();

        return Page();
    }

    public IActionResult OnPostCadastrarAluno()
    {
        Tela = "aluno";
        ValidateOnly(Aluno, nameof(Aluno));

        if (!ModelStateValidFor("aluno"))
            return Page();

        var aluno = new Alunos(
            0, 
            Aluno.Nome.Trim(), 
            Aluno.Sobrenome.Trim(),
            (string.IsNullOrWhiteSpace(Aluno.Telefone) ? null : Aluno.Telefone.Trim()),
            Aluno.Email.Trim(),
            DateTime.Now
        );

        try
        {
            _alunoRepository.CreateAluno(aluno);
        }
        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao cadastrar aluno no banco de dados");
            ModelState.AddModelError(string.Empty, "Não foi possível cadastrar o aluno. Tente novamente.");
            return Page();
        }

        CadastroConcluido = true;
        MensagemSucesso = $"Obrigado, {Aluno.Nome}! Entraremos em contato pelo e-mail institucional em breve.";
        return Page();
    }

    public IActionResult OnPostCadastrarCurso()
    {
        Tela = "curso";
        ValidateOnly(Curso, nameof(Curso));

        if (!ModelStateValidFor("curso"))
            return Page();

        var curso = new Cursos(
            0,
            Curso.Nome.Trim(),
            string.IsNullOrWhiteSpace(Curso.Descricao) ? null : Curso.Descricao.Trim(),
            Curso.DataApresentacao!.Value,
            Curso.TempoApresentacao!.Value);

        try
        {
            _cursoRepository.CreateCurso(curso);
        }
        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao cadastrar curso no banco de dados");
            ModelState.AddModelError(string.Empty, "Não foi possível cadastrar o curso. Tente novamente.");
            return Page();
        }

        CadastroConcluido = true;
        MensagemSucesso = $"O curso \"{Curso.Nome}\" foi registrado com sucesso no sistema.";
        return Page();
    }

    public IActionResult OnPostCadastrarAula()
    {
        Tela = "aula";
        ValidateOnly(Aula, nameof(Aula));

        if (!ModelStateValidFor("aula"))
        {
            CarregarCursos();
            return Page();
        }

        try
        {
            var cursos = _cursoRepository.GetAllCursos();
            if (!cursos.Any(curso => curso.Id == Aula.IdCurso))
            {
                ModelState.AddModelError(nameof(Aula.IdCurso), "Selecione um curso válido.");
                CarregarCursos();
                return Page();
            }

            _aulaRepository.CreateAula(new Aulas(
                0,
                Aula.IdCurso!.Value,
                Aula.Titulo.Trim(),
                Aula.DataAula!.Value));
        }
        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao cadastrar aula no banco de dados");
            ModelState.AddModelError(string.Empty, "Não foi possível cadastrar a aula. Tente novamente.");
            CarregarCursos();
            return Page();
        }

        CadastroConcluido = true;
        MensagemSucesso = $"A aula \"{Aula.Titulo}\" foi cadastrada com sucesso.";
        return Page();
    }

    public IActionResult OnPostMarcarPresenca()
    {
        Tela = "presenca";
        ModelState.Clear();

        if (!AulaSelecionada.HasValue)
            ModelState.AddModelError(nameof(AulaSelecionada), "Selecione a aula");

        if (!ModelStateValidFor("presença"))
        {
            CarregarDadosPresenca();
            return Page();
        }

        try
        {
            var alunos = _alunoRepository.GetAllAlunos();
            var aulas = _aulaRepository.GetAllAulas();
            if (!aulas.Any(aula => aula.Id == AulaSelecionada.Value))
            {
                ModelState.AddModelError(nameof(AulaSelecionada), "A aula selecionada não existe.");
                CarregarDadosPresenca();
                return Page();
            }

            var alunoIds = alunos.Select(aluno => aluno.Id).ToHashSet();
            if (AlunosPresentes.Any(id => !alunoIds.Contains(id)))
            {
                ModelState.AddModelError(string.Empty, "A lista de alunos informada é inválida.");
                CarregarDadosPresenca();
                return Page();
            }

            var presentes = AlunosPresentes.ToHashSet();
            if (Observacoes.Any(item => !alunoIds.Contains(item.Key) || item.Value.Length > 150))
            {
                ModelState.AddModelError(string.Empty, "Cada observação deve pertencer a um aluno e ter no máximo 150 caracteres.");
                CarregarDadosPresenca();
                return Page();
            }

            var registros = alunos.Select(aluno => new Presencas(
                0,
                aluno.Id,
                AulaSelecionada.Value,
                presentes.Contains(aluno.Id),
                presentes.Contains(aluno.Id)
                    ? string.Empty
                    : (Observacoes.TryGetValue(aluno.Id, out var observacao)
                        ? observacao.Trim()
                        : string.Empty),
                DateTime.Now));

            _presencaRepository.SavePresencas(AulaSelecionada.Value, registros);
        }
        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao registrar presenças no banco de dados");
            ModelState.AddModelError(string.Empty, "Não foi possível registrar a presença. Tente novamente.");
            CarregarDadosPresenca();
            return Page();
        }

        CadastroConcluido = true;
        MensagemSucesso = "A chamada foi registrada com sucesso.";
        return Page();
    }

    private void NormalizarTela()
    {
        if (Tela is not ("aluno" or "curso" or "aula" or "agenda" or "presenca"))
            Tela = "aluno";
    }

    private void CarregarDadosPresenca()
    {
        try
        {
            AlunosCadastrados = _alunoRepository.GetAllAlunos();
            AulasCadastradas = _aulaRepository.GetAllAulas()
                .OrderByDescending(aula => aula.DataAula)
                .ToList();
        }

        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao carregar alunos e aulas para registro de presença");
            ModelState.AddModelError(string.Empty, "Não foi possível carregar os dados da presença. Tente novamente mais tarde.");
        }
    }

    private void CarregarCursos()
    {
        try
        {
            CursosCadastrados = _cursoRepository.GetAllCursos()
                .OrderBy(curso => curso.Nome)
                .ToList();
        }
        catch (SqlException exception)
        {
            _logger.LogError(exception, "Falha ao carregar cursos para cadastro de aula");
            ModelState.AddModelError(string.Empty, "Não foi possível carregar os cursos. Tente novamente mais tarde.");
        }
    }

    private void ValidateOnly(object model, string prefix)
    {
        ModelState.Clear();
        TryValidateModel(model, prefix);
    }

    private bool ModelStateValidFor(string formName)
    {
        if (ModelState.IsValid)
            return true;

        var errors = ModelState
            .SelectMany(entry => entry.Value?.Errors
                .Select(error => $"{entry.Key}: {error.ErrorMessage}")
                ?? Enumerable.Empty<string>());
        _logger.LogWarning("Validação do formulário {FormName} falhou: {ValidationErrors}", formName, string.Join("; ", errors));
        ModelState.AddModelError(string.Empty, "Confira os campos informados e tente novamente.");
        return false;
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
        public string? Descricao { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        [Range(1, int.MaxValue, ErrorMessage = "Valor inválido")]
        public int? TempoApresentacao { get; set; }
        [Required(ErrorMessage = "Campo obrigatório")]
        [DataType(DataType.Date)]
        public DateTime? DataApresentacao { get; set; }
    }

    public sealed class CadastroAula
    {
        [Required(ErrorMessage = "Selecione um curso")]
        public int? IdCurso { get; set; }

        [Required(ErrorMessage = "Campo obrigatório")]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Campo obrigatório")]
        [DataType(DataType.DateTime)]
        public DateTime? DataAula { get; set; }
    }

    public sealed record CursoComAulas(Cursos Curso, IReadOnlyList<Aulas> Aulas);
}
