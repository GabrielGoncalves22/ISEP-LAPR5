using System.Net.Http.Headers;
using Microsoft.Extensions.Options;
using MDT.Config;
using MDT.Middlewares;
using Newtonsoft.Json;
using System.Text;

namespace MDT.Services
{
    public class MDApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        private const string BUILDINGS_URL = "buildings";
        private const string FLOORS_URL = "floors";
        private const string ROOMS_URL = "rooms";

        public MDApiService() {}

        public MDApiService(IOptions<MDApiSettings> options)
        {
            //_baseUrl = options.Value.URL;
            //_baseUrl = "http://10.9.20.197:4000/api";
            _baseUrl = "http://localhost:4000/api";

            _httpClient = new HttpClient
            {
                DefaultRequestHeaders = { Authorization = new AuthenticationHeaderValue("Bearer", IsAuthMiddleware.GetToken()) }
            };
        }

        public virtual async Task<bool> CheckIfBuildingExists(string buildingCode)
        {
            try
            {
                // Construir a URL completa da API
                string apiUrl = $"{_baseUrl}/{BUILDINGS_URL}/{buildingCode}";

                // Enviar uma solicitação HTTP POST para a API com os dados
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                // Lidar com exceções, se ocorrerem
                throw new Exception($"Erro: {ex.Message}");
            }
        }

        public virtual async Task<(bool, string)> CheckIfFloorsExistsInBuilding(string buildingCode, List<int> floors)
        {
            try
            {
                // Construir a URL completa da API
                string apiUrl = $"{_baseUrl}/{BUILDINGS_URL}/{buildingCode}/{FLOORS_URL}";
                
                // Criar objeto anônimo para representar o corpo da solicitação
                var requestBody = new {
                    floors
                };

                // Serializar o objeto para JSON
                var jsonBody = JsonConvert.SerializeObject(requestBody);

                // Criar um conteúdo StringContent com o JSON
                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                // Enviar uma solicitação HTTP POST para a API com os dados
                HttpResponseMessage response = await _httpClient.PostAsync(apiUrl, content);

                return (response.IsSuccessStatusCode, response.Content.ReadAsStringAsync().Result);
            }
            catch (Exception ex)
            {
                // Lidar com exceções, se ocorrerem
                throw new Exception($"Erro: {ex.Message}");
            }
        }

        public virtual async Task<(bool, string)> CheckBuildingRoom(string buildingCode, string roomName)
        {
            try
            {
                // Construir a URL completa da API
                string apiUrl = $"{_baseUrl}/{BUILDINGS_URL}/{buildingCode}/{ROOMS_URL}/{roomName}";

                // Enviar uma solicitação HTTP POST para a API com os dados
                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

                return (response.IsSuccessStatusCode, response.Content.ReadAsStringAsync().Result);
            }
            catch (Exception ex)
            {
                // Lidar com exceções, se ocorrerem
                throw new Exception($"Erro: {ex.Message}");
            }
        }
    }
}
