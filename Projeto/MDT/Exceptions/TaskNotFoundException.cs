namespace MDT.Exceptions
{
    public class TaskNotFoundException(string taskId) : Exception($"Task with id {taskId} not found!")
    {
    }
}