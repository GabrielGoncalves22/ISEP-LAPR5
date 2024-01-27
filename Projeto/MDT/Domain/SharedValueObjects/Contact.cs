using MDT.Domain.Shared;

namespace MDT.Domain.SharedValueObjects;

public class Contact : IValueObject
{

    public string phoneNumber { get; }

    private Contact() {}

    public Contact(string phoneNumber)
    {
        if (string.IsNullOrEmpty(phoneNumber))
            throw new Exception("The phone number cannot be empty!");

        bool result = Guard.ValidPhoneNumber(phoneNumber);
        if (!result) {
            throw new Exception("The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)");
        }

        this.phoneNumber = phoneNumber;
    }

}