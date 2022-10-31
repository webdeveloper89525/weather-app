package main

import (
	"go.uber.org/zap"

	"github.com/weather-app/backend/internal"
	"github.com/weather-app/backend/internal/config"
	"github.com/weather-app/backend/internal/server"
)

func main() {
	logger, _ := zap.NewProduction()
	logger.Info("Init Weather-app Backend.")

	cfg, err := config.ConfigEnv()
	if err != nil {
		logger.Fatal("failed to load config", zap.Error(err))
	}

	api := internal.NewWeatherService(logger, cfg)

	srv := server.ServerConfig(api)

	srv.Start()

	logger.Info("Weather-app Backend Started.")
}
