# weather-app

## How to Run

```
docker-compose up
```

## Description

1. For getting the weather data in Australia this app used openweathermap.org open API.

-   https://openweathermap.org/api

2. For frontend the default cities is `['Sydney', 'Melbourne', 'Adelaide', 'CovidFreeCity']`

3. In the Frontend side user can add the new cities in Australia and see the weather data for those cities.

4. For availabile running backend and frontend is containerized and the app running is run by the command `docker-compose up`

## Backend

1. In the Backend golang v1.19.0 is used.
2. In the Backend for using the openweathermap.org api first sign up to the https://openweathermap.org/ website and get the API KEY for using the Open API.
3. The structure of the backend is as the below.

###

    .
    ├── internal                   # Compiled files (alternatively `dist`)
        ├── client              # package for the client of Open API
        ├── config              # package for the config of the website
        ├── handlers            # package for the handlers for treating API controller
        ├── models              # package for the model for managing the request and response of the API
        ├── server              # package for the server of routing and server config
        ├── weather_service.go  # weather service
    ├── .env                    # Showing the environment files
    ├── Dockerfile              # containerize file
    ├── main.go                 # start file of the backend
    └── README.md

4. Treating the mutiple array from frontend side
5. Treating the error exception in the response of the weather open api.

## Frontend

1. Used the general react app.
2. Used the redux-store for managing the store variable
3. Used the reduxjs/toolkit for calling API request to the backend side.
4. Used Dockerfile for making the containerization
5. Used the Material UI for making the website beautiful.
6. Used styled-components for making the customized styles
7. Used formik and yup package for validation of the input.
8. Project structure

###

    .
    ├── src                     # project src
        ├── api
        ├── components
        ├── store
        ├── App.js
        ├── index.js
        ├── reportWebVitals.js
        ├── setupTests.js
        ├── theme.js
    ├── public                   # managing the image and styles
    ├── .env
    ├── jsconfig.json
    ├── package.json
    ├── README.md
    ├── Dockerfile

## Result

![plot](./result.png)

## Monitoring / Observability

> I have tried to use `prometheus/grafana` with docker. But in `docker-compose.yml` run pulling the prometheus and grafana is still failing. So I didn't succed to add them to the docker containerization.

So I would like to share my `docker-compose.yml` file which I tried to add `prometheus/grafana` in.

```
version: '3.9'
services:
    prometheus:
        image: prom/prometheus:latest
        container_name: prometheus
        ports:
            - 9090:9090
        volumes:
            - ./prometheus:/etc/prometheus
            - prometheus-data:/prometheus
        command: --web.enable-lifecycle  --config.file=/etc/prometheus/prometheus.yml

    grafana:
        image: grafana/grafana:latest
        ports:
            - '3000:3000'

    server:
        build: ./
        container_name: test-prometheus
        volumes:
            - .:/go/src/app
        ports:
            - "8080:8080"

volumes:
    prometheus-data:
    grafana-data:

networks:
    prometheus-network:
        driver: bridge
        name: prometheus-network
```

### The alternative for using observability and Monitoring

> Elastic APM.

Working with this the configuration of `docker-compose.yml` file for kibana, elasticsearch and apm-server is not configured correctly. So I think this method should be considered in the future again if we are going to use this method.
