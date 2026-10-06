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