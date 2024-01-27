using MDT.Domain;
using MDT.Middlewares;
using MDT.Persistence.Schema;
using MDT.Services;
using MDT.Services.PickupAndDeliveryTasks;
using MDT.Services.SurveillanceTasks;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

IConfigurationSection tasksDatabaseSettingsSection = builder.Configuration.GetSection("TasksDatabase");
TasksDatabaseSettings tasksDatabaseSettings = new TasksDatabaseSettings();
tasksDatabaseSettingsSection.Bind(tasksDatabaseSettings);
IOptions<TasksDatabaseSettings> options = new OptionsWrapper<TasksDatabaseSettings>(tasksDatabaseSettings);

var mongoClient = new MongoClient(options.Value.ConnectionString);
var mongoDatabase = mongoClient.GetDatabase(options.Value.DatabaseName);

IMongoCollection<SurveillanceTaskSchema> _surveillanceTaskCollection = mongoDatabase.GetCollection<SurveillanceTaskSchema>(
                options.Value.SurveillanceTasksCollectionName);

IMongoCollection<PickupAndDeliveryTaskSchema> _pickupAndDeliveryTaskCollection = mongoDatabase.GetCollection<PickupAndDeliveryTaskSchema>(
                options.Value.PickupAndDeliveryTasksCollectionName);

//builder.Services.AddHttpClient<MDApiService>();
builder.Services.Configure<MDApiService>(
    builder.Configuration.GetSection("MDApiInfo")
);

builder.Services.AddSingleton(_surveillanceTaskCollection);
builder.Services.AddSingleton(_pickupAndDeliveryTaskCollection);

builder.Services.AddSingleton<SurveillanceTasksService>();
builder.Services.AddSingleton<PickupAndDeliveryTasksService>();
builder.Services.AddSingleton<MDApiService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
        });
});

builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MDT" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAll");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<IsAuthMiddleware>();
app.UseMiddleware<AttachCurrentUserMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
