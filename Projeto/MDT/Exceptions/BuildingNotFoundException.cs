namespace MDT.Exceptions
{
    public class BuildingNotFoundException(string buildingCode) : Exception($"Building with code '{buildingCode}' not found!")
    {
    }
}