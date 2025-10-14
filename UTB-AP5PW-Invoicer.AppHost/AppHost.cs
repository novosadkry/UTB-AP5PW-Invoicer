var builder = DistributedApplication.CreateBuilder(args);

var database = builder.AddPostgres("utb-ap5pw-invoicer-db")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithPgAdmin()
    .AddDatabase("utb-ap5pw-invoicer");

var server = builder.AddProject<Projects.UTB_AP5PW_Invoicer_Server>("utb-ap5pw-invoicer-server")
    .WithReference(database)
    .WaitFor(database)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddNpmApp("utb-ap5pw-invoicer-client", "../UTB-AP5PW-Invoicer.Client")
    .WithReference(server)
    .WaitFor(server)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
