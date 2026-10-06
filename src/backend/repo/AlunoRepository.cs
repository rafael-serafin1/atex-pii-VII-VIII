using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class AlunoRepository
    {
        private readonly Connection _connection;

        public AlunoRepository(Connection connection)
        {
            _connection = connection;
        }

        public void CreateAluno(Alunos aluno)
        {
            using var conn = _connection.GetConnection();
            var query = "INSERT INTO alunos(nome, sobrenome, telefone, email, data_cadastro) VALUES (@Nome, @Sobrenome, @Telefone, @Email, @DataCadastro)";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Nome", aluno.Nome);
            cmd.Parameters.AddWithValue("@Sobrenome", aluno.Sobrenome);
            cmd.Parameters.AddWithValue("@Telefone", (object?)aluno.Telefone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", aluno.Email);
            cmd.Parameters.AddWithValue("@DataCadastro", aluno.DataCadastro);
            cmd.ExecuteNonQuery();
        }

        public void DeleteAluno(int id)
        {
            using var conn = _connection.GetConnection();
            var query = "DELETE FROM alunos WHERE id_aluno = @Id";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }

        public List<Alunos> GetAllAlunos()
        {
            var alunos = new List<Alunos>();
            using var conn = _connection.GetConnection();
            const string query = "SELECT id_aluno, nome, sobrenome, telefone, email, data_cadastro FROM alunos ORDER BY nome, sobrenome";

            using var cmd = new SqlCommand(query, conn);
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
    }
}