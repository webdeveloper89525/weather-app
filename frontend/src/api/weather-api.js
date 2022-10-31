import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Api
const tagTypes = {
    WeatherData: "WeatherData",
};

export const WeatherApi = createApi({
    reducerPath: "WeatherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BASE_API_URL,
    }),
    tagTypes: [...Object.values(tagTypes)],
    endpoints: (builder) => ({
        // Weather Data APIs
        getWeatherData: builder.mutation({
            query: ({ params }) => ({
                url: `/api/v1/weather`,
                method: "GET",
                params: params,
            }),
            invalidatesTags: [tagTypes.WeatherData],
        }),
    }),
});
