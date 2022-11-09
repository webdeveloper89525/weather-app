import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Api
const tagTypes = {
  WeatherData: 'WeatherData',
}

export const WeatherApi = createApi({
  reducerPath: 'WeatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_API_URL,
  }),
  tagTypes: [...Object.values(tagTypes)],
  endpoints: (builder) => ({
    // Weather Data APIs
    getWeatherData: builder.mutation({
      query: ({ params }) => ({
        url: `/api/v1/weather?${params}`,
        method: 'GET',
        // params: params,
      }),
      invalidatesTags: [tagTypes.WeatherData],
    }),
  }),
})
