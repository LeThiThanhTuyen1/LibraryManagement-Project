using Newtonsoft.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using LibraryManagementAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<LibraryManagementAPIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Thêm cấu hình từ user-secrets
builder.Configuration.AddUserSecrets<Program>();

// Enable CORS với cấu hình mở rộng
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
    {
        builder
            .WithOrigins(
                "http://localhost:4200",     // Angular development server
                "https://view.officeapps.live.com", // Microsoft Office Online Viewer
                "https://*.officeapps.live.com"     // Các subdomain của Office Online Viewer
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowedToAllowWildcardSubdomains() // Cho phép wildcard subdomain
            .WithExposedHeaders("Content-Disposition") // Cho phép header tải file
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache CORS preflight
    });
});

// JSON serializer
builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<IISServerOptions>(options =>
{
    options.AllowSynchronousIO = true; // Cho phép đồng bộ IO cho việc tải file
    options.MaxRequestBodySize = 52428800; // Tăng giới hạn kích thước file (50MB)
});

var app = builder.Build();

// Use CORS - đặt trước các middleware khác
app.UseCors("AllowOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Thêm middleware để xử lý các file tĩnh
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Thêm header CORS cho file tĩnh
        ctx.Context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        // Cache file tĩnh trong 1 giờ
        ctx.Context.Response.Headers.Add("Cache-Control", "public,max-age=3600");
    }
});

app.UseRouting();
app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();  
});

app.Run();
