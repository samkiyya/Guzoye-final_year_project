/*eslint-disable react/prop-types*/

import GoogleMapReact from "google-map-react";
import { Paper, Typography, Box, useMediaQuery, Rating } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import mapStyles from "../../pages/MAP/mapStyles";
const MAP_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY;

const Map = ({
  coords,
  setCoords,
  setBounds,
  places,
  setChildClicked,
  weatherData,
}) => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box sx={{ height: "85vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: MAP_KEY,
        }}
        defaultCenter={coords}
        center={coords}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setCoords({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClicked(child)}
      >
        {places?.length > 0 &&
          places.map((place, i) => (
            <Box
              sx={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
                "&:hover": { zIndex: 2 },
              }}
              lat={Number(place.lat)}
              lng={Number(place.lng)}
              key={i}
            >
              {!matches ? (
                <LocationOnOutlinedIcon color="primary" fontSize="large" />
              ) : (
                <Paper
                  elevation={3}
                  sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100px",
                  }}
                >
                  <Typography
                    style={{ textAlign: "center" }}
                    variant="subtitle2"
                    gutterBottom
                  >
                    {place.name}
                  </Typography>
                  <img
                    alt={place.name}
                    style={{ cursor: "pointer" }}
                    src={
                      place.photo
                        ? place.photo.images.large.url
                        : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                    }
                  />
                  <Rating
                    name="read-only"
                    size="small"
                    value={Number(place.rating)}
                    readOnly
                  />
                </Paper>
              )}
            </Box>
          ))}
        {weatherData?.list?.length > 0 &&
          weatherData.list.map((data, i) => (
            <div key={i} data-lat={data.coord.lat} data-lng={data.coord.lon}>
              <img
                src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
                height="70px"
                alt="Weather Icon"
              />
            </div>
          ))}
      </GoogleMapReact>
    </Box>
  );
};

export default Map;
