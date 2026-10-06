using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class PresencaRepository
    {
        public Connection _connection = new Connection();

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