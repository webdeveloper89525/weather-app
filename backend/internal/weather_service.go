package internal

import (
	"go.uber.org/zap"

	"github.com/weather-app/backend/internal/client"
	"github.com/weather-app/backend/internal/config"
	"github.com/weather-app/backend/internal/handlers"
)

type WeatherService struct {
	GetWeather *handlers.GetWeatherHandler
}

func NewWeatherService(logger *zap.Logger, cfg *config.Config) WeatherService {
	c := client.ClientConfig(cfg)
	return WeatherService{
		GetWeather: &handlers.GetWeatherHandler{Logger: logger, Client: c},
	}
}
