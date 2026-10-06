namespace backend.model
{
    public record Presencas(int Id, int IdAluno, int IdAula, bool Presente, string Observacoes, DateTime DataRegistro);
}