using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using MDT.DTO;
using MDT.Controllers;
using MDT.Services.PickupAndDeliveryTasks;
using MDT.Exceptions;
using MDT.Domain.SharedValueObjects;

public class PickupAndDeliveryTaskControllerTest
{
    [Fact]
    public async Task GetByStatusRequestedReturnsEmptyListWhenNoTasksFound()
    {
        const string status = "Requested";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, null, null, null)).ReturnsAsync(new List<PickupAndDeliveryTaskDTO>());

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetByStatusRequestedReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Requested";

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Requested",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Requested"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task GetByStatusApprovedReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Approved";

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Approved",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Approved"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task GetByStatusRejectedReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Rejected";

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Rejected",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Rejected"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task GetByStatusRequestedAndDateIntervalReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Requested";
        DateTime startDate = DateTime.Parse("2000-01-01");
        DateTime endDate = DateTime.Parse("2200-01-01");

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Requested",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Requested"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, null, startDate, endDate)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, null, startDate, endDate);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task GetByStatusRequestedAndUserReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Requested";
        const string userEmail = "user@isep.ipp.pt";

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Requested",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Requested"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, userEmail, null, null)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, userEmail, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task GetByStatusRequestedAndUserAndDateIntervalReturnsListOfPickupAndDeliveryTaskDTOs()
    {
        const string status = "Requested";
        const string userEmail = "user@isep.ipp.pt";
        DateTime startDate = DateTime.Parse("2000-01-01");
        DateTime endDate = DateTime.Parse("2200-01-01");

        var expectedResult = new List<PickupAndDeliveryTaskDTO>
        {
            new PickupAndDeliveryTaskDTO
            {
                Id = "1",
                PickupContactName = "João Silva",
                PickupContactPhoneNumber = "912345678",
                DeliveryContactName = "Maria Santos",
                DeliveryContactPhoneNumber = "917654321",
                TaskDescription = "Entrega de pacote",
                ConfirmationCode = "ABC123",
                RobotTaskStatus = "Requested",
            },
            new PickupAndDeliveryTaskDTO
            {
                Id = "2",
                PickupContactName = "Pedro Oliveira",
                PickupContactPhoneNumber = "933333333",
                DeliveryContactName = "Ana Pereira",
                DeliveryContactPhoneNumber = "966666666",
                TaskDescription = "Recolha de documentos",
                ConfirmationCode = "XYZ789",
                RobotTaskStatus = "Requested"
            }
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.GetPickupAndDeliveryTasksByFilters(status, userEmail, startDate, endDate)).ReturnsAsync(expectedResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.GetPickupAndDeliveryTask(status, userEmail, startDate, endDate);

        Assert.NotNull(result);
        Assert.IsType<List<PickupAndDeliveryTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].PickupContactName, result[i].PickupContactName);
            Assert.Equal(expectedResult[i].PickupContactPhoneNumber, result[i].PickupContactPhoneNumber);
            Assert.Equal(expectedResult[i].DeliveryContactName, result[i].DeliveryContactName);
            Assert.Equal(expectedResult[i].DeliveryContactPhoneNumber, result[i].DeliveryContactPhoneNumber);
            Assert.Equal(expectedResult[i].TaskDescription, result[i].TaskDescription);
            Assert.Equal(expectedResult[i].ConfirmationCode, result[i].ConfirmationCode);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
        }
    }

    [Fact]
    public async Task ApproveReturnsOkResultOnSuccessfulApproval()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.ApprovePickupAndDeliveryTask(It.IsAny<string>()));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.ApprovePickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<OkObjectResult>(result);

        var okResult = (OkObjectResult)result;
        Assert.Equal($"Task with id {taskId} approved successfully!", okResult.Value);
    }

    [Fact]
    public async Task ApproveReturnsNotFoundResultOnTaskNotFoundException()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.ApprovePickupAndDeliveryTask(It.IsAny<string>())).ThrowsAsync(new TaskNotFoundException(taskId));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.ApprovePickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var notFoundResult = (NotFoundObjectResult)result;
        Assert.Equal($"Task with id {taskId} not found!", notFoundResult.Value);
    }

    [Fact]
    public async Task ApproveReturnsBadRequestResultOnTaskUpdateException()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.ApprovePickupAndDeliveryTask(It.IsAny<string>())).ThrowsAsync(new TaskUpdateException(taskId));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.ApprovePickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal($"Failed to update task status with id {taskId}!", badRequestResult.Value);
    }

    [Fact]
    public async Task RejectReturnsOkResultOnSuccessfulRejection()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.RejectPickupAndDeliveryTask(It.IsAny<string>()));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.RejectPickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<OkObjectResult>(result);

        var okResult = (OkObjectResult)result;
        Assert.Equal($"Task with id {taskId} rejected successfully!", okResult.Value);
    }

    [Fact]
    public async Task RejectReturnsNotFoundResultOnTaskNotFoundException()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.RejectPickupAndDeliveryTask(It.IsAny<string>())).ThrowsAsync(new TaskNotFoundException(taskId));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.RejectPickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var notFoundResult = (NotFoundObjectResult)result;
        Assert.Equal($"Task with id {taskId} not found!", notFoundResult.Value);
    }

    [Fact]
    public async Task RejectReturnsBadRequestResultOnTaskUpdateException()
    {
        const string taskId = "1";

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.RejectPickupAndDeliveryTask(It.IsAny<string>())).ThrowsAsync(new TaskUpdateException(taskId));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        var result = await theController.RejectPickupAndDeliveryTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal($"Failed to update task status with id {taskId}!", badRequestResult.Value);
    }

        [Fact]
    public async void CreatePickupAndDeliveryTask_ValidTask_ReturnsCreatedAtAction()
    {
        string pickupContactName = "Teste Pickup Contact Name";
        string pickupContactPhoneNumber = "911222333";
        string deliveryContactName = "Teste Delivery Contact Name";
        string deliveryContactPhoneNumber = "922555999";
        string taskDescription = "Task description blá blá blá";
        string confirmationCode = "C0D3x";
        string pickupBuildingCode = "A";
        string pickupRoomName = "A101";
        string deliveryBuildingCode = "E";
        string deliveryRoomName = "E201";

        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO {
            PickupContactName = pickupContactName,
            PickupContactPhoneNumber = pickupContactPhoneNumber,
            DeliveryContactName = deliveryContactName,
            DeliveryContactPhoneNumber = deliveryContactPhoneNumber,
            TaskDescription = taskDescription,
            ConfirmationCode = confirmationCode,
            PickupBuildingCode = pickupBuildingCode,
            PickupRoomName = pickupRoomName,
            DeliveryBuildingCode = deliveryBuildingCode,
            DeliveryRoomName = deliveryRoomName
        };

        PickupAndDeliveryTaskDTO actualResult = new PickupAndDeliveryTaskDTO {
            PickupContactName = pickupContactName,
            PickupContactPhoneNumber = pickupContactPhoneNumber,
            DeliveryContactName = deliveryContactName,
            DeliveryContactPhoneNumber = deliveryContactPhoneNumber,
            TaskDescription = taskDescription,
            ConfirmationCode = confirmationCode,
            RobotTaskStatus = RobotTaskStatus.Requested.ToString(),
            PickupBuildingCode = pickupBuildingCode,
            PickupRoomName = pickupRoomName,
            DeliveryBuildingCode = deliveryBuildingCode,
            DeliveryRoomName = deliveryRoomName,
            CreatedByUser = "User de Teste",
            CreatedDate = DateTime.Now.ToString()
        };

        // Arrange
        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.CreatePickupAndDeliveryTask(It.IsAny<CreatePickupAndDeliveryTaskDTO>(), It.IsAny<string>())).ReturnsAsync(actualResult);

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        // Act
        var result = await theController.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<CreatedAtActionResult>(result);
    }

    [Fact]
    public async Task CreatePickupAndDeliveryTask_InvalidTask_BadRequestResultOnInvalidPickupAndDeliveryTask()
    {
        // Arrange
        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO {
            PickupContactName = "Teste Pickup Contact Name",
            PickupContactPhoneNumber = "911222333",
            DeliveryContactName = "Teste Delivery Contact Name",
            DeliveryContactPhoneNumber = "922555999",
            TaskDescription = "Task description blá blá blá",
            ConfirmationCode = "C0D3x",
            PickupBuildingCode = "A",
            PickupRoomName = "A101",
            DeliveryBuildingCode = "E",
            DeliveryRoomName = "E201"
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.CreatePickupAndDeliveryTask(It.IsAny<CreatePickupAndDeliveryTaskDTO>(), It.IsAny<string>())).ThrowsAsync(new InvalidPickupAndDeliveryTask("Error message!"));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        // Act
        var result = await theController.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal("Error message!", badRequestResult.Value);
    }

    [Fact]
    public async Task CreatePickupAndDeliveryTask_InvalidTask_NotFoundResultOnRoomNotFoundInBuilding()
    {
        // Arrange
        CreatePickupAndDeliveryTaskDTO createPickupAndDeliveryTaskDTO = new CreatePickupAndDeliveryTaskDTO {
            PickupContactName = "Teste Pickup Contact Name",
            PickupContactPhoneNumber = "911222333",
            DeliveryContactName = "Teste Delivery Contact Name",
            DeliveryContactPhoneNumber = "922555999",
            TaskDescription = "Task description blá blá blá",
            ConfirmationCode = "C0D3x",
            PickupBuildingCode = "A",
            PickupRoomName = "A101",
            DeliveryBuildingCode = "E",
            DeliveryRoomName = "E201"
        };

        var mockService = new Mock<PickupAndDeliveryTasksService>();
        mockService.Setup(service => service.CreatePickupAndDeliveryTask(It.IsAny<CreatePickupAndDeliveryTaskDTO>(), It.IsAny<string>())).ThrowsAsync(new RoomNotFoundInBuildingException("Error message!"));

        var theController = new PickupAndDeliveryTaskController(mockService.Object);

        // Act
        var result = await theController.CreatePickupAndDeliveryTask(createPickupAndDeliveryTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var badRequestResult = (NotFoundObjectResult)result;
        Assert.Equal("Error message!", badRequestResult.Value);
    }
}
