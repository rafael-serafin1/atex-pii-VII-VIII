namespace backend.model
{
    public record RegistroPresencaAluno(
        string Nome,
        string Sobrenome,
        string Email,
        bool Presente,
        string? Observacoes);
}
