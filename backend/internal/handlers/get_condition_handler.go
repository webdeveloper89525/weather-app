package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"go.uber.org/zap"

	"github.com/weather-app/backend/internal/client"
	"github.com/weather-app/backend/internal/models"
)

type GetWeatherHandler struct {
	Client *client.OpenWeatherClient
	Logger *zap.Logger
}

func (h *GetWeatherHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
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

func (h *GetWeatherHandler) getWeatherData(logger *zap.Logger, p url.Values) (resp models.WeatherResponse, err error) {
	logger.Info("Get weather data", zap.Any("params", p))

	var (
		lat, lon string
	)

	if lat = p.Get("lat"); lat == "" {
		return resp, fmt.Errorf("lat query param is required")
	}

	if lon = p.Get("lon"); lon == "" {
		return resp, fmt.Errorf("lon query param is required")
	}

	res, err := h.Client.GetClientWeather(lat, lon)
	if err != nil {
		return resp, fmt.Errorf("do request failed : %w", err)
	}

	body, err := io.ReadAll(res.Body)
	defer res.Body.Close()

	var openData models.OpenWeatherOneCallResponse

	err = json.Unmarshal(body, &openData)
	if err != nil {
		logger.Error("Raw weather response", zap.Any("body", string(body)))
		return resp, fmt.Errorf("failed to unmarshal open weather data: %w", err)
	}

	if openData.Code != 200 {
		rawRes := string(body)
		logger.Error("Bad response from open api", zap.Any("body", rawRes))
		return resp, fmt.Errorf("request failed: %s", rawRes)
	}

	logger.Info("Weather data", zap.Any("raw", string(body)))

	return h.getWeatherResponse(openData), nil
}

func (h *GetWeatherHandler) getWeatherResponse(data models.OpenWeatherOneCallResponse) models.WeatherResponse {
	return models.WeatherResponse{
		Summary:   h.getSummaryDescription(*data.Weather[0]),
		Temp:      data.Current.Temp,
		FeelsTemp: data.Current.FeelsLike,
		FeelsLike: h.getTempDescription(*data.Current.FeelsLike),
	}
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
