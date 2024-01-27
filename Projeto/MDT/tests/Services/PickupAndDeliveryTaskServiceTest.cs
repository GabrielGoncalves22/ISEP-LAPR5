using Xunit;
using Moq;
using MDT.DTO;
using MDT.Persistence.Schema;
using MongoDB.Driver;
using MDT.Services;
using MDT.Services.PickupAndDeliveryTasks;
using MDT.Exceptions;
using MDT.Domain.SharedValueObjects;

public class PickupAndDeliveryTaskServiceTest
{

    [Fact]
    public async Task CreatePickupAndDeliveryTask_InvalidPickupRoomName_ResultOnRoomNotFoundInBuildingException()
    {

        // Arrange
        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO
        {
            PickupContactName = "Teste Pickup Contact Name",
            PickupContactPhoneNumber = "911222333",
            DeliveryContactName = "Teste Delivery Contact Name",
            DeliveryContactPhoneNumber = "922555999",
            TaskDescription = "Task description blá blá blá",
            ConfirmationCode = "C0D3x",
            PickupBuildingCode = "A",
            PickupRoomName = "Não existe",
            DeliveryBuildingCode = "E",
            DeliveryRoomName = "E201"
        };

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();
        mdApiServiceMock.Setup(service => service.CheckBuildingRoom(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((false, $"There is no data about a room with name '{createPickupAndDeliveryTaskDTO.PickupRoomName}' in a building with code '{createPickupAndDeliveryTaskDTO.PickupBuildingCode}'!"));

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        var exception = await Assert.ThrowsAsync<RoomNotFoundInBuildingException>(() => thisService.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO, "test@testmail.com"));

        // Verificar o texto da exceção
        Assert.Equal($"There is no data about a room with name '{createPickupAndDeliveryTaskDTO.PickupRoomName}' in a building with code '{createPickupAndDeliveryTaskDTO.PickupBuildingCode}'!", exception.Message);

    }

    [Fact]
    public async Task CreatePickupAndDeliveryTask_InvalidDeliveryRoomName_ResultOnRoomNotFoundInBuildingException()
    {

        // Arrange
        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO
        {
            PickupContactName = "Teste Pickup Contact Name",
            PickupContactPhoneNumber = "911222333",
            DeliveryContactName = "Teste Delivery Contact Name",
            DeliveryContactPhoneNumber = "922555999",
            TaskDescription = "Task description blá blá blá",
            ConfirmationCode = "C0D3x",
            PickupBuildingCode = "A",
            PickupRoomName = "A101",
            DeliveryBuildingCode = "E",
            DeliveryRoomName = "Não existe"
        };

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();
        mdApiServiceMock.Setup(service => service.CheckBuildingRoom(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((false, $"There is no data about a room with name '{createPickupAndDeliveryTaskDTO.DeliveryRoomName}' in a building with code '{createPickupAndDeliveryTaskDTO.DeliveryBuildingCode}'!"));

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        var exception = await Assert.ThrowsAsync<RoomNotFoundInBuildingException>(() => thisService.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO, "test@testmail.com"));

        // Verificar o texto da exceção
        Assert.Equal($"There is no data about a room with name '{createPickupAndDeliveryTaskDTO.DeliveryRoomName}' in a building with code '{createPickupAndDeliveryTaskDTO.DeliveryBuildingCode}'!", exception.Message);

    }

    [Fact]
    public async Task CreatePickupAndDeliveryTask_ValidPickupAndDeliveryTask_ResultOnSuccessfulInsertion()
    {
        // Arrange
        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO
        {
            PickupContactName = "Teste Pickup Contact Name",
            PickupContactPhoneNumber = "911222333",
            DeliveryContactName = "Teste Delivery Contact Name",
            DeliveryContactPhoneNumber = "922555999",
            TaskDescription = "Task description blá blá blá",
            ConfirmationCode = "C0D3x",
            PickupBuildingCode = "A",
            PickupRoomName = "A101",
            DeliveryBuildingCode = "E",
            DeliveryRoomName = "Não existe"
        };

        // DateTime de agora, e subtrai um segundo
        DateTime actualDateTime = DateTime.Now.AddSeconds(-1);

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();

        var mdApiServiceMock = new Mock<MDApiService>();

        mdApiServiceMock.Setup(service => service.CheckBuildingRoom(It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync((true, ""));

        mockCollection.Setup(collection => collection.InsertOneAsync(It.IsAny<PickupAndDeliveryTaskSchema>(), It.IsAny<InsertOneOptions>(), It.IsAny<CancellationToken>()));

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        PickupAndDeliveryTaskDTO result = await thisService.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO, "test@testmail.com");

        // Assert
        Assert.Equal(createPickupAndDeliveryTaskDTO.PickupContactName, result.PickupContactName);
        Assert.Equal(createPickupAndDeliveryTaskDTO.PickupContactPhoneNumber, result.PickupContactPhoneNumber);
        Assert.Equal(createPickupAndDeliveryTaskDTO.DeliveryContactName, result.DeliveryContactName);
        Assert.Equal(createPickupAndDeliveryTaskDTO.DeliveryContactPhoneNumber, result.DeliveryContactPhoneNumber);
        Assert.Equal(createPickupAndDeliveryTaskDTO.TaskDescription, result.TaskDescription);
        Assert.Equal(createPickupAndDeliveryTaskDTO.ConfirmationCode, result.ConfirmationCode);
        Assert.Equal(RobotTaskStatus.Requested.ToString(), result.RobotTaskStatus);
        Assert.Equal(createPickupAndDeliveryTaskDTO.PickupBuildingCode, result.PickupBuildingCode);
        Assert.Equal(createPickupAndDeliveryTaskDTO.PickupRoomName, result.PickupRoomName);
        Assert.Equal(createPickupAndDeliveryTaskDTO.DeliveryBuildingCode, result.DeliveryBuildingCode);
        Assert.Equal(createPickupAndDeliveryTaskDTO.DeliveryRoomName, result.DeliveryRoomName);
        Assert.Equal("test@testmail.com", result.CreatedByUser);
        Assert.Equal(createPickupAndDeliveryTaskDTO.PickupContactName, result.PickupContactName);
        Assert.InRange(DateTime.ParseExact(result.CreatedDate, "dd/MM/yyyy HH:mm:ss", null), actualDateTime, DateTime.Now);
    }

    [Fact]
    public async Task ApprovePickupAndDeliveryTask_ValidTaskId_TaskApprovedSuccessfully()
    {
        // Arrange
        string taskId = "6592e88a4b78c296c0b6adbd";

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(1, 1, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        await thisService.ApprovePickupAndDeliveryTask(taskId);

        // Assert
        mockCollection.Verify(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }

    [Fact]
    public async Task RejectPickupAndDeliveryTask_ValidTaskId_TaskRejectedSuccessfully()
    {
        // Arrange
        string taskId = "6592e8754b78c296c0b6adbc";

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(1, 1, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act
        await thisService.RejectPickupAndDeliveryTask(taskId);

        // Assert
        mockCollection.Verify(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ), Times.Once);
    }

    [Fact]
    public async Task ApprovePickupAndDeliveryTask_InvalidTaskId_TaskNotFoundExceptionThrown()
    {
        // Arrange
        string taskId = "1";

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(0, 0, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        await Assert.ThrowsAsync<TaskNotFoundException>(() => thisService.ApprovePickupAndDeliveryTask(taskId));
    }

    [Fact]
    public async Task RejectPickupAndDeliveryTask_InvalidTaskId_TaskNotFoundExceptionThrown()
    {
        // Arrange
        string taskId = "1";

        var mockCollection = new Mock<IMongoCollection<PickupAndDeliveryTaskSchema>>();
        mockCollection.Setup(collection => collection.UpdateOneAsync(
            It.IsAny<FilterDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateDefinition<PickupAndDeliveryTaskSchema>>(),
            It.IsAny<UpdateOptions>(),
            It.IsAny<CancellationToken>()
        ))
        .ReturnsAsync(new UpdateResult.Acknowledged(0, 0, null));

        var mdApiServiceMock = new Mock<MDApiService>();

        var thisService = new PickupAndDeliveryTasksService(mockCollection.Object, mdApiServiceMock.Object);

        // Act and Assert
        await Assert.ThrowsAsync<TaskNotFoundException>(() => thisService.RejectPickupAndDeliveryTask(taskId));
    }
}
