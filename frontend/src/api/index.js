import { WeatherApi } from "./weather-api";

const Api = {
    ...WeatherApi,

    reducers: {
        [WeatherApi.reducerPath]: WeatherApi.reducer,
    },
    middlewares: [WeatherApi.middleware],
};

export default Api;
