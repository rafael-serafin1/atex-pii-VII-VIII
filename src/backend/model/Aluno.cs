namespace backend.model
{
    public record Alunos(int Id, string Nome, string Sobrenome, string? Telefone, string Email, DateTime DataCadastro);
}