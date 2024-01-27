using MDT.Domain.SurveillanceTasks;
using MongoDB.Driver;
using MongoDB.Bson;
using MDT.DTO;
using MDT.Mappers;
using MDT.Persistence.Schema;
using MDT.Domain.SharedValueObjects;
using MDT.Exceptions;

namespace MDT.Services.SurveillanceTasks
{
    public class SurveillanceTasksService
    {
        private readonly IMongoCollection<SurveillanceTaskSchema> _surveillanceTaskCollection;
        private readonly MDApiService _mdApiService;

        public SurveillanceTasksService() { }

        public SurveillanceTasksService(IMongoCollection<SurveillanceTaskSchema> surveillanceTaskCollection, MDApiService mdApiService)
        {
            _surveillanceTaskCollection = surveillanceTaskCollection;
            _mdApiService = mdApiService;
        }

        public async Task<List<SurveillanceTaskDTO>> GetSurveillanceTasks()
        {
            var surveillanceTasks = await _surveillanceTaskCollection.Find(_ => true).ToListAsync();

            List<SurveillanceTaskDTO> surveillanceTaskDTOs = new List<SurveillanceTaskDTO>();

            foreach (var surveillanceTask in surveillanceTasks)
            {
                SurveillanceTask surveillanceTaskConverted = SurveillanceTaskMap.ToDomain(surveillanceTask);
                surveillanceTaskDTOs.Add(SurveillanceTaskMap.ToDTO(surveillanceTaskConverted));
            }

            return surveillanceTaskDTOs;
        }

        private async Task<SurveillanceTaskDTO> GetSurveillanceTaskById(string taskId)
        {
            var surveillanceTask = await _surveillanceTaskCollection.Find(task => task.Id == taskId).FirstOrDefaultAsync();

            SurveillanceTask surveillanceTaskConverted = SurveillanceTaskMap.ToDomain(surveillanceTask);
            return SurveillanceTaskMap.ToDTO(surveillanceTaskConverted);
        }

        public virtual async Task<List<SurveillanceTaskDTO>> GetSurveillanceTasksByFilters(string? status, string? userEmail, DateTime? startDate, DateTime? endDate)
        {
            var query = _surveillanceTaskCollection.AsQueryable();

            if (!string.IsNullOrEmpty(status) && Enum.IsDefined(typeof(RobotTaskStatus), status))
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<SurveillanceTaskSchema>)query.Where(task => task.RobotTaskStatus == status);
            }

            if (!string.IsNullOrEmpty(userEmail))
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<SurveillanceTaskSchema>)query.Where(task => task.CreatedByUser == userEmail);
            }

            if (startDate.HasValue)
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<SurveillanceTaskSchema>)query.Where(task => task.CreatedDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = (MongoDB.Driver.Linq.IMongoQueryable<SurveillanceTaskSchema>)query.Where(task => task.CreatedDate <= endDate.Value);
            }

            var surveillanceTasks = await query.ToListAsync();

            List<SurveillanceTaskDTO> surveillanceTaskDTOs = new List<SurveillanceTaskDTO>();

            foreach (var surveillanceTask in surveillanceTasks)
            {
                SurveillanceTask surveillanceTaskConverted = SurveillanceTaskMap.ToDomain(surveillanceTask);
                surveillanceTaskDTOs.Add(SurveillanceTaskMap.ToDTO(surveillanceTaskConverted));
            }

            return surveillanceTaskDTOs;
        }

        public virtual async Task<SurveillanceTaskDTO> CreateSurveillanceTask(CreateSurveillanceTaskDTO newCreateSurvTaskDTO, string userEmail)
        {
            // Validar os dados que são validados nesta API antes de utilizar a rede para fazer pedidos que podem 
            // ser desnecessários
            SurveillanceTask surveillanceTask = new SurveillanceTask(
                newCreateSurvTaskDTO.BuildingCode,
                newCreateSurvTaskDTO.EmergencyContactName,
                newCreateSurvTaskDTO.EmergencyContactPhoneNumber,
                RobotTaskStatus.Requested.ToString(),
                newCreateSurvTaskDTO.SurveillanceTaskFloors,
                userEmail,
                DateTime.Now
            );

            // Verificar se existe um edifício com o código especificado
            if (!_mdApiService.CheckIfBuildingExists(newCreateSurvTaskDTO.BuildingCode).Result)
            {
                throw new BuildingNotFoundException(newCreateSurvTaskDTO.BuildingCode);
            }

            (bool, string) result = _mdApiService.CheckIfFloorsExistsInBuilding(newCreateSurvTaskDTO.BuildingCode, newCreateSurvTaskDTO.SurveillanceTaskFloors).Result;

            // Verificar se existem todos os pisos especificados no building especificado
            if (!result.Item1)
            {
                throw new FloorNotFoundInBuildingException(result.Item2);
            }

            await _surveillanceTaskCollection.InsertOneAsync(SurveillanceTaskMap.ToPersistence(surveillanceTask));

            return SurveillanceTaskMap.ToDTO(surveillanceTask);
        }

        public virtual async Task ApproveSurveillanceTask(string taskId)
        {
            if (!ObjectId.TryParse(taskId, out _) || GetSurveillanceTaskById(taskId) == null)
            {
                throw new TaskNotFoundException(taskId);
            }

            var update = Builders<SurveillanceTaskSchema>.Update.Set(task => task.RobotTaskStatus, RobotTaskStatus.Approved.ToString());
            var result = await _surveillanceTaskCollection.UpdateOneAsync(task => task.Id == taskId, update);

            if (!(result.IsAcknowledged && result.ModifiedCount > 0))
            {
                throw new TaskUpdateException(taskId);
            }
        }

        public virtual async Task RejectSurveillanceTask(string taskId)
        {
            if (!ObjectId.TryParse(taskId, out _) || GetSurveillanceTaskById(taskId) == null)
            {
                throw new TaskNotFoundException(taskId);
            }

            var update = Builders<SurveillanceTaskSchema>.Update.Set(task => task.RobotTaskStatus, RobotTaskStatus.Rejected.ToString());
            var result = await _surveillanceTaskCollection.UpdateOneAsync(task => task.Id == taskId, update);

            if (!(result.IsAcknowledged && result.ModifiedCount > 0))
            {
                throw new TaskUpdateException(taskId);
            }
        }

        public async Task AnonymizeSurveillanceTaskByUserEmail(string userEmail)
        {
            var tasksToAnonymize = await _surveillanceTaskCollection.Find(task => task.CreatedByUser == userEmail).ToListAsync();

            if (tasksToAnonymize != null && tasksToAnonymize.Count != 0)
            {
                var update = Builders<SurveillanceTaskSchema>.Update
                    .Set(task => task.RobotTaskStatus, RobotTaskStatus.Rejected.ToString())
                    .Set(task => task.CreatedByUser, "Anonymous");

                await _surveillanceTaskCollection.UpdateManyAsync(task => task.CreatedByUser == userEmail, update);
            }
        }
    }
}
