var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.UTB_AP5PW_Invoicer_Server>("utb-ap5pw-invoicer-server");

builder.Build().Run();
