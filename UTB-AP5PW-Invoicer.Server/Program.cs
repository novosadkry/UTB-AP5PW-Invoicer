using QuestPDF.Infrastructure;
using UTB_AP5PW_Invoicer.Server.Extensions;

namespace UTB_AP5PW_Invoicer.Server
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var builder = WebApplication.CreateBuilder(args);
            builder.AddServiceDefaults();

            builder.Services
                .AddDatabase(builder.Configuration)
                .AddConfigurationOptions(builder.Configuration)
                .AddControllers(builder.Configuration)
                .AddAuthentication(builder.Configuration)
                .AddServicesFromAssembly(builder.Configuration)
                .AddFeaturesFromAssembly(builder.Configuration)
                .AddSwaggerApi(builder.Configuration);

            var app = builder.Build();

            app.UseDatabase();
            app.MapDefaultEndpoints();

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

            app.Run();
        }
    }
}
