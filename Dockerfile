FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["BackEnd/TicketBooking.API/TicketBooking.API.csproj", "BackEnd/TicketBooking.API/"]
COPY ["BackEnd/TicketBooking.Application/TicketBooking.Application.csproj", "BackEnd/TicketBooking.Application/"]
COPY ["BackEnd/TicketBooking.Domain/TicketBooking.Domain.csproj", "BackEnd/TicketBooking.Domain/"]
COPY ["BackEnd/TicketBooking.Infrastructure/TicketBooking.Infrastructure.csproj", "BackEnd/TicketBooking.Infrastructure/"]
RUN dotnet restore "BackEnd/TicketBooking.API/TicketBooking.API.csproj"

# Copy everything else and build
COPY BackEnd/ ./BackEnd/
WORKDIR "/src/BackEnd/TicketBooking.API"
RUN dotnet build "TicketBooking.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TicketBooking.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TicketBooking.API.dll"]
