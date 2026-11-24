using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class MatriculaRepository
    {
        private readonly Connection _connection;

        public MatriculaRepository(Connection connection)
        {
            _connection = connection;
        }

        public void CreateMatricula(Matriculas matricula)
        {
            using var conn = _connection.GetConnection();
            var query = "INSERT INTO matriculas(id_aluno, id_curso, data_matricula) VALUES (@IdAluno, @IdCurso, @DataMatricula)";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@IdAluno", matricula.IdAluno);
            cmd.Parameters.AddWithValue("@IdCurso", matricula.IdCurso);
            cmd.Parameters.AddWithValue("@DataMatricula", matricula.DataMatricula);
            cmd.ExecuteNonQuery();
        }

        public List<Alunos> GetAlunosByAulaId(int idAula)
        {
            var alunos = new List<Alunos>();
            using var conn = _connection.GetConnection();
            const string query = """
                SELECT a.id_aluno, a.nome, a.sobrenome, a.telefone, a.email, a.data_cadastro
                FROM dbo.alunos AS a
                INNER JOIN dbo.matriculas AS m ON m.id_aluno = a.id_aluno
                INNER JOIN dbo.aulas AS au ON au.id_curso = m.id_curso
                WHERE au.id_aula = @IdAula
                  AND NOT EXISTS
                  (
                      SELECT 1
                      FROM dbo.presencas AS p
                      WHERE p.id_aula = au.id_aula
                        AND p.id_aluno = a.id_aluno
                  )
                ORDER BY a.nome, a.sobrenome
                """;

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@IdAula", idAula);

            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                alunos.Add(new Alunos(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.GetString(2),
                    reader.IsDBNull(3) ? null : reader.GetString(3),
                    reader.GetString(4),
                    reader.GetDateTime(5)));
            }

            return alunos;
        }

        public void DeleteMatricula(int id)
        {
            using var conn = _connection.GetConnection();
            var query = "DELETE FROM matriculas WHERE id_matricula = @Id";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }
    }
}