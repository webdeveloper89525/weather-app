import { Grid, Stack } from '@mui/material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  TextField,
  Typography,
} from '@material-ui/core'
import { WeatherApi } from 'api/weather-api'
import { useState } from 'react'

const Weather = () => {
  const [getWeatherData] = WeatherApi.useGetWeatherDataMutation()
  const [cities, setCities] = useState([
    'Sydney',
    'Melbourne',
    'Adelaide',
    'CovidFreeCity',
  ])
  const [weathers, setWeathers] = useState([])
  const [showCity, setShowCity] = useState(undefined)

  const handleShowCity = (e) => {
    setShowCity(e.target.value)
  }

  const handleAddCity = () => {
    if (showCity) {
      if (!cities.includes(showCity)) {
        const _cities = [...cities]
        _cities.push(showCity)
        setCities([..._cities])
        setShowCity(undefined)
      }
    }
  }

  const handleDeleteCity = (index) => {
    const _cities = [...cities]
    _cities.splice(index, 1)
    setCities([..._cities])
  }

  const handleShowWeather = () => {
    let params = ''
    if (!cities?.length > 0) {
      alert('There is no selected cities')
      return
    } else {
      cities.forEach((city, idx) => {
        params += idx === 0 ? 'cities=' + city : '&cities=' + city
      })
    }
    getWeatherData({ params })
      .then((res) => {
        if (res?.data) {
          setWeathers(res.data)
        }
      })
      .catch((err) => {
        console.log('There is an error to catch the weathers', err)
      })
  }

  const WeatherList = () => {
    if (weathers.length === 0) {
      return (
        <Typography color="error" style={{ textAlign: 'center' }} variant="h5">
          No available weathers
        </Typography>
      )
    }

    return (
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {weathers.map((weather, id) => {
          const {
            code,
            name,
            summary,
            temp,
            feels_temp,
            pressure,
            humidity,
            feels_like,
          } = weather
          return (
            <Card key={id} variant="outlined" animation="wave">
              <CardHeader title={name} style={{ background: '#7f7fa0' }} />
              <CardContent>
                {code !== 200 ? (
                  <Grid container spacing={2}>
                    <Grid item md={12} xs={12}>
                      <Box>
                        <Typography
                          color="textPrimary"
                          variant="subtitle1"
                          style={{ textAlign: 'center' }}
                        >
                          Not available city
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item md={8} xs={12}>
                      <Box>
                        <Typography color="textPrimary" variant="subtitle1">
                          {summary}
                        </Typography>
                        <Typography color="textPrimary" variant="subtitle2">
                          Temperature: {temp} Kelvin
                        </Typography>
                        <Typography color="textPrimary" variant="subtitle2">
                          {feels_like}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Box style={{ textAlign: 'right' }}>
                        <Typography color="textPrimary" variant="subtitle2">
                          Feels Temperature: {feels_temp} Kelvin
                        </Typography>
                        <Typography color="textPrimary" variant="subtitle2">
                          Pressure: {pressure} hPa
                        </Typography>
                        <Typography color="textPrimary" variant="subtitle2">
                          Humidity: {humidity} %
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          )
        })}
      </Box>
    )
  }

  return (
    <Container>
      <Typography
        color="primary"
        variant="h3"
        style={{
          textAlign: 'center',
          paddingTop: '3rem',
          paddingBottom: '2rem',
        }}
      >
        Weather Data for Multiple Cities in Australia
      </Typography>
      <Grid container sx={{ py: 5 }} direction="column">
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <TextField
                id="city"
                label="City"
                variant="outlined"
                name="lat"
                style={{ width: '100%' }}
                type="string"
                value={showCity || ''}
                onChange={(e) => handleShowCity(e)}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                onClick={() => handleAddCity()}
                style={{ height: '100%' }}
              >
                Add City
              </Button>
            </Grid>
            <Grid item md={3} xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={() => handleShowWeather()}
                style={{ height: '100%' }}
              >
                Show Weather
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Stack direction="row" spacing={1}>
                {cities?.length > 0 &&
                  cities.map((city, index) => {
                    return (
                      <Chip
                        key={'chip' + index}
                        label={city}
                        variant="outlined"
                        color="primary"
                        onDelete={() => handleDeleteCity(index)}
                      />
                    )
                  })}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ maxWidth: '100%' }}>
          <Box style={{ marginTop: '3rem' }}>
            <Typography
              color="textPrimary"
              variant="h6"
              style={{ marginBottom: '0.5rem' }}
            >
              Weather List:
            </Typography>
            {WeatherList()}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
export default Weather
