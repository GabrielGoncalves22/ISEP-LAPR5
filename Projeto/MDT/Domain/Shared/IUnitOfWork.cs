using System.Threading.Tasks;

namespace MDT.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}