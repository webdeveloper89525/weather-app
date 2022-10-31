import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid } from "@mui/material";
import { Box, Button, Card, CardContent, CardHeader, Container, Link, TextField, Typography } from "@material-ui/core";
import { PinballApi } from "api/weather-api";
import { Language, Phone } from "@material-ui/icons";
import { LoadingButton } from "@mui/lab";

const Pinball = () => {
    const [getLocations] = PinballApi.useGetClosetLocationsMutation();

    const formik = useFormik({
        initialValues: {
            lat: 0,
            lon: 0,
            locations: [],
            error: null,
            loading: false,
        },
        validationSchema: Yup.object().shape({
            lat: Yup.number()
                .min(-180, "Latitude should be larger than -180")
                .max(180, "Latitude should be smaller than 180")
                .required("Latitude is required"),
            lon: Yup.number()
                .min(-180, "Longitude should be larger than -180")
                .max(180, "Longitude should be smaller than 180")
                .required("Longitude is required"),
        }),
        onSubmit: async (values, _helpers) => {
            formik.setFieldValue("loading", true);
            const params = {
                lat: values.lat,
                lon: values.lon,
                send_all_within_distance: true,
            };
            getLocations({ params })
                .then((res) => {
                    if (res.data.errors) {
                        formik.setFieldValue("error", res.data.errors);
                        formik.setFieldValue("locations", []);
                    } else {
                        formik.setFieldValue("error", res.data.errors);
                        formik.setFieldValue("locations", res.data.locations);
                    }
                })
                .catch((err) => {
                    formik.setFieldValue("error", err);
                    formik.setFieldValue("locations", []);
                })
                .finally(() => {
                    formik.setFieldValue("loading", false);
                });
        },
    });

    const handleNearMe = () => {
        const successCallback = (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            formik.setFieldValue("lat", lat);
            formik.setFieldValue("lon", lon);
        };
        const errorCallback = (error) => {
            console.log(error);
        };
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

    const locationList = () => {
        if (formik.values.error) {
            return (
                <Typography
                    color="error"
                    style={{ textAlign: "center", marginTop: "3rem" }}
                    variant="h3"
                >
                    {formik.values.error}
                </Typography>
            );
        }

        const locations = formik.values.locations;

        if (locations.length === 0) {
            return (
                <Typography
                    color="error"
                    style={{ textAlign: "center" }}
                    variant="h5"
                >
                    No available locations
                </Typography>
            );
        }

        return (
            <Box style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {locations.map((location) => {
                    const {
                        id,
                        name,
                        street,
                        city,
                        state,
                        zip,
                        phone,
                        lat,
                        lon,
                        distance,
                        num_machines,
                        machine_names,
                        description,
                        website,
                    } = location;
                    return (
                        <Card
                            key={id}
                            variant="outlined"
                            animation="wave"
                        >
                            <CardHeader
                                title={name}
                                style={{ background: "#7f7fa0" }}
                            />
                            <CardContent>
                                <Grid
                                    container
                                    spacing={2}
                                >
                                    <Grid
                                        item
                                        md={8}
                                        xs={12}
                                    >
                                        <Box>
                                            <Typography
                                                color="textPrimary"
                                                variant="subtitle1"
                                            >
                                                {description}
                                            </Typography>
                                            <Typography
                                                color="textPrimary"
                                                variant="subtitle2"
                                            >
                                                Machines({num_machines}):
                                            </Typography>
                                            {machine_names.map((name, idx) => {
                                                return (
                                                    <Typography
                                                        key={idx}
                                                        color="primary"
                                                        variant="subtitle2"
                                                        style={{ marginLeft: "5rem" }}
                                                    >
                                                        {name}
                                                    </Typography>
                                                );
                                            })}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        md={4}
                                        xs={12}
                                    >
                                        <Box style={{ textAlign: "right" }}>
                                            <Typography
                                                color="textPrimary"
                                                variant="subtitle2"
                                            >
                                                {street}, {city}, {state}, {zip}
                                            </Typography>
                                            <Typography
                                                color="textPrimary"
                                                variant="subtitle2"
                                            >
                                                {distance.toFixed(3)} miles ({lat}, {lon})
                                            </Typography>
                                            {phone && (
                                                <Box
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        gap: "0.2rem",
                                                    }}
                                                >
                                                    <Phone
                                                        color="action"
                                                        style={{ width: "1.1rem", height: "auto" }}
                                                    />
                                                    <Typography
                                                        color="textPrimary"
                                                        variant="subtitle2"
                                                    >
                                                        {phone}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {website && (
                                                <Box
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                        gap: "0.2rem",
                                                    }}
                                                >
                                                    <Language
                                                        color="action"
                                                        style={{ width: "1.1rem", height: "auto" }}
                                                    />
                                                    <Link
                                                        href={website}
                                                        variant="subtitle2"
                                                        color="textPrimary"
                                                        underline="always"
                                                        target="_blank"
                                                        rel="noopener"
                                                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                                                    >
                                                        {website}
                                                    </Link>
                                                </Box>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        );
    };

    return (
        <Container>
            <Typography
                color="primary"
                variant="h3"
                style={{ textAlign: "center", paddingTop: "3rem", paddingBottom: "2rem" }}
            >
                Pinball Locations Near Me
            </Typography>
            <Grid
                container
                sx={{ py: 5 }}
                direction="column"
            >
                <Grid
                    item
                    xs={12}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <TextField
                                id="latitude"
                                label="Latitude"
                                variant="outlined"
                                name="lat"
                                style={{ width: "100%" }}
                                type="number"
                                value={formik.values.lat}
                                error={formik.errors.lat}
                                helperText={formik.errors.lat}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <TextField
                                id="longitude"
                                label="Longitude"
                                variant="outlined"
                                name="lon"
                                style={{ width: "100%" }}
                                type="number"
                                value={formik.values.lon}
                                error={formik.errors.lon}
                                helperText={formik.errors.lon}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={12}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                onClick={() => handleNearMe()}
                                style={{ height: "100%" }}
                            >
                                Near Me
                            </Button>
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={12}
                        >
                            <LoadingButton
                                variant="contained"
                                color="secondary"
                                size="large"
                                fullWidth
                                onClick={() => formik.handleSubmit()}
                                style={{ height: "100%", textTransform: "capitalize" }}
                                loading={formik.values.loading}
                            >
                                Search
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    style={{ maxWidth: "100%" }}
                >
                    <Box style={{ marginTop: "3rem" }}>
                        <Typography
                            color="textPrimary"
                            variant="h6"
                            style={{ marginBottom: "0.5rem" }}
                        >
                            Location List:
                        </Typography>
                        {locationList()}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};
export default Pinball;
