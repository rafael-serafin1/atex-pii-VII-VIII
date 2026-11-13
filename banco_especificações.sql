CREATE OR ALTER VIEW vw_AlunosPorCurso AS
SELECT
    c.id_curso,
    c.nome AS curso,
    a.id_aluno,
    a.nome,
    a.sobrenome,
    m.data_matricula
FROM cursos c
INNER JOIN matriculas m
    ON c.id_curso = m.id_curso
INNER JOIN alunos a
    ON m.id_aluno = a.id_aluno;
GO

CREATE OR ALTER VIEW vw_PresencasRegistradas AS
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
FROM presencas p
INNER JOIN aulas au
    ON p.id_aula = au.id_aula
INNER JOIN cursos c
    ON au.id_curso = c.id_curso
INNER JOIN alunos a
    ON p.id_aluno = a.id_aluno;
GO

CREATE OR ALTER PROCEDURE sp_ListarAulasPorCurso
    @id_curso INT
AS
BEGIN
    SELECT
        id_aula,
        id_curso,
        titulo,
        data_aula
    FROM aulas
    WHERE id_curso = @id_curso
    ORDER BY data_aula;
END;
GO

CREATE OR ALTER PROCEDURE sp_MarcarFalta
    @id_aula INT,
    @id_aluno INT,
    @observacoes VARCHAR(255) = NULL
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM presencas
        WHERE id_aula = @id_aula
          AND id_aluno = @id_aluno
    )
    BEGIN
        UPDATE presencas
        SET
            presente = 0,
            observacoes = COALESCE(@observacoes, observacoes),
            data_registro = GETDATE()
        WHERE id_aula = @id_aula
          AND id_aluno = @id_aluno;
    END
    ELSE
    BEGIN
        INSERT INTO presencas (
            id_aula,
            id_aluno,
            presente,
            observacoes,
            data_registro
        )
        VALUES (
            @id_aula,
            @id_aluno,
            0,
            @observacoes,
            GETDATE()
        );
    END
END;
GO

CREATE OR ALTER FUNCTION fn_ContarPresencasAluno
(
    @id_aluno INT
)
RETURNS INT
AS
BEGIN
    DECLARE @total INT;

    SELECT
        @total = COUNT(DISTINCT id_aula)
    FROM presencas
    WHERE id_aluno = @id_aluno
      AND presente = 1;

    RETURN ISNULL(@total, 0);
END;
GO

CREATE OR ALTER FUNCTION fn_PercentualFrequencia
(
    @id_aluno INT,
    @id_curso INT
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @total_aulas INT;
    DECLARE @total_presencas INT;

    SELECT
        @total_aulas = COUNT(*)
    FROM aulas
    WHERE id_curso = @id_curso;

    SELECT
        @total_presencas = COUNT(DISTINCT p.id_aula)
    FROM presencas p
    INNER JOIN aulas au
        ON p.id_aula = au.id_aula
    WHERE p.id_aluno = @id_aluno
      AND au.id_curso = @id_curso
      AND p.presente = 1;

    IF @total_aulas = 0
        RETURN 0;

    RETURN CAST(
        (@total_presencas * 100.0) / @total_aulas
        AS DECIMAL(5,2)
    );
END;
GO

CREATE OR ALTER TRIGGER trg_VerificarMatriculaPresenca
ON presencas
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN aulas au
            ON i.id_aula = au.id_aula
        WHERE NOT EXISTS (
            SELECT 1
            FROM matriculas m
            WHERE m.id_aluno = i.id_aluno
              AND m.id_curso = au.id_curso
        )
    )
    BEGIN
        THROW 50001,
        'Erro: O aluno nao possui matricula neste curso.',
        1;
    END
END;
GO

CREATE OR ALTER TRIGGER trg_ImpedirMatriculaDuplicada
ON matriculas
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM matriculas m
        INNER JOIN inserted i
            ON m.id_aluno = i.id_aluno
           AND m.id_curso = i.id_curso
           AND m.id_matricula <> i.id_matricula
    )
    BEGIN
        THROW 50002,
        'Erro: O aluno ja esta matriculado neste curso.',
        1;
    END
END;
GO