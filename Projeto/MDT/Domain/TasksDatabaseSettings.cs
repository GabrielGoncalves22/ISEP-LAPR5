namespace MDT.Domain;

public class TasksDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string SurveillanceTasksCollectionName { get; set; } = null!;
    public string PickupAndDeliveryTasksCollectionName { get; set; } = null!;

}