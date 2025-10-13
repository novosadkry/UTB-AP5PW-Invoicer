FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["UTB-AP5PW-Invoicer.Server/UTB-AP5PW-Invoicer.Server.csproj", "UTB-AP5PW-Invoicer.Server/"]
COPY ["UTB-AP5PW-Invoicer.Client/UTB-AP5PW-Invoicer.Client.esproj", "UTB-AP5PW-Invoicer.Client/"]
RUN dotnet restore "./UTB-AP5PW-Invoicer.Server/UTB-AP5PW-Invoicer.Server.csproj"
COPY . .
WORKDIR "/src/UTB-AP5PW-Invoicer.Server"
RUN dotnet build "./UTB-AP5PW-Invoicer.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./UTB-AP5PW-Invoicer.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UTB-AP5PW-Invoicer.Server.dll"]
