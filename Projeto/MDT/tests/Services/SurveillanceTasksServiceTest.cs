using Xunit;
using Moq;
using MDT.DTO;
using MDT.Services.SurveillanceTasks;
using MDT.Persistence.Schema;
using MongoDB.Driver;
using MDT.Services;
using MDT.Exceptions;
using MDT.Domain.SharedValueObjects;
using MDT.Mappers;

public class SurveillanceTasksServiceTest
{

    private List<SurveillanceTaskSchema> SurveillanceTaskData()
    {
        return new List<SurveillanceTaskSchema>
        {
            new SurveillanceTaskSchema
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user"
            },
            new SurveillanceTaskSchema
            {
                Id = "2",
                BuildingCode = "B",
                EmergencyContactName = "Ana Silva",
                EmergencyContactPhoneNumber = "933333333",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [4, 5, 6],
                CreatedByUser = "user"
            }
        };
    }

    /*
    [Fact]
    public async Task GetSurveillanceTasks_ReturnsListOfTasks()
    {
        // Arrange
        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();
        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        var surveillanceTasksData = SurveillanceTaskData();
        var expectedTaskDTOs = surveillanceTasksData
            .Select(surveillanceTask => SurveillanceTaskMap.ToDTO(SurveillanceTaskMap.ToDomain(surveillanceTask)))
            .ToList();

        mockCollection.Setup(collection => collection.Find(It.IsAny<FilterDefinition<SurveillanceTaskSchema>>()).ToListAsync(It.IsAny<CancellationToken>()))
                      .ReturnsAsync(surveillanceTasksData);

        // Act
        var result = await thisService.GetSurveillanceTasks();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedTaskDTOs.Count, result.Count);
        for (int i = 0; i < expectedTaskDTOs.Count; i++)
        {
            Assert.Equal(expectedTaskDTOs[i].Id, result[i].Id);
        }
    }
    */

    [Fact]
    public async Task CreateSurveillanceTask_InvalidSurveillanceTask_ResultOnBuildingNotFoundException()
    {
        string buildingCode = "Não existe";
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO
        {
            BuildingCode = buildingCode,
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([1, 2, 3])
        };

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();
        mdApiServiceMock.Setup(service => service.CheckIfBuildingExists(It.IsAny<string>())).ReturnsAsync(false);

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        var exception = await Assert.ThrowsAsync<BuildingNotFoundException>(() => thisService.CreateSurveillanceTask(createSurveillanceTaskDTO, "test@testmail.com"));

        // Verificar o texto da exceção
        Assert.Equal($"Building with code '{buildingCode}' not found!", exception.Message);

    }

    [Fact]
    public async Task CreateSurveillanceTask_InvalidSurveillanceTask_ResultOnFloorNotFoundInBuildingException()
    {
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO
        {
            BuildingCode = "E",
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([-1000, 1, 2, 3])
        };

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();
        mdApiServiceMock.Setup(service => service.CheckIfBuildingExists(It.IsAny<string>())).ReturnsAsync(true);
        mdApiServiceMock.Setup(service => service.CheckIfFloorsExistsInBuilding(It.IsAny<string>(), It.IsAny<List<int>>())).ReturnsAsync((false, $"The floor {createSurveillanceTaskDTO.SurveillanceTaskFloors[0]} doesn't exists in the building with code {createSurveillanceTaskDTO.BuildingCode}!"));

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        var exception = await Assert.ThrowsAsync<FloorNotFoundInBuildingException>(() => thisService.CreateSurveillanceTask(createSurveillanceTaskDTO, "test@testmail.com"));

        // Verificar o texto da exceção
        Assert.Equal($"The floor {createSurveillanceTaskDTO.SurveillanceTaskFloors[0]} doesn't exists in the building with code {createSurveillanceTaskDTO.BuildingCode}!", exception.Message);

    }

    [Fact]
    public async Task CreateSurveillanceTask_ValidSurveillanceTask_ResultOnSuccessfulInsertion()
    {
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO
        {
            BuildingCode = "E",
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([-1000, 1, 2, 3])
        };

        // DateTime de agora, e subtrai um segundo
        DateTime actualDateTime = DateTime.Now.AddSeconds(-1);

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();
        mdApiServiceMock.Setup(service => service.CheckIfBuildingExists(It.IsAny<string>())).ReturnsAsync(true);
        mdApiServiceMock.Setup(service => service.CheckIfFloorsExistsInBuilding(It.IsAny<string>(), It.IsAny<List<int>>())).ReturnsAsync((true, $"All the floors specified exists in the building with code {createSurveillanceTaskDTO.BuildingCode}."));

        mockCollection.Setup(collection => collection.InsertOneAsync(It.IsAny<SurveillanceTaskSchema>(), It.IsAny<InsertOneOptions>(), It.IsAny<CancellationToken>()));

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        SurveillanceTaskDTO result = await thisService.CreateSurveillanceTask(createSurveillanceTaskDTO, "test@testmail.com");

        // Assert
        Assert.Equal(createSurveillanceTaskDTO.BuildingCode, result.BuildingCode);
        Assert.Equal(createSurveillanceTaskDTO.EmergencyContactName, result.EmergencyContactName);
        Assert.Equal(createSurveillanceTaskDTO.EmergencyContactPhoneNumber, result.EmergencyContactPhoneNumber);
        Assert.Equal(RobotTaskStatus.Requested.ToString(), result.RobotTaskStatus);
        Assert.Equal(createSurveillanceTaskDTO.SurveillanceTaskFloors.Count, result.SurveillanceTaskFloors.Count);
        for (int i = 0; i < result.SurveillanceTaskFloors.Count; i++)
        {
            Assert.Equal(createSurveillanceTaskDTO.SurveillanceTaskFloors[i], result.SurveillanceTaskFloors[i]);
        }
        Assert.Equal("test@testmail.com", result.CreatedByUser);
        Assert.Equal(createSurveillanceTaskDTO.SurveillanceTaskFloors.Count, result.SurveillanceTaskFloors.Count);
        Assert.InRange(DateTime.ParseExact(result.CreatedDate, "dd/MM/yyyy HH:mm:ss", null), actualDateTime, DateTime.Now);
    }

    [Fact]
    public async Task ApproveSurveillanceTask_ValidTaskId_TaskApprovedSuccessfully()
    {
        // Arrange
        string taskId = "6592e8c64b78c296c0b6adbe";

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(1, 1, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        await thisService.ApproveSurveillanceTask(taskId);

        // Assert
        mockCollection.Verify(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }

    [Fact]
    public async Task RejectSurveillanceTask_ValidTaskId_TaskRejectedSuccessfully()
    {
        // Arrange
        string taskId = "6592e8cb4b78c296c0b6adbf";

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(1, 1, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        await thisService.RejectSurveillanceTask(taskId);

        // Assert
        mockCollection.Verify(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }

    [Fact]
    public async Task ApproveSurveillanceTask_InvalidTaskId_TaskNotFoundExceptionThrown()
    {
        // Arrange
        string taskId = "1";

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(0, 0, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        await Assert.ThrowsAsync<TaskNotFoundException>(() => thisService.ApproveSurveillanceTask(taskId));
    }

    [Fact]
    public async Task RejectSurveillanceTask_InvalidTaskId_TaskNotFoundExceptionThrown()
    {
        // Arrange
        string taskId = "1";

        var mockCollection = new Mock<IMongoCollection<SurveillanceTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateDefinition<SurveillanceTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(0, 0, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new SurveillanceTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        await Assert.ThrowsAsync<TaskNotFoundException>(() => thisService.RejectSurveillanceTask(taskId));
    }

}
