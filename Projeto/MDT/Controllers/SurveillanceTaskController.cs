using MDT.DTO;
using MDT.Exceptions;
using MDT.Services.SurveillanceTasks;
using Microsoft.AspNetCore.Mvc;

namespace MDT.Controllers;

[ApiController]
[Route("api/tasks/surveillances")]
public class SurveillanceTaskController : ControllerBase
{
    private readonly SurveillanceTasksService _surveillanceTaskService;

    public SurveillanceTaskController(SurveillanceTasksService surveillanceTaskService) =>
        _surveillanceTaskService = surveillanceTaskService;

    [HttpGet]
    public async Task<List<SurveillanceTaskDTO>> GetSurveillanceTasks([FromQuery] string? status, [FromQuery] string? userEmail, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        if (string.IsNullOrEmpty(status) && startDate == null && endDate == null && string.IsNullOrEmpty(userEmail))
        {
            return await _surveillanceTaskService.GetSurveillanceTasks();
        }
        else
        {
            return await _surveillanceTaskService.GetSurveillanceTasksByFilters(status, userEmail, startDate, endDate);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateSurveillanceTask(CreateSurveillanceTaskDTO newCreateSurveillanceTaskDTO)
    {
        try
        {
            await _surveillanceTaskService.CreateSurveillanceTask(newCreateSurveillanceTaskDTO, (HttpContext != null && HttpContext.Items != null) ? HttpContext.Items["UserEmail"] as string : "");
        }
        catch (InvalidSurveillanceTask ex)
        {
            return BadRequest(ex.Message);
        }
        catch (BuildingNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (FloorNotFoundInBuildingException ex)
        {
            return NotFound(ex.Message);
        }

        return CreatedAtAction(nameof(GetSurveillanceTasks), newCreateSurveillanceTaskDTO);
    }

    [HttpPatch("{taskId}/approve")]
    public async Task<IActionResult> ApproveSurveillanceTask(string taskId)
    {
        try
        {
            await _surveillanceTaskService.ApproveSurveillanceTask(taskId);
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
    public async Task<IActionResult> RejectSurveillanceTask(string taskId)
    {
        try
        {
            await _surveillanceTaskService.RejectSurveillanceTask(taskId);
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
    public async Task<IActionResult> AnonymizeSurveillanceTask([FromQuery] string userEmail)
    {
        try
        {
            if (string.IsNullOrEmpty(userEmail))
            {
                return BadRequest("The 'userEmail' parameter is required for anonymization!");
            }

            await _surveillanceTaskService.AnonymizeSurveillanceTaskByUserEmail(userEmail);
            return Ok($"Surveillance tasks for the user with email {userEmail} anonymized successfully!");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error anonymizing surveillance tasks: {ex.Message}!");
        }
    }
}