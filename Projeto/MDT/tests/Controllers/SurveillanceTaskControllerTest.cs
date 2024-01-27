using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using MDT.DTO;
using MDT.Controllers;
using MDT.Services.SurveillanceTasks;
using MDT.Exceptions;
using MDT.Domain.SharedValueObjects;

public class SurveillanceTaskControllerTest
{
    [Fact]
    public async Task GetSurveillanceTasksByStatusRequestedReturnsEmptyListWhenNoTasksFound()
    {
        const string status = "Requested";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, null, null, null)).ReturnsAsync(new List<SurveillanceTaskDTO>());

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusRequestedReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Requested";

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user"
            },
            new SurveillanceTaskDTO
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

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusApprovedReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Approved";

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Approved",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user"
            },
            new SurveillanceTaskDTO
            {
                Id = "2",
                BuildingCode = "B",
                EmergencyContactName = "Ana Silva",
                EmergencyContactPhoneNumber = "933333333",
                RobotTaskStatus = "Approved",
                SurveillanceTaskFloors = [4, 5, 6],
                CreatedByUser = "user"
            }
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusRejectedReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Rejected";

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Rejected",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user"
            },
            new SurveillanceTaskDTO
            {
                Id = "2",
                BuildingCode = "B",
                EmergencyContactName = "Ana Silva",
                EmergencyContactPhoneNumber = "933333333",
                RobotTaskStatus = "Rejected",
                SurveillanceTaskFloors = [4, 5, 6],
                CreatedByUser = "user"
            }
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, null, null, null)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, null, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusRequestedAndDateIntervalReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Requested";
        DateTime startDate = DateTime.Parse("2000-01-01");
        DateTime endDate = DateTime.Parse("2200-01-01");

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user"
            },
            new SurveillanceTaskDTO
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

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, null, startDate, endDate)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, null, startDate, endDate);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusRequestedAndUserReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Requested";
        const string userEmail = "user@isep.ipp.pt";

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user@isep.ipp.pt"
            },
            new SurveillanceTaskDTO
            {
                Id = "2",
                BuildingCode = "B",
                EmergencyContactName = "Ana Silva",
                EmergencyContactPhoneNumber = "933333333",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [4, 5, 6],
                CreatedByUser = "user@isep.ipp.pt"
            }
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, userEmail, null, null)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, userEmail, null, null);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task GetSurveillanceTasksByStatusRequestedAndUserAndDateIntervalReturnsListOfSurveillanceTaskDTOs()
    {
        const string status = "Requested";
        const string userEmail = "user@isep.ipp.pt";
        DateTime startDate = DateTime.Parse("2000-01-01");
        DateTime endDate = DateTime.Parse("2200-01-01");

        var expectedResult = new List<SurveillanceTaskDTO>
        {
            new SurveillanceTaskDTO
            {
                Id = "1",
                BuildingCode = "A",
                EmergencyContactName = "José Pereira",
                EmergencyContactPhoneNumber = "912345678",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [1, 2, 3],
                CreatedByUser = "user@isep.ipp.pt"
            },
            new SurveillanceTaskDTO
            {
                Id = "2",
                BuildingCode = "B",
                EmergencyContactName = "Ana Silva",
                EmergencyContactPhoneNumber = "933333333",
                RobotTaskStatus = "Requested",
                SurveillanceTaskFloors = [4, 5, 6],
                CreatedByUser = "user@isep.ipp.pt"
            }
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.GetSurveillanceTasksByFilters(status, userEmail, startDate, endDate)).ReturnsAsync(expectedResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.GetSurveillanceTasks(status, userEmail, startDate, endDate);

        Assert.NotNull(result);
        Assert.IsType<List<SurveillanceTaskDTO>>(result);
        Assert.Equal(expectedResult.Count, result.Count);

        for (int i = 0; i < expectedResult.Count; i++)
        {
            Assert.Equal(expectedResult[i].Id, result[i].Id);
            Assert.Equal(expectedResult[i].BuildingCode, result[i].BuildingCode);
            Assert.Equal(expectedResult[i].EmergencyContactName, result[i].EmergencyContactName);
            Assert.Equal(expectedResult[i].EmergencyContactPhoneNumber, result[i].EmergencyContactPhoneNumber);
            Assert.Equal(expectedResult[i].RobotTaskStatus, result[i].RobotTaskStatus);
            Assert.Equal(expectedResult[i].SurveillanceTaskFloors, result[i].SurveillanceTaskFloors);
            Assert.Equal(expectedResult[i].CreatedByUser, result[i].CreatedByUser);
        }
    }

    [Fact]
    public async Task ApproveReturnsOkResultOnSuccessfulApproval()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.ApproveSurveillanceTask(It.IsAny<string>()));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.ApproveSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<OkObjectResult>(result);

        var okResult = (OkObjectResult)result;
        Assert.Equal($"Task with id {taskId} approved successfully!", okResult.Value);
    }

    [Fact]
    public async Task ApproveReturnsNotFoundResultOnTaskNotFoundException()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.ApproveSurveillanceTask(It.IsAny<string>())).ThrowsAsync(new TaskNotFoundException(taskId));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.ApproveSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var notFoundResult = (NotFoundObjectResult)result;
        Assert.Equal($"Task with id {taskId} not found!", notFoundResult.Value);
    }

    [Fact]
    public async Task ApproveReturnsBadRequestResultOnTaskUpdateException()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.ApproveSurveillanceTask(It.IsAny<string>())).ThrowsAsync(new TaskUpdateException(taskId));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.ApproveSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal($"Failed to update task status with id {taskId}!", badRequestResult.Value);
    }

    [Fact]
    public async Task RejectReturnsOkResultOnSuccessfulRejection()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.RejectSurveillanceTask(It.IsAny<string>()));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.RejectSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<OkObjectResult>(result);

        var okResult = (OkObjectResult)result;
        Assert.Equal($"Task with id {taskId} rejected successfully!", okResult.Value);
    }

    [Fact]
    public async Task RejectReturnsNotFoundResultOnTaskNotFoundException()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.RejectSurveillanceTask(It.IsAny<string>())).ThrowsAsync(new TaskNotFoundException(taskId));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.RejectSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var notFoundResult = (NotFoundObjectResult)result;
        Assert.Equal($"Task with id {taskId} not found!", notFoundResult.Value);
    }

    [Fact]
    public async Task RejectReturnsBadRequestResultOnTaskUpdateException()
    {
        const string taskId = "1";

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.RejectSurveillanceTask(It.IsAny<string>())).ThrowsAsync(new TaskUpdateException(taskId));

        var theController = new SurveillanceTaskController(mockService.Object);

        var result = await theController.RejectSurveillanceTask(taskId);

        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal($"Failed to update task status with id {taskId}!", badRequestResult.Value);
    }

    [Fact]
    public async void CreateSurveillanceTask_ValidTask_ReturnsCreatedAtAction()
    {
        // Arrange
        string buildingCode = "A";
        string emergencyContactName = "Teste";
        string emergencyContactPhoneNumber = "911222333";
        
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO {
            BuildingCode = buildingCode,
            EmergencyContactName = emergencyContactName,
            EmergencyContactPhoneNumber = emergencyContactPhoneNumber,
            SurveillanceTaskFloors = new List<int>([1, 2, 3])
        };

        SurveillanceTaskDTO actualResult = new SurveillanceTaskDTO {
            BuildingCode = buildingCode,
            EmergencyContactName = emergencyContactName,
            EmergencyContactPhoneNumber = emergencyContactPhoneNumber,
            RobotTaskStatus = RobotTaskStatus.Requested.ToString(),
            SurveillanceTaskFloors = [1, 2, 3],
            CreatedByUser = "User de Teste",
            CreatedDate = DateTime.Now.ToString()
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.CreateSurveillanceTask(It.IsAny<CreateSurveillanceTaskDTO>(), It.IsAny<string>())).ReturnsAsync(actualResult);

        var theController = new SurveillanceTaskController(mockService.Object);

        // Act
        var result = await theController.CreateSurveillanceTask(createSurveillanceTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(createSurveillanceTaskDTO.BuildingCode, actualResult.BuildingCode);
        Assert.Equal(createSurveillanceTaskDTO.EmergencyContactName, actualResult.EmergencyContactName);
        Assert.Equal(createSurveillanceTaskDTO.EmergencyContactPhoneNumber, actualResult.EmergencyContactPhoneNumber);
        Assert.Equal(createSurveillanceTaskDTO.SurveillanceTaskFloors.Count, actualResult.SurveillanceTaskFloors.Count);

        for (int i = 0; i < createSurveillanceTaskDTO.SurveillanceTaskFloors.Count; i++) {
            Assert.Equal(createSurveillanceTaskDTO.SurveillanceTaskFloors[i], actualResult.SurveillanceTaskFloors[i]);
        }
    }

    [Fact]
    public async Task CreateSurveillanceTask_InvalidTask_BadRequestResultOnInvalidSurveillanceTask()
    {
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO
        {
            BuildingCode = "",
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([1, 2, 3])
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.CreateSurveillanceTask(It.IsAny<CreateSurveillanceTaskDTO>(), It.IsAny<string>())).ThrowsAsync(new InvalidSurveillanceTask("Building code cannot be empty!"));

        var theController = new SurveillanceTaskController(mockService.Object);

        // Act
        var result = await theController.CreateSurveillanceTask(createSurveillanceTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<BadRequestObjectResult>(result);

        var badRequestResult = (BadRequestObjectResult)result;
        Assert.Equal("Building code cannot be empty!", badRequestResult.Value);
    }

    [Fact]
    public async Task CreateSurveillanceTask_InvalidTask_BadRequestResultOnBuildingNotFoundException()
    {
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO {
            BuildingCode = "Não existe",
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([1, 2, 3])
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.CreateSurveillanceTask(It.IsAny<CreateSurveillanceTaskDTO>(), It.IsAny<string>())).ThrowsAsync(new BuildingNotFoundException(createSurveillanceTaskDTO.BuildingCode));

        var theController = new SurveillanceTaskController(mockService.Object);

        // Act
        var result = await theController.CreateSurveillanceTask(createSurveillanceTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var badRequestResult = (NotFoundObjectResult)result;
        Assert.Equal($"Building with code '{createSurveillanceTaskDTO.BuildingCode}' not found!", badRequestResult.Value);
    }

    [Fact]
    public async Task CreateSurveillanceTask_InvalidTask_BadRequestResultOnFloorNotFoundInBuildingException()
    {
        // Arrange
        CreateSurveillanceTaskDTO createSurveillanceTaskDTO = new CreateSurveillanceTaskDTO {
            BuildingCode = "A",
            EmergencyContactName = "Teste",
            EmergencyContactPhoneNumber = "911222333",
            SurveillanceTaskFloors = new List<int>([-1000, 1, 2, 3])
        };

        var mockService = new Mock<SurveillanceTasksService>();
        mockService.Setup(service => service.CreateSurveillanceTask(It.IsAny<CreateSurveillanceTaskDTO>(), It.IsAny<string>())).ThrowsAsync(new FloorNotFoundInBuildingException($"The floor -1000 doesn't exists in the building with code {createSurveillanceTaskDTO.BuildingCode}!"));

        var theController = new SurveillanceTaskController(mockService.Object);

        // Act
        var result = await theController.CreateSurveillanceTask(createSurveillanceTaskDTO);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<NotFoundObjectResult>(result);

        var badRequestResult = (NotFoundObjectResult)result;
        Assert.Equal($"The floor -1000 doesn't exists in the building with code {createSurveillanceTaskDTO.BuildingCode}!", badRequestResult.Value);
    }

}
