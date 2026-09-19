namespace backend.Pages.Utils;

public class Message
{
    public enum EMessageType 
    {
        LOG,
        DEBUG,
        INFO,
        WARN,
        ERROR,
    }

    public static void Send(string _Message, EMessageType _Type = EMessageType.LOG)
    {
        ConsoleColor color = ConsoleColor.White;

        switch (_Type)
        {
            case EMessageType.LOG:
                color = ConsoleColor.White;
                break;

            case EMessageType.DEBUG:
                color = ConsoleColor.DarkGreen;
                break;

            case EMessageType.INFO:
                color = ConsoleColor.Cyan;
                break;

            case EMessageType.WARN:
                color = ConsoleColor.DarkYellow;
                break;

            case EMessageType.ERROR:
                color = ConsoleColor.DarkRed;
                break;
        }

        Console.ForegroundColor = color;
        Console.WriteLine(_Message);
        Console.ResetColor();
    }
}