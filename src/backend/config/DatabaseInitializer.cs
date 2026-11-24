using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

namespace backend.config;

public sealed class DatabaseInitializer
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<DatabaseInitializer> _logger;

    public DatabaseInitializer(IConfiguration configuration, ILogger<DatabaseInitializer> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public void Initialize()
    {
        var configuredConnectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("A connection string 'DefaultConnection' não foi configurada.");
        var databaseConnection = new SqlConnectionStringBuilder(configuredConnectionString);

        if (string.IsNullOrWhiteSpace(databaseConnection.InitialCatalog))
            throw new InvalidOperationException("A connection string precisa informar o nome do banco em 'Database'.");

        var databaseName = databaseConnection.InitialCatalog;
        var masterConnection = new SqlConnectionStringBuilder(databaseConnection.ConnectionString)
        {
            InitialCatalog = "master"
        };

        using (var connection = new SqlConnection(masterConnection.ConnectionString))
        {
            connection.Open();
            using var command = connection.CreateCommand();
            command.CommandText = """
                IF DB_ID(@DatabaseName) IS NULL
                BEGIN
                    DECLARE @CreateDatabase nvarchar(500) =
                        N'CREATE DATABASE ' + QUOTENAME(@DatabaseName);
                    EXEC sys.sp_executesql @CreateDatabase;
                END
                """;
            command.Parameters.AddWithValue("@DatabaseName", databaseName);
            command.ExecuteNonQuery();
        }

        var schema = ReadSchemaScript();
        using var database = new SqlConnection(databaseConnection.ConnectionString);
        database.Open();
        var batches = Regex.Split(
            schema,
            @"^[\t ]*GO[\t ]*(?:--[^\r\n]*)?[\t \r]*$",
            RegexOptions.Multiline | RegexOptions.IgnoreCase);

        foreach (var batch in batches)
        {
            if (string.IsNullOrWhiteSpace(batch))
                continue;

            using var schemaCommand = new SqlCommand(batch, database);
            schemaCommand.ExecuteNonQuery();
        }

        string DatabaseName = "atexpiiVIIVIII";
        _logger.LogInformation($"Banco de dados {DatabaseName} verificado e schema aplicado.", databaseName);
    }

    private static string ReadSchemaScript()
    {
        var resourceName = typeof(DatabaseInitializer).Assembly
            .GetManifestResourceNames()
            .SingleOrDefault(name => name.EndsWith(".Database.schema.sql", StringComparison.OrdinalIgnoreCase))
            ?? throw new InvalidOperationException("O script de schema do banco não foi encontrado.");

        using var stream = typeof(DatabaseInitializer).Assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException("Não foi possível abrir o script de schema do banco.");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }
}
