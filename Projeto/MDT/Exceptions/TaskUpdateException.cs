namespace MDT.Exceptions
{
    public class TaskUpdateException(string taskId) : Exception($"Failed to update task status with id {taskId}!")
    {
    }
}
