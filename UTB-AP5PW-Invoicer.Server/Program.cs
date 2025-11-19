using Microsoft.AspNetCore.Mvc.ApplicationModels;
using UTB_AP5PW_Invoicer.Server.Extensions;
using UTB_AP5PW_Invoicer.Server.Utilities;

namespace UTB_AP5PW_Invoicer.Server
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.AddServiceDefaults();

            builder.Services
                .AddDatabase(builder.Configuration)
                .AddConfigurationOptions(builder.Configuration)
                .AddAuthentication(builder.Configuration)
                .AddServicesFromAssembly(builder.Configuration)
                .AddFeaturesFromAssembly(builder.Configuration)
                .AddSwaggerApi(builder.Configuration);

            builder.Services.AddControllers(options =>
            {
                options.Conventions.Add(
                    new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            });

            var app = builder.Build();

            app.UseDatabase();
            app.MapDefaultEndpoints();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();

                app.MapOpenApi();
                app.MapSwagger();
            }

            app.UseCors();
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
