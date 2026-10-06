using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class CursoRepository
    {
        private readonly Connection _connection;

        public CursoRepository(Connection connection)
        {
            _connection = connection;
        }

        public void CreateCurso(Cursos curso)
        {
            using var conn = _connection.GetConnection();
            var query = "INSERT INTO cursos(nome, descricao, data_apresentacao, tempo_apresentacao) VALUES (@Nome, @Descricao, @DataApresentacao, @TempoApresentacao)";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Nome", curso.Nome);
            cmd.Parameters.AddWithValue("@Descricao", (object?)curso.Descricao ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DataApresentacao", curso.DataApresentacao);
            cmd.Parameters.AddWithValue("@TempoApresentacao", curso.TempoApresentacao);
            cmd.ExecuteNonQuery();
        }

        public void DeleteCurso(int id)
        {
            using var conn = _connection.GetConnection();
            var query = "DELETE FROM cursos WHERE id_curso = @Id";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }

        public List<Cursos> GetAllCursos()
        {
            var cursos = new List<Cursos>();
            using var conn = _connection.GetConnection();
            var query = "SELECT id_curso, nome, descricao, data_apresentacao, tempo_apresentacao FROM cursos";
            
            using var cmd = new SqlCommand(query, conn);
            
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                cursos.Add(new Cursos(
                    reader.GetInt32(0),
                    reader.GetString(1),
                    reader.IsDBNull(2) ? null : reader.GetString(2),
                    reader.GetDateTime(3),
                    reader.GetInt32(4)));
            }
            
            return cursos;
        }
    }
}