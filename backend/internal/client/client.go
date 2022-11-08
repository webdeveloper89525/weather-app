package client

import (
	"fmt"
	"net/http"
	"time"

	"github.com/weather-app/backend/internal/config"
)

type HttpClientGet interface {
	Do(req *http.Request) (*http.Response, error)
}

type OpenWeatherClient struct {
	Config *config.Config
	Client HttpClientGet
}

func ClientConfig(cfg *config.Config) *OpenWeatherClient {
	c := &http.Client{
		Timeout: 3 * time.Second,
	}
	return &OpenWeatherClient{
		Config: cfg,
		Client: c,
	}
}

func (c *OpenWeatherClient) GetClientWeather(city string) (*http.Response, error) {
	req, err := http.NewRequest(http.MethodGet, c.Config.Endpoint+"/weather", nil)
	if err != nil {
		return nil, fmt.Errorf("failed build request: %w", err)
	}

	q := req.URL.Query()
	countryCode := "au"
	q.Add("q", city+","+countryCode)
	q.Add("appid", c.Config.APIKey)

	req.URL.RawQuery = q.Encode()

	return c.Client.Do(req)
}
