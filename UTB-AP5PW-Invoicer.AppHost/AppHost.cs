var builder = DistributedApplication.CreateBuilder(args);

var server = builder.AddProject<Projects.UTB_AP5PW_Invoicer_Server>("utb-ap5pw-invoicer-server")
    .WithExternalHttpEndpoints();

builder.AddNpmApp("utb-ap5pw-invoicer-client", "../UTB-AP5PW-Invoicer.Client")
    .WithReference(server)
    .WaitFor(server)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
