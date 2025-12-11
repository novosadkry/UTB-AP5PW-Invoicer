using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var database = builder.AddPostgres("utb-ap5pw-invoicer-db")
    .WithDataVolume()
    .AddDatabase("utb-ap5pw-invoicer");

var server = builder.AddProject<Projects.UTB_AP5PW_Invoicer_Server>("utb-ap5pw-invoicer-server")
    .WithReference(database)
    .WaitFor(database)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

if (builder.Environment.IsDevelopment())
{
    builder.AddNpmApp("utb-ap5pw-invoicer-client", "../UTB-AP5PW-Invoicer.Client")
        .WithReference(server)
        .WaitFor(server)
        .WithEnvironment("BROWSER", "none")
        .WithEnvironment("VITE_API_URL", server.GetEndpoint("https"))
        .WithHttpEndpoint(env: "VITE_PORT")
        .WithExternalHttpEndpoints()
        .PublishAsDockerFile();
}
else
{
    builder.AddDockerfile("utb-ap5pw-invoicer-client", "../UTB-AP5PW-Invoicer.Client")
        .WithReference(server)
        .WaitFor(server)
        .WithEnvironment("BROWSER", "none")
        .WithEnvironment("VITE_API_URL", server.GetEndpoint("https"))
        .WithHttpEndpoint(env: "VITE_PORT", targetPort: 80)
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
