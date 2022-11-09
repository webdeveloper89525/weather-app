FROM golang:1.19.0-alpine
RUN mkdir /app
ADD . /app
WORKDIR /app

COPY go.mod ./
COPY go.sum ./
## Add this go mod download command to pull in any dependencies
RUN go mod download

COPY *.go ./

## Our project will now successfully build with the necessary go libraries included.
RUN go build -o weather-backend-go
## Our start command which kicks off
## our newly created binary executable
# This container exposes port 8080 to the outside world
EXPOSE 8080

# Run the executable
CMD ["/app/weather-backend-go"]
