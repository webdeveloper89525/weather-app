package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sync"

	"go.uber.org/zap"

	"github.com/weather-app/backend/internal/client"
	"github.com/weather-app/backend/internal/models"
)

type GetWeatherHandler struct {
	Client *client.OpenWeatherClient
	Logger *zap.Logger
}

func (h *GetWeatherHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	(w).Header().Set("Access-Control-Allow-Origin", "*")

	logger := h.Logger.Named("Get weather handler - serveHTTP")
	logger.Info("Request received")

	params := req.URL.Query()
	enc := json.NewEncoder(w)

	res, err := h.getWeatherData(h.Logger, params)
	if err != nil {
		logger.Error("Failed to get weather data", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		err = enc.Encode("Server Error")
		if err != nil {
			logger.Error("Failed to encode json response")
		}
		return
	}

	err = enc.Encode(res)
	if err != nil {
		logger.Error("Failed to encode json response")
	}
	logger.Info("Success", zap.Any("Response", res))

	return
}

func (h *GetWeatherHandler) getWeatherData(logger *zap.Logger, p url.Values) (resp []models.WeatherResponse, err error) {
	logger.Info("Get weather data", zap.Any("params", p))

	var cities []string

	if cities = p["cities"]; len(cities) == 0 {
		return resp, fmt.Errorf("cities query param is required")
	}

	resArr := []*models.OpenWeatherOneCallResponse{}
	wg := sync.WaitGroup{}
	for _, val := range cities {
		wg.Add(1)
		go func(val string) {
			var openData models.OpenWeatherOneCallResponse

			res, err := h.Client.GetClientWeather(val)
			if err != nil {
				openData = models.OpenWeatherOneCallResponse{
					Code:    404,
					Message: "Bad Request for the city " + val,
					Name:    val,
				}
			} else {
				decoder := json.NewDecoder(res.Body)
				defer res.Body.Close()

				err = decoder.Decode(&openData)
				if err != nil {
					fmt.Println(err)
					openData = models.OpenWeatherOneCallResponse{
						Code:    404,
						Message: "Failed to parse Response for the city " + val,
						Name:    val,
					}
				}

				if openData.Name == "" {
					openData.Name = val
				}
			}

			resArr = append(resArr, &openData)

			wg.Done()
		}(val)
	}

	wg.Wait()

	return h.getWeatherResponses(resArr), nil
}

func (h *GetWeatherHandler) getWeatherResponses(data []*models.OpenWeatherOneCallResponse) []models.WeatherResponse {
	if len(data) == 0 {
		return nil
	}
	weatherRes := []models.WeatherResponse{}
	for _, val := range data {
		if len(val.Weather) != 0 {
			weatherRes = append(weatherRes, models.WeatherResponse{
				Code:      val.Code,
				Name:      val.Name,
				Summary:   h.getSummaryDescription(*val.Weather[0]),
				Temp:      val.Current.Temp,
				FeelsTemp: val.Current.FeelsLike,
				Pressure:  val.Current.Pressure,
				Humidity:  val.Current.Humidity,
				FeelsLike: h.getTempDescription(*val.Current.FeelsLike),
			})
		} else {
			var codeRes int
			if intCode, ok := val.Code.(int); !ok {
				codeRes = 404
			} else {
				codeRes = intCode
			}
			weatherRes = append(weatherRes, models.WeatherResponse{
				Code:    codeRes,
				Name:    val.Name,
				Summary: val.Message,
			})
		}
	}

	return weatherRes
}

func (h *GetWeatherHandler) getSummaryDescription(weather models.WeatherItem) string {
	return fmt.Sprintf("Current weather: %s (%s) in the area.", weather.Main, weather.Description)
}

func (h *GetWeatherHandler) getTempDescription(feelsTemp float64) string {
	var tempDesc string
	if feelsTemp <= float64(32) {
		tempDesc = "Freezing Cold"
	} else if feelsTemp < float64(60) {
		tempDesc = "Cold"
	} else if feelsTemp < float64(67) {
		tempDesc = "Cool"
	} else if feelsTemp < float64(75) {
		tempDesc = "Moderate"
	} else if feelsTemp < float64(85) {
		tempDesc = "Warm"
	} else if feelsTemp < float64(90) {
		tempDesc = "Hot"
	} else if feelsTemp < float64(97) {
		tempDesc = "Hot"
	} else {
		tempDesc = "Blazing Hot"
	}

	return tempDesc
}
