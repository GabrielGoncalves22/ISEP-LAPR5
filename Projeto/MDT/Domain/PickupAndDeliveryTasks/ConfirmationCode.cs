using MDT.Domain.Shared;

namespace MDT.Domain.PickupAndDeliveryTasks {
    public class ConfirmationCode : IValueObject
    {
        private const int MIN_CHARS = 4;
        private const int MAX_CHARS = 6;

        public string Code { get; }

        public ConfirmationCode(string Code)
        {
            bool result = Guard.ValidString(Code, MIN_CHARS, MAX_CHARS);
            if (!result) {
                throw new Exception("The inserted code is invalid. It must have from 4 up to 6 digits.");
            }

            this.Code = Code;
        }

    }
}
