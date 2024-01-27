using MDT.Domain.Shared;

namespace MDT.Domain.SharedValueObjects;

public class DateTimeCreation : IValueObject
{

    public DateTime DateTimeInformation { get; }

    private string Format = "dd/MM/yyyy HH:mm:ss";

    public DateTimeCreation()
    {
        this.DateTimeInformation = DateTime.Now;
    }

    public DateTimeCreation(DateTime DateTime)
    {
        this.DateTimeInformation = DateTime;
    }

    public DateTimeCreation(string DateTimeInformation)
    {
        if (string.IsNullOrEmpty(DateTimeInformation))
            throw new Exception("The date time information cannot be empty!");

        try
        {
            this.DateTimeInformation = DateTime.ParseExact(DateTimeInformation, Format, null);
        }
        catch (FormatException)
        {
            throw new Exception("The format of date time should be " + Format + "!");
        }
    }

    public DateTime GetValue()
    {
        return DateTimeInformation;
    }

    public override string ToString()
    {
        return DateTimeInformation.ToString(Format);
    }

}