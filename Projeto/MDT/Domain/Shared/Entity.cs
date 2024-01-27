using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDT.Domain.Shared
{
    /// <summary>
    /// Base class for entities.
    /// </summary>
    public abstract class Entity<TEntityId>
    where TEntityId: EntityId
    {
        public TEntityId Id { get; protected set; }
    }
}