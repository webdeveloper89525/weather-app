package server

import (
	"log"
	"net/http"

	"github.com/weather-app/backend/internal"
)

type Server struct {
	*http.ServeMux
}

func ServerConfig(api internal.WeatherService) *Server {
	srv := &Server{
		http.NewServeMux(),
	}
	srv.AttachRoutes(api)
	return srv

}

func (s *Server) Start() {
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", s))
}
