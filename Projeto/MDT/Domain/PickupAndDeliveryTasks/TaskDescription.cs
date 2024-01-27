using MDT.Domain.Shared;

namespace MDT.Domain.PickupAndDeliveryTasks {
    public class TaskDescription : IValueObject
    {
        private const int MAX_VALUE = 1000;

        public string Description { get; }

        public TaskDescription(string Description)
        {
            bool result = Guard.ValidString(Description, MAX_VALUE);
            if (!result) {
                throw new Exception($"Invalid length of description. It can have at most {MAX_VALUE} chars.");
            }

            this.Description = Description;
        }

    }
}
