package server

import (
	"github.com/weather-app/backend/internal"
)

func (s *Server) AttachRoutes(api internal.WeatherService) {
	// define routes here
	s.Handle("/api/v1/weather", api.GetCondition)
}
