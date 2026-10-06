using Microsoft.Data.SqlClient;

namespace backend.config;

public class Connection
{
    private string connection_string = "Server=.\\SQLEXPRESS;Database=atexpiiVIIVIII;User Id=sa;Password=123;TrustServerCertificate=True;";
    
    public SqlConnection GetConnection()
    {
        var conn =  new SqlConnection(connection_string);
        conn.Open();
        return conn;
    }
}
