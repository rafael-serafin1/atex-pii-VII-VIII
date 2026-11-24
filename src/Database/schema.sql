SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

IF OBJECT_ID(N'dbo.alunos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.alunos
    (
        id_aluno INT IDENTITY(1,1) NOT NULL,
        nome NVARCHAR(50) NOT NULL,
        sobrenome NVARCHAR(50) NOT NULL,
        telefone VARCHAR(20) NULL,
        email VARCHAR(150) NOT NULL,
        data_cadastro DATETIME NOT NULL CONSTRAINT df_alunos_data_cadastro DEFAULT (GETDATE()),
        CONSTRAINT pk_alunos PRIMARY KEY (id_aluno),
        CONSTRAINT uq_alunos_email UNIQUE (email)
    );
END;
GO

IF OBJECT_ID(N'dbo.cursos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.cursos
    (
        id_curso INT IDENTITY(1,1) NOT NULL,
        nome VARCHAR(150) NOT NULL,
        descricao VARCHAR(150) NULL,
        data_apresentacao DATETIME NOT NULL,
        tempo_apresentacao INT NOT NULL,
        CONSTRAINT pk_cursos PRIMARY KEY (id_curso),
        CONSTRAINT ck_cursos_tempo_apresentacao CHECK (tempo_apresentacao > 0)
    );
END;
GO

IF OBJECT_ID(N'dbo.matriculas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.matriculas
    (
        id_matricula INT IDENTITY(1,1) NOT NULL,
        id_aluno INT NOT NULL,
        id_curso INT NOT NULL,
        data_matricula DATE NOT NULL CONSTRAINT df_matriculas_data_matricula DEFAULT (CAST(GETDATE() AS DATE)),
        CONSTRAINT pk_matriculas PRIMARY KEY (id_matricula),
        CONSTRAINT uq_matriculas_aluno_curso UNIQUE (id_aluno, id_curso),
        CONSTRAINT fk_matriculas_alunos FOREIGN KEY (id_aluno)
            REFERENCES dbo.alunos(id_aluno) ON DELETE CASCADE,
        CONSTRAINT fk_matriculas_cursos FOREIGN KEY (id_curso)
            REFERENCES dbo.cursos(id_curso) ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.aulas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.aulas
    (
        id_aula INT IDENTITY(1,1) NOT NULL,
        id_curso INT NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        data_aula DATETIME NOT NULL,
        CONSTRAINT pk_aulas PRIMARY KEY (id_aula),
        CONSTRAINT fk_aulas_cursos FOREIGN KEY (id_curso)
            REFERENCES dbo.cursos(id_curso) ON DELETE CASCADE
    );
END;
GO

IF OBJECT_ID(N'dbo.presencas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.presencas
    (
        id_presenca INT IDENTITY(1,1) NOT NULL,
        id_aula INT NOT NULL,
        id_aluno INT NOT NULL,
        presente BIT NOT NULL CONSTRAINT df_presencas_presente DEFAULT (0),
        observacoes NVARCHAR(150) NULL,
        data_registro DATETIME NOT NULL CONSTRAINT df_presencas_data_registro DEFAULT (GETDATE()),
        CONSTRAINT pk_presencas PRIMARY KEY (id_presenca),
        CONSTRAINT uq_presencas_aula_aluno UNIQUE (id_aula, id_aluno),
        CONSTRAINT fk_presencas_aulas FOREIGN KEY (id_aula)
            REFERENCES dbo.aulas(id_aula) ON DELETE CASCADE,
        CONSTRAINT fk_presencas_alunos FOREIGN KEY (id_aluno)
            REFERENCES dbo.alunos(id_aluno) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.matriculas')
      AND name = N'ix_matriculas_id_curso'
)
    CREATE INDEX ix_matriculas_id_curso
        ON dbo.matriculas(id_curso);
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.aulas')
      AND name = N'ix_aulas_id_curso_data'
)
    CREATE INDEX ix_aulas_id_curso_data
        ON dbo.aulas(id_curso, data_aula);
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.presencas')
      AND name = N'ix_presencas_id_aluno_aula'
)
    CREATE INDEX ix_presencas_id_aluno_aula
        ON dbo.presencas(id_aluno, id_aula)
        INCLUDE (presente);
GO

CREATE OR ALTER VIEW dbo.vw_AlunosPorCurso AS
SELECT
    c.id_curso,
    c.nome AS curso,
    a.id_aluno,
    a.nome,
    a.sobrenome,
    m.data_matricula
FROM dbo.cursos AS c
INNER JOIN dbo.matriculas AS m
    ON c.id_curso = m.id_curso
INNER JOIN dbo.alunos AS a
    ON m.id_aluno = a.id_aluno;
GO

CREATE OR ALTER VIEW dbo.vw_PresencasRegistradas AS
SELECT
    p.id_presenca,
    c.nome AS curso,
    au.id_aula,
    au.titulo AS aula,
    a.id_aluno,
    a.nome,
    a.sobrenome,
    p.presente,
    p.observacoes,
    p.data_registro
FROM dbo.presencas AS p
INNER JOIN dbo.aulas AS au
    ON p.id_aula = au.id_aula
INNER JOIN dbo.cursos AS c
    ON au.id_curso = c.id_curso
INNER JOIN dbo.alunos AS a
    ON p.id_aluno = a.id_aluno;
GO

CREATE OR ALTER PROCEDURE dbo.sp_ListarAulasPorCurso
    @id_curso INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id_aula,
        id_curso,
        titulo,
        data_aula
    FROM dbo.aulas
    WHERE id_curso = @id_curso
    ORDER BY data_aula, id_aula;
END;
GO

CREATE OR ALTER PROCEDURE dbo.sp_MarcarFalta
    @id_aula INT,
    @id_aluno INT,
    @observacoes NVARCHAR(150) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM dbo.aulas AS au
        INNER JOIN dbo.matriculas AS m
            ON m.id_curso = au.id_curso
        WHERE au.id_aula = @id_aula
          AND m.id_aluno = @id_aluno
    )
    BEGIN
        THROW 50003, 'Erro: O aluno nao possui matricula neste curso.', 1;
    END;

    UPDATE dbo.presencas
    SET
        presente = 0,
        observacoes = @observacoes,
        data_registro = GETDATE()
    WHERE id_aula = @id_aula
      AND id_aluno = @id_aluno;

    IF @@ROWCOUNT = 0
    BEGIN
        INSERT INTO dbo.presencas
        (
            id_aula,
            id_aluno,
            presente,
            observacoes,
            data_registro
        )
        VALUES
        (
            @id_aula,
            @id_aluno,
            0,
            @observacoes,
            GETDATE()
        );
    END;
END;
GO

CREATE OR ALTER FUNCTION dbo.fn_ContarPresencasAluno
(
    @id_aluno INT
)
RETURNS INT
AS
BEGIN
    DECLARE @total INT;

    SELECT @total = COUNT(DISTINCT id_aula)
    FROM dbo.presencas
    WHERE id_aluno = @id_aluno
      AND presente = 1;

    RETURN ISNULL(@total, 0);
END;
GO

CREATE OR ALTER FUNCTION dbo.fn_PercentualFrequencia
(
    @id_aluno INT,
    @id_curso INT
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @total_aulas INT;
    DECLARE @total_presencas INT;

    SELECT @total_aulas = COUNT(*)
    FROM dbo.aulas
    WHERE id_curso = @id_curso;

    IF @total_aulas = 0
        RETURN CAST(0 AS DECIMAL(5,2));

    SELECT @total_presencas = COUNT(DISTINCT p.id_aula)
    FROM dbo.presencas AS p
    INNER JOIN dbo.aulas AS au
        ON p.id_aula = au.id_aula
    WHERE p.id_aluno = @id_aluno
      AND au.id_curso = @id_curso
      AND p.presente = 1;

    RETURN CAST(
        (ISNULL(@total_presencas, 0) * 100.0) / @total_aulas
        AS DECIMAL(5,2)
    );
END;
GO

CREATE OR ALTER TRIGGER dbo.trg_VerificarMatriculaPresenca
ON dbo.presencas
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM inserted AS i
        INNER JOIN dbo.aulas AS au
            ON i.id_aula = au.id_aula
        WHERE i.data_registro < au.data_aula
    )
    BEGIN
        THROW 50004, N'Erro: O horário de registro da presença não pode ser anterior ao horário da aula.', 1;
    END;

    IF EXISTS
    (
        SELECT 1
        FROM inserted AS i
        INNER JOIN dbo.aulas AS au
            ON i.id_aula = au.id_aula
        WHERE NOT EXISTS
        (
            SELECT 1
            FROM dbo.matriculas AS m
            WHERE m.id_aluno = i.id_aluno
              AND m.id_curso = au.id_curso
        )
    )
    BEGIN
        THROW 50001, 'Erro: O aluno nao possui matricula neste curso.', 1;
    END;
END;
GO
