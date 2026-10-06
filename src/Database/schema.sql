IF OBJECT_ID(N'dbo.alunos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.alunos
    (
        id_aluno INT PRIMARY KEY IDENTITY(1,1),
        nome NVARCHAR(50) NOT NULL,
        sobrenome NVARCHAR(50) NOT NULL,
        telefone VARCHAR(20) NULL,
        email VARCHAR(150) NOT NULL,
        data_cadastro DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT uq_alunos_email UNIQUE (email)
    );
END;

IF OBJECT_ID(N'dbo.cursos', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.cursos
    (
        id_curso INT PRIMARY KEY IDENTITY(1,1),
        nome VARCHAR(150) NOT NULL,
        descricao VARCHAR(150) NULL,
        data_apresentacao DATETIME NOT NULL,
        tempo_apresentacao INT NOT NULL
    );
END;

IF OBJECT_ID(N'dbo.matriculas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.matriculas
    (
        id_matricula INT PRIMARY KEY IDENTITY(1,1),
        id_aluno INT NOT NULL,
        id_curso INT NOT NULL,
        data_matricula DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
        CONSTRAINT uq_matriculas_aluno_curso UNIQUE (id_aluno, id_curso),
        CONSTRAINT fk_matriculas_alunos FOREIGN KEY (id_aluno) REFERENCES dbo.alunos(id_aluno),
        CONSTRAINT fk_matriculas_cursos FOREIGN KEY (id_curso) REFERENCES dbo.cursos(id_curso)
    );
END;

IF OBJECT_ID(N'dbo.aulas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.aulas
    (
        id_aula INT PRIMARY KEY IDENTITY(1,1),
        id_curso INT NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        data_aula DATETIME NOT NULL,
        CONSTRAINT fk_aulas_cursos FOREIGN KEY (id_curso) REFERENCES dbo.cursos(id_curso)
    );
END;

IF OBJECT_ID(N'dbo.presencas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.presencas
    (
        id_presenca INT PRIMARY KEY IDENTITY(1,1),
        id_aula INT NOT NULL,
        id_aluno INT NOT NULL,
        presente BIT NOT NULL DEFAULT 0,
        observacoes NVARCHAR(150) NULL,
        data_registro DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT uq_presencas_aula_aluno UNIQUE (id_aula, id_aluno),
        CONSTRAINT fk_presencas_aulas FOREIGN KEY (id_aula) REFERENCES dbo.aulas(id_aula),
        CONSTRAINT fk_presencas_alunos FOREIGN KEY (id_aluno) REFERENCES dbo.alunos(id_aluno)
    );
END;

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name IN (N'ux_alunos_email', N'uq_alunos_email')
      AND object_id = OBJECT_ID(N'dbo.alunos')
)
BEGIN
    CREATE UNIQUE INDEX ux_alunos_email ON dbo.alunos(email);
END;

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name IN (N'ux_matriculas_aluno_curso', N'uq_matriculas_aluno_curso')
      AND object_id = OBJECT_ID(N'dbo.matriculas')
)
BEGIN
    CREATE UNIQUE INDEX ux_matriculas_aluno_curso
        ON dbo.matriculas(id_aluno, id_curso);
END;

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name IN (N'ux_presencas_aula_aluno', N'uq_presencas_aula_aluno')
      AND object_id = OBJECT_ID(N'dbo.presencas')
)
BEGIN
    CREATE UNIQUE INDEX ux_presencas_aula_aluno
        ON dbo.presencas(id_aula, id_aluno);
END;
