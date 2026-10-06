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
    }
}