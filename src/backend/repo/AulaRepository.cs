using Microsoft.Data.SqlClient;

using backend.config;
using backend.model;

namespace backend.repo
{
    public class AulaRepository
    {
        public Connection _connection = new Connection();

        public void CreateAula(Aulas aula)
        {
            using var conn = _connection.GetConnection();
            var query = "INSERT INTO aulas(id_curso, titulo, data_aula) VALUES (@IdCurso, @Titulo, @DataAula)";

            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@IdCurso", aula.IdCurso);
            cmd.Parameters.AddWithValue("@Titulo", aula.Titulo);
            cmd.Parameters.AddWithValue("@DataAula", aula.DataAula);
            cmd.ExecuteNonQuery();
        }

        public void DeleteAula(int id)
        {
            using var conn = _connection.GetConnection();
            var query = "DELETE FROM aulas WHERE id_aula = @Id";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Id", id);
            cmd.ExecuteNonQuery();
        }

        public List<Aulas> GetAulasByCursoId(int idCurso)
        {
            var aulas = new List<Aulas>();
            using var conn = _connection.GetConnection();
            var query = "SELECT id_aula, id_curso, titulo, data_aula FROM aulas WHERE id_curso = @IdCurso";
            
            using var cmd = new SqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@IdCurso", idCurso);
            
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                aulas.Add(new Aulas(
                    reader.GetInt32(0),
                    reader.GetInt32(1),
                    reader.GetString(2),
                    reader.GetDateTime(3)));
            }
            
            return aulas;
        }

        public List<Aulas> GetAllAulas()
        {
            var aulas = new List<Aulas>();
            using var conn = _connection.GetConnection();
            var query = "SELECT id_aula, id_curso, titulo, data_aula FROM aulas";

            using var cmd = new SqlCommand(query, conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                aulas.Add(new Aulas(
                    reader.GetInt32(0),
                    reader.GetInt32(1),
                    reader.GetString(2),
                    reader.GetDateTime(3)));
            }

            return aulas;
        }
    }
}