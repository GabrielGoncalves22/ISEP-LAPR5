using MDT.DTO;
using MDT.Exceptions;
using MDT.Services.PickupAndDeliveryTasks;
using Microsoft.AspNetCore.Mvc;

namespace MDT.Controllers;

[ApiController]
[Route("api/tasks/deliveries")]
public class PickupAndDeliveryTaskController : ControllerBase
{
    private readonly PickupAndDeliveryTasksService _pickupAndDeliveryTaskService;

    public PickupAndDeliveryTaskController(PickupAndDeliveryTasksService pickupAndDeliveryTaskService) =>
        _pickupAndDeliveryTaskService = pickupAndDeliveryTaskService;

    [HttpGet]
    public async Task<List<PickupAndDeliveryTaskDTO>> GetPickupAndDeliveryTask([FromQuery] string? status, [FromQuery] string? userEmail, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        if (string.IsNullOrEmpty(status) && startDate == null && endDate == null && string.IsNullOrEmpty(userEmail))
        {
            return await _pickupAndDeliveryTaskService.GetPickupAndDeliveryTask();
        }
        else
        {
            return await _pickupAndDeliveryTaskService.GetPickupAndDeliveryTasksByFilters(status, userEmail, startDate, endDate);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreatePickupAndDeliveryTask(CreatePickupAndDeliveryTaskDTO createPickDeliveryTaskDTO)
    {
        try
        {
            await _pickupAndDeliveryTaskService.CreatePickupAndDeliveryTask(createPickDeliveryTaskDTO, (HttpContext != null && HttpContext.Items != null) ? HttpContext.Items["UserEmail"] as string : "");
        }
        catch (InvalidPickupAndDeliveryTask ex)
        {
            return BadRequest(ex.Message);
        }
        catch (RoomNotFoundInBuildingException ex)
        {
            return NotFound(ex.Message);
        }

        return CreatedAtAction(nameof(GetPickupAndDeliveryTask), createPickDeliveryTaskDTO);
    }

    [HttpPatch("{taskId}/approve")]
    public async Task<IActionResult> ApprovePickupAndDeliveryTask(string taskId)
    {
        try
        {
            await _pickupAndDeliveryTaskService.ApprovePickupAndDeliveryTask(taskId);
            return Ok($"Task with id {taskId} approved successfully!");
        }
        catch (TaskNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (TaskUpdateException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{taskId}/reject")]
    public async Task<IActionResult> RejectPickupAndDeliveryTask(string taskId)
    {
        try
        {
            await _pickupAndDeliveryTaskService.RejectPickupAndDeliveryTask(taskId);
            return Ok($"Task with id {taskId} rejected successfully!");
        }
        catch (TaskNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (TaskUpdateException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch]
    public async Task<IActionResult> AnonymizePickupAndDeliveryTask([FromQuery] string userEmail)
    {
        try
        {
            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("The 'userEmail' parameter is required for anonymization!");
            }

            await _pickupAndDeliveryTaskService.AnonymizePickupAndDeliveryTaskByUserEmail(userEmail);
            return Ok($"Pickup and delivery tasks for the user with email {userEmail} anonymized successfully!");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error anonymizing pickup and delivery tasks: {ex.Message}!");
        }
    }

    [HttpGet("exec")]
    public async Task<List<PickupAndDeliveryTaskDTO>> GetTaskExecutionOrder()
    {
        return await _pickupAndDeliveryTaskService.GetTaskExecutionOrder();
    }
}
