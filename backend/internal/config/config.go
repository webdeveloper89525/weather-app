package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	APIKey   string
	Endpoint string
	Exclude  string
	Unit     string
}

func ConfigEnv() (*Config, error) {
	cfg := &Config{}

	err := godotenv.Load(".env")
	if err != nil {
		return cfg, fmt.Errorf("Error loading .env file")
	}

	cfg.APIKey = os.Getenv("API_KEY")
	if cfg.APIKey == "" {
		return cfg, fmt.Errorf("API_KEY is missing.")
	}

	cfg.Endpoint = os.Getenv("ENDPOINT")
	if cfg.Endpoint == "" {
		return cfg, fmt.Errorf("ENDPOINT is missing.")
	}

	cfg.Exclude = "minutely,hourly,daily" // default
	cfg.Unit = "imperial"                 // default

	return cfg, nil
}
