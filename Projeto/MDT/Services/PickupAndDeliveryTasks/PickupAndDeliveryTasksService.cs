using MongoDB.Driver;
using MongoDB.Bson;
using MDT.DTO;
using MDT.Mappers;
using MDT.Persistence.Schema;
using MDT.Domain.PickupAndDeliveryTasks;
using MDT.Domain.SharedValueObjects;
using MDT.Exceptions;
using Newtonsoft.Json;
using System.Text;

namespace MDT.Services.PickupAndDeliveryTasks
{
    public class PickupAndDeliveryTasksService
    {

        private readonly IMongoCollection<PickupAndDeliveryTaskSchema> _pickupAndDeliveryTaskCollection;
        private readonly MDApiService _mdApiService;

        public PickupAndDeliveryTasksService() { }

        public PickupAndDeliveryTasksService(IMongoCollection<PickupAndDeliveryTaskSchema> pickupAndDeliveryTaskCollection, MDApiService mdApiService)
        {
            _pickupAndDeliveryTaskCollection = pickupAndDeliveryTaskCollection;
            _mdApiService = mdApiService;
        }

        public async Task<List<PickupAndDeliveryTaskDTO>> GetPickupAndDeliveryTask()
        {
            var pickupAndDeliveryTasks = await _pickupAndDeliveryTaskCollection.Find(_ => true).ToListAsync();

            List<PickupAndDeliveryTaskDTO> pickupAndDeliveryTaskDTOs = new List<PickupAndDeliveryTaskDTO>();

            foreach (var pickupAndDeliveryTask in pickupAndDeliveryTasks)
            {
                PickupAndDeliveryTask pickupAndDeliveryTaskConverted = PickupAndDeliveryTaskMap.ToDomain(pickupAndDeliveryTask);
                pickupAndDeliveryTaskDTOs.Add(PickupAndDeliveryTaskMap.ToDTO(pickupAndDeliveryTaskConverted));
            }

            return pickupAndDeliveryTaskDTOs;
        }

        private async Task<PickupAndDeliveryTaskDTO> GetPickupAndDeliveryTaskById(string taskId)
        {
            var pickupAndDeliveryTask = await _pickupAndDeliveryTaskCollection.Find(task => task.Id == taskId).FirstOrDefaultAsync();

            PickupAndDeliveryTask pickupAndDeliveryTaskConverted = PickupAndDeliveryTaskMap.ToDomain(pickupAndDeliveryTask);
            return PickupAndDeliveryTaskMap.ToDTO(pickupAndDeliveryTaskConverted);
        }

