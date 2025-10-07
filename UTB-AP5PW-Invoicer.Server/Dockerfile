# Na https://aka.ms/customizecontainer se dozvíte, jak si přizpůsobit kontejner ladění a jak Visual Studio používá tento dokument Dockerfile k sestavení vašich imagí pro rychlejší ladění.

# Tato fáze se používá při spuštění z VS v rychlém režimu (výchozí pro konfiguraci ladění).
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Tato fáze slouží k sestavení projektu služby.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS with-node
RUN apt-get update
RUN apt-get install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get -y install nodejs


FROM with-node AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["UTB-AP5PW-Invoicer.Server/UTB-AP5PW-Invoicer.Server.csproj", "UTB-AP5PW-Invoicer.Server/"]
COPY ["utb-ap5pw-invoicer.client/utb-ap5pw-invoicer.client.esproj", "utb-ap5pw-invoicer.client/"]
RUN dotnet restore "./UTB-AP5PW-Invoicer.Server/UTB-AP5PW-Invoicer.Server.csproj"
COPY . .
WORKDIR "/src/UTB-AP5PW-Invoicer.Server"
RUN dotnet build "./UTB-AP5PW-Invoicer.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Tato fáze slouží k publikování projektu služby, který se má zkopírovat do konečné fáze.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./UTB-AP5PW-Invoicer.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Tato fáze se používá v produkčním prostředí nebo při spuštění z VS v běžném režimu (výchozí, když se nepoužívá konfigurace ladění).
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UTB-AP5PW-Invoicer.Server.dll"]
