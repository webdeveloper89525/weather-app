# Weather API for multiple cities

### Overview

This simple-weather project is a http server that provides an API to get the current weather data from the [Open Weather Map API](https://openweathermap.org/api) for Australia cities. Making a request with the name of cities in Australia returns the current weather in those area in JSON format.

### Pre-reqs

1. Recent version of Go (Golang) installed. [Download](https://go.dev/doc/install)
1. Need an API KEY [Sign-up](https://home.openweathermap.org/users/sign_up) and Subscribe for the Free [One-Call](https://api.openweathermap.org/data/2.5) service.

### Runing the application

1. Add the API KEY for openweathermap open api on .env file.

2. Run the

```sh
go run main.go
```

Examples:

['Sydney',Melbourne','Adelaide','CovidFreeCity']

```sh
[
    {
        "code": 200,
        "name": "Sydney",
        "summary": "Current weather: Clear (clear sky) in the area.",
        "temp": 287.42,
        "feels_temp": 287.15,
        "pressure": 1021,
        "humidity": 86,
        "feels_like": "Blazing Hot"
    },
    {
        "code": 200,
        "name": "Adelaide",
        "summary": "Current weather: Clear (clear sky) in the area.",
        "temp": 297.47,
        "feels_temp": 297,
        "pressure": 1010,
        "humidity": 40,
        "feels_like": "Blazing Hot"
    },
    {
        "code": 200,
        "name": "Melbourne",
        "summary": "Current weather: Clear (clear sky) in the area.",
        "temp": 289.08,
        "feels_temp": 288.87,
        "pressure": 1017,
        "humidity": 82,
        "feels_like": "Blazing Hot"
    },
    {
        "code": 404,
        "name": "CovidFreeCity",
        "summary": "city not found",
        "temp": null,
        "feels_temp": null,
        "pressure": 0,
        "humidity": 0,
        "feels_like": ""
    }
]
```

### Build Docker command mannually

```
docker build --tag weather-backend-go .
```

### Run Docker command mannually

```
docker run --publish 8080:8080 weather-backend-go
```
