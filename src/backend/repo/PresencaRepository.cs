using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class PresencaRepository
    {
        private readonly Connection _connection;

        public PresencaRepository(Connection connection)
        {
            _connection = connection;
        }

        public void CreatePresenca(Presencas presenca)
        {
            using var conn = _connection.GetConnection();
            var query = "INSERT INTO presencas(id_aluno, id_aula, presente, observacoes, data_registro) VALUES (@IdAluno, @IdAula, @Presente, @Observacoes, @DataRegistro)";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@IdAluno", presenca.IdAluno);
            cmd.Parameters.AddWithValue("@IdAula", presenca.IdAula);
            cmd.Parameters.AddWithValue("@Presente", presenca.Presente);
            cmd.Parameters.AddWithValue("@Observacoes", presenca.Observacoes);
            cmd.Parameters.AddWithValue("@DataRegistro", presenca.DataRegistro);
            cmd.ExecuteNonQuery();
        }

        public void SavePresencas(int idAula, IEnumerable<Presencas> presencas)
        {
            using var conn = _connection.GetConnection();
            using var transaction = conn.BeginTransaction();

            try
            {
                const string updateQuery = """
                    UPDATE presencas
                    SET presente = @Presente, observacoes = @Observacoes, data_registro = @DataRegistro
                    WHERE id_aluno = @IdAluno AND id_aula = @IdAula
                    """;
                const string insertQuery = """
                    INSERT INTO presencas(id_aluno, id_aula, presente, observacoes, data_registro)
                    VALUES (@IdAluno, @IdAula, @Presente, @Observacoes, @DataRegistro)
                    """;

                foreach (var presenca in presencas)
                {
                    using var update = new SqlCommand(updateQuery, conn, transaction);
                    AddParameters(update, presenca);
                    if (update.ExecuteNonQuery() != 0)
                        continue;

                    using var insert = new SqlCommand(insertQuery, conn, transaction);
                    AddParameters(insert, presenca);
                    insert.ExecuteNonQuery();
                }

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        private static void AddParameters(SqlCommand command, Presencas presenca)
        {
            command.Parameters.AddWithValue("@IdAluno", presenca.IdAluno);
            command.Parameters.AddWithValue("@IdAula", presenca.IdAula);
            command.Parameters.AddWithValue("@Presente", presenca.Presente);
            command.Parameters.AddWithValue("@Observacoes", presenca.Observacoes);
            command.Parameters.AddWithValue("@DataRegistro", presenca.DataRegistro);
        }

        public void DeletePresenca(int id)
        {
            using var conn = _connection.GetConnection();
            var query = "DELETE FROM presencas WHERE id_presenca = @Id";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }
    }
}