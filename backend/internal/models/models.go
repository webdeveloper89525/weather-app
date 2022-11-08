package models

type WeatherResponse struct {
	Code      interface{} `json:"code"`
	Name      string      `json:"name"`
	Summary   string      `json:"summary"`
	Temp      *float64    `json:"temp"`
	FeelsTemp *float64    `json:"feels_temp"`
	Pressure  int         `json:"pressure"`
	Humidity  int         `json:"humidity"`
	FeelsLike string      `json:"feels_like"`
}

type OpenWeatherOneCallResponse struct {
	Code     interface{}    `json:"cod"` // present on error
	Name     string         `json:"name"`
	Lat      float64        `json:"lat"`
	Lon      float64        `json:"lon"`
	Timezone float64        `json:"timezone"`
	Message  string         `json:"message"`
	Current  CurrentWeather `json:"main"`
	Weather  []*WeatherItem `json:"weather"`
}

type CurrentWeather struct {
	Temp      *float64 `json:"temp"`
	FeelsLike *float64 `json:"feels_like"`
	TempMin   *float64 `json:"temp_min"`
	TempMax   *float64 `json:"temp_max"`
	Pressure  int      `json:"pressure"`
	Humidity  int      `json:"humidity"`
}

type WeatherItem struct {
	ID          int    `json:"id"`
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}
