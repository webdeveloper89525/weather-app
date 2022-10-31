import { PinballApi } from "./weather-api";

const Api = {
    ...PinballApi,

    reducers: {
        [PinballApi.reducerPath]: PinballApi.reducer,
    },
    middlewares: [PinballApi.middleware],
};

export default Api;
