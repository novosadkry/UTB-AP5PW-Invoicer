using System.Reflection;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Infrastructure.Configuration;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Server.Extensions
{
    public static class ServicesExtensions
    {
        public static IServiceCollection AddFeaturesFromAssembly(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            return services
                .AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<IService>())
                .AddAutoMapper(cfg => cfg.AddMaps(typeof(IService).Assembly))
                .AddFluentValidationAutoValidation()
                .AddValidatorsFromAssemblyContaining<IService>()
                .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        }

        public static IServiceCollection AddServicesFromAssembly(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            return services.Scan(scan =>
                scan.FromAssemblyOf<IService>()
                    .AddClasses(classes => classes.AssignableTo<IService>())
                    .AsImplementedInterfaces()
                    .WithScopedLifetime());
        }

        public static IServiceCollection AddAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var jwtOptions = configuration.GetSection("JwtSettings").Get<JwtOptions>();

            if (string.IsNullOrEmpty(jwtOptions?.SecretKey))
                throw new InvalidOperationException("SecretKey is not configured in JwtSettings.");

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtOptions.SecretKey))
                    };
                });

            services.AddAuthorizationBuilder()
                .AddPolicy(JwtBearerDefaults.AuthenticationScheme, policy =>
                    policy.RequireAuthenticatedUser());

            return services;
        }

        public static IServiceCollection AddConfigurationOptions(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.Configure<JwtOptions>(configuration.GetSection("JwtSettings"));

            return services;
        }

        public static IServiceCollection AddDatabase(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("utb-ap5pw-invoicer");

            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("Connection string 'utb-ap5pw-invoicer' not found.");

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            return services;
        }

        public static IServiceCollection AddSwaggerApi(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddEndpointsApiExplorer();
            services.AddOpenApi();

            services.AddSwaggerGen(options =>
            {
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT",
                    Type = SecuritySchemeType.Http,
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };

                options.AddSecurityDefinition("Bearer", securityScheme);
                options.AddSecurityRequirement(new OpenApiSecurityRequirement { { securityScheme, [] } });
            });

            return services;
        }
    }
}
