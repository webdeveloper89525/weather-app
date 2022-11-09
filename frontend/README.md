# Weather API Application

## Requirement

-   Use the http://localhost:8080/api/v1/docs API.
-   The user should be able to input the cities in Australia
-   When the user clicks Show Weather Button then user can see the data for the weather for those cities which he inputed.

## Installation

-   Make sure node v16+
-   Run `yarn`

## Run app

### `yarn start`

### Build Docker command mannually

```
docker build --tag weather-frontend-react .
```

### Run Docker command mannually

```
docker run --publish 3000:3000 weather-frontend-react
```