        public virtual async Task<List<PickupAndDeliveryTaskDTO>> GetPickupAndDeliveryTasksByFilters(string? status, string? userEmail, DateTime? startDate, DateTime? endDate)
        {
            var query = _pickupAndDeliveryTaskCollection.AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.IsDefined(typeof(RobotTaskStatus), status))
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<PickupAndDeliveryTaskSchema>)query.Where(task => task.RobotTaskStatus == status);
            }

            if (!string.IsNullOrEmpty(userEmail))
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<PickupAndDeliveryTaskSchema>)query.Where(task => task.CreatedByUser == userEmail);
            }

            if (startDate.HasValue)
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<PickupAndDeliveryTaskSchema>)query.Where(task => task.CreatedDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<PickupAndDeliveryTaskSchema>)query.Where(task => task.CreatedDate <= endDate.Value);
            }

            var pickupAndDeliveryTasks = await query.ToListAsync();

            List<PickupAndDeliveryTaskDTO> pickupAndDeliveryTaskDTOs = new List<PickupAndDeliveryTaskDTO>();

            foreach (var pickupAndDeliveryTask in pickupAndDeliveryTasks)
            {
                PickupAndDeliveryTask pickupAndDeliveryTaskConverted = PickupAndDeliveryTaskMap.ToDomain(pickupAndDeliveryTask);
                pickupAndDeliveryTaskDTOs.Add(PickupAndDeliveryTaskMap.ToDTO(pickupAndDeliveryTaskConverted));
            }

            return pickupAndDeliveryTaskDTOs;
        }

        public virtual async Task<PickupAndDeliveryTaskDTO> CreatePickupAndDeliveryTask(CreatePickupAndDeliveryTaskDTO newPADTaskDTO, string userEmail)
        {
            // Primeiro fazemos as validações que dá para fazer locamente antes de utilizar a rede
            PickupAndDeliveryTask pickupAndDeliveryTask = new PickupAndDeliveryTask(newPADTaskDTO.PickupContactName,
                newPADTaskDTO.PickupContactPhoneNumber, newPADTaskDTO.DeliveryContactName, newPADTaskDTO.DeliveryContactPhoneNumber,
                newPADTaskDTO.TaskDescription, newPADTaskDTO.ConfirmationCode, RobotTaskStatus.Requested.ToString(),
                newPADTaskDTO.PickupBuildingCode, newPADTaskDTO.PickupRoomName, newPADTaskDTO.DeliveryBuildingCode, newPADTaskDTO.DeliveryRoomName,
                userEmail, DateTime.Now
            );

            // Check the pickup building and room
            (bool, string) pickupResult = _mdApiService.CheckBuildingRoom(newPADTaskDTO.PickupBuildingCode, newPADTaskDTO.PickupRoomName).Result;
            if (!pickupResult.Item1)
            {
                throw new RoomNotFoundInBuildingException(pickupResult.Item2);
            }

            // Check the delivery building and room
            (bool, string) deliveryResult = _mdApiService.CheckBuildingRoom(newPADTaskDTO.DeliveryBuildingCode, newPADTaskDTO.DeliveryRoomName).Result;
            if (!deliveryResult.Item1)
            {
                throw new RoomNotFoundInBuildingException(deliveryResult.Item2);
            }

            await _pickupAndDeliveryTaskCollection.InsertOneAsync(PickupAndDeliveryTaskMap.ToPersistence(pickupAndDeliveryTask));

            return PickupAndDeliveryTaskMap.ToDTO(pickupAndDeliveryTask);
        }

        public virtual async Task ApprovePickupAndDeliveryTask(string taskId)
        {
            if (!ObjectId.TryParse(taskId, out _) || GetPickupAndDeliveryTaskById(taskId) == null)
            {
                throw new TaskNotFoundException(taskId);
            }

            var update = Builders<PickupAndDeliveryTaskSchema>.Update.Set(task => task.RobotTaskStatus, RobotTaskStatus.Approved.ToString());
            var result = await _pickupAndDeliveryTaskCollection.UpdateOneAsync(task => task.Id == taskId, update);

            if (!(result.IsAcknowledged && result.ModifiedCount > 0))
            {
                throw new TaskUpdateException(taskId);
            }
        }

        public virtual async Task RejectPickupAndDeliveryTask(string taskId)
        {
            if (!ObjectId.TryParse(taskId, out _) || GetPickupAndDeliveryTaskById(taskId) == null)
            {
                throw new TaskNotFoundException(taskId);
            }

            var update = Builders<PickupAndDeliveryTaskSchema>.Update.Set(task => task.RobotTaskStatus, RobotTaskStatus.Rejected.ToString());
            var result = await _pickupAndDeliveryTaskCollection.UpdateOneAsync(task => task.Id == taskId, update);

            if (!(result.IsAcknowledged && result.ModifiedCount > 0))
            {
                throw new TaskUpdateException(taskId);
            }
        }

        public async Task AnonymizePickupAndDeliveryTaskByUserEmail(string userEmail)
        {
            var tasksToAnonymize = await _pickupAndDeliveryTaskCollection.Find(task => task.CreatedByUser == userEmail).ToListAsync();

            if (tasksToAnonymize != null && tasksToAnonymize.Count != 0)
            {
                var update = Builders<PickupAndDeliveryTaskSchema>.Update
                    .Set(task => task.RobotTaskStatus, RobotTaskStatus.Rejected.ToString())
                    .Set(task => task.CreatedByUser, "Anonymous");

                await _pickupAndDeliveryTaskCollection.UpdateManyAsync(task => task.CreatedByUser == userEmail, update);
            }
        }

        public async Task<List<PickupAndDeliveryTaskDTO>> GetTaskExecutionOrder()
        {
            string apiUrl = "http://localhost:5000/api/planning/tasks";
            var taskExecutionOrder = await GetPickupAndDeliveryTasksByFilters(RobotTaskStatus.Approved.ToString(), null, null, null);

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    string jsonContent = ConvertToCustomJsonFormat(taskExecutionOrder);
                    var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                    // POST request
                    HttpResponseMessage response = await client.PostAsync(apiUrl, httpContent);
                }
                catch (Exception ex)
                {
                }
            }

            List<string>? orderedIds = null;

            using (HttpClient client2 = new HttpClient())
            {
                try
                {
                    // Make a GET request and get the response
                    HttpResponseMessage response2 = await client2.GetAsync(apiUrl);

                    // Check if the request was successful (status code in the 200-299 range)
                    if (response2.IsSuccessStatusCode)
                    {
                        var content2 = await response2.Content.ReadAsStringAsync();

                        orderedIds = JsonConvert.DeserializeObject<List<string>>(content2);
                    }
                }
                catch (Exception ex)
                {
                }
            }

            var orderedList = taskExecutionOrder
                .OrderBy(task => orderedIds.IndexOf(task.Id))
                .ToList();

            return orderedList;
        }
        private string ConvertToCustomJsonFormat(List<PickupAndDeliveryTaskDTO> taskExecutionOrder)
        {
            var formattedList = taskExecutionOrder.Select(task =>
                new
                {
                    id = task.Id,
                    pickupContactName = task.PickupContactName,
                    pickupContactPhoneNumber = task.PickupContactPhoneNumber,
                    deliveryContactName = task.DeliveryContactName,
                    deliveryContactPhoneNumber = task.DeliveryContactPhoneNumber,
                    taskDescription = task.TaskDescription,
                    confirmationCode = task.ConfirmationCode,
                    robotTaskStatus = task.RobotTaskStatus,
                    pickupBuildingCode = task.PickupBuildingCode,
                    pickupRoomName = task.PickupRoomName,
                    deliveryBuildingCode = task.DeliveryBuildingCode,
                    deliveryRoomName = task.DeliveryRoomName,
                    createdByUser = task.CreatedByUser,
                    createdDate = task.CreatedDate
                }).ToList<object>();

            return JsonConvert.SerializeObject(formattedList, Formatting.Indented);
        }

    }
}
