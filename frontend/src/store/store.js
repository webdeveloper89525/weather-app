import { configureStore } from "@reduxjs/toolkit";

import SettingReducer, { initSetting } from "./setting-reducer";
import api from "api";

const reducer = {
    settings: SettingReducer,
    ...api.reducers,
};

const preloadedState = {
    settings: initSetting,
};

const apiMiddlewares = api.middlewares;

const store = configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiMiddlewares),
});

export default store;
