// ** React Imports
import { useContext, useState } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import UserProfileHeader from "./UserProfileHeader";
import Geocode from "react-geocode";
import { useFormik } from "formik";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import GoogleApiWrapper from "../../../utils/GoogleMap/index";

Geocode.setApiKey("AIzaSyAcu4ueqc4kggYK5Uhu5OKQ1iEjIYAfwXc");
Geocode.setLanguage("en");

const Profile = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const formik = useFormik({
    initialValues: {
      fullname: "",
      designation: "",
      email: "",
      mobile: "",
      alternateMobile: "",
      currentLocation: "",
      aboutMe: "",
      jobTitle: "",
      jobCategory: null,
      jobSubCategory: null,
      skills: [],
      experiance: "",
      jobType: "",
      companyType: "",
      noticePeriod: "",
      shortDescription: "",
      location: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      state: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
    //  validationSchema: SignUpValidationSchema,
    onSubmit: async (values) => {
      const params = {
        first_name: values.firstName,
        last_name: values.lastName,
        designation: values.designation,
        email: values.email,
        country_code: values.code,
        phone: values.phone,
        company_name: values.corporateName,
        country_of_incorporation: values.registration,
        tax_id: values.taxId,
        website: values.url,
        address: values.address,
        address_line_one: values.addressLineOne,
        address_line_two: values.addressLineTwo,
        country: values.country,
        state: values.state,
        city: values.city,
        postal_code: values.postalCode,
        latitude: values.latitude,
        longitude: values.longitude,
        password: values.password,
        primary_industry: values.primaryIndustry,
        user_type: "individual",
        source: "dashboard",
        role: "PARTNER_ADMIN",
      };
    },
  });
  function getLatLngByAddress(address) {
    Geocode.fromAddress(address).then(
      (response) => {
        let address_components = response.results[0].address_components;
        let formatted_address = response.results[0].formatted_address;
        if (formatted_address) {
          let formatted_address_split = formatted_address.match(/[^,]+,[^,]+/g);
          formik.setFieldValue(
            "addressLineOne",
            `${formatted_address_split[0]}`
          );
          formatted_address_split.shift();
          formik.setFieldValue(
            "addressLineTwo",
            formatted_address_split?.join(" ")
          );
        }
        setAddressFieldValue(address_components, "country", "country");
        setAddressFieldValue(
          address_components,
          "administrative_area_level_1",
          "state"
        );
        setAddressFieldValue(
          address_components,
          "administrative_area_level_3",
          "city"
        );
        if (formik.values.registration !== "Ghana") {
          setAddressFieldValue(address_components, "postal_code", "postalCode");
        }
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        formik.setFieldValue("longitude", String(lng));
        formik.setFieldValue("latitude", String(lat));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  function setAddressFieldValue(address_components = [], key, field) {
    let findValue = address_components.find((item) => item.types.includes(key));
    if (findValue) {
      formik.setFieldValue(field, findValue?.long_name);
    } else {
      formik.setFieldValue(field, "");
    }
  }
  const { placePredictions, getPlacePredictions } = useGoogle({
    apiKey: "AIzaSyAcu4ueqc4kggYK5Uhu5OKQ1iEjIYAfwXc",
  });
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent
          //sx={{ display: "flex", justifyContent: "center", mx: 32, mt: 4 }}
          >
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Full Name"}
                  required
                  fullWidth
                  name="fullname"
                  error={
                    formik.touched.fullname && Boolean(formik.errors.fullname)
                  }
                  value={formik.values.fullname
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.fullname &&
                    formik.errors.fullname &&
                    formik.errors.fullname
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Designation"}
                  required
                  fullWidth
                  name="designation"
                  error={
                    formik.touched.designation &&
                    Boolean(formik.errors.designation)
                  }
                  value={formik.values.designation
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.designation &&
                    formik.errors.designation &&
                    formik.errors.designation
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Company Type *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.companyType}
                    label="Company Type *"
                    onChange={(e) =>
                      formik.setFieldValue("companyType", e.target.value)
                    }
                  >
                    <MenuItem value={"consultancy"}>Consultancy</MenuItem>
                    <MenuItem value={"individual"}>Individual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={6} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Email"}
                  required
                  fullWidth
                  disabled
                  name="email"
                  type="email"
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  value={formik.values.email
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.email &&
                    formik.errors.email &&
                    formik.errors.email
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Mobile Number"}
                  required
                  fullWidth
                  name="mobile"
                  disabled
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                  value={formik.values.mobile
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.mobile &&
                    formik.errors.mobile &&
                    formik.errors.mobile
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Alternate Mobile Number"}
                  fullWidth
                  name="alternateMobile"
                  error={
                    formik.touched.alternateMobile &&
                    Boolean(formik.errors.alternateMobile)
                  }
                  value={formik.values.alternateMobile
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.alternateMobile &&
                    formik.errors.alternateMobile &&
                    formik.errors.alternateMobile
                  }
                />
              </Grid>
            </Grid>
            <Grid>
              <Autocomplete
                id="location"
                name="location"
                label="Location*"
                variant="outlined"
                fullWidth
                sx={{ my: 2, mt: 4 }}
                value={formik.values.location}
                onChange={(event, item) => {
                  if (item) {
                    getLatLngByAddress(item?.description);

                    formik.setFieldValue("location", item?.label);
                  }
                }}
                onInputChange={(event) => {
                  if (event?.target?.value) {
                    getPlacePredictions({ input: event?.target?.value });
                  }
                }}
                options={placePredictions.map((item) => ({
                  ...item,
                  label: item.description,
                  value: item.place_id,
                }))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location *"
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                    helperText={
                      formik.touched.location &&
                      formik.errors.location &&
                      formik.errors.location
                    }
                  />
                )}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={6} sx={{ my: 2 }}>
                <Box
                  className="form-map form-item"
                  sx={{ height: "221px", position: "relative" }}
                >
                  <GoogleApiWrapper lat={lat} lng={lng} />
                </Box>
              </Grid>
            </Grid>
            <TextField
              id="addressLineOne"
              label="Address Line 1 (e.g. Street
            Name) *"
              variant={"outlined"}
              fullWidth
              sx={{ my: 2 }}
              name="addressLineOne"
              value={formik.values.addressLineOne}
              onChange={formik.handleChange}
              error={
                formik.touched.addressLineOne &&
                Boolean(formik.errors.addressLineOne)
              }
              helperText={
                formik.touched.addressLineOne &&
                formik.errors.addressLineOne &&
                formik.errors.addressLineOne
              }
            />
            <TextField
              id="addressLineTwo"
              label="Address Line 2 (e.g. Neighborhood/ Locality)"
              variant={"outlined"}
              fullWidth
              sx={{ my: 2 }}
              name="addressLineTwo"
              value={formik.values.addressLineTwo}
              onChange={formik.handleChange}
            />
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="country"
                  label="Country/Region *"
                  variant="outlined"
                  fullWidth
                  name="country"
                  value={formik.values.country}
                  onChange={(e) => {
                    //  formik.handleChange(e);
                    formik.setFieldValue(
                      "country",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={
                    formik.touched.country &&
                    formik.errors.country &&
                    formik.errors.country
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="state"
                  label="State/Province *"
                  variant="outlined"
                  fullWidth
                  name="state"
                  value={formik.values.state}
                  onChange={(e) => {
                    //  formik.handleChange(e);
                    formik.setFieldValue(
                      "state",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={
                    formik.touched.state &&
                    formik.errors.state &&
                    formik.errors.state
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="city"
                  label="City *"
                  variant="outlined"
                  fullWidth
                  name="city"
                  value={formik.values.city}
                  onChange={(e) => {
                    //  formik.handleChange(e);
                    formik.setFieldValue(
                      "city",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={
                    formik.touched.city &&
                    formik.errors.city &&
                    formik.errors.city
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="postalCode"
                  name="postalCode"
                  label="Post Code *"
                  variant="outlined"
                  fullWidth
                  value={formik.values.postalCode}
                  onChange={(e) => {
                    //  formik.handleChange(e);
                    if (formik.values.registration !== "Ghana") {
                      formik.setFieldValue(
                        "postalCode",
                        e.target?.value?.trimStart().replace(/\s\s+/g, "")
                      );
                    }
                  }}
                  error={
                    formik.touched.postalCode &&
                    Boolean(formik.errors.postalCode)
                  }
                  helperText={
                    formik.touched.postalCode &&
                    formik.errors.postalCode &&
                    formik.errors.postalCode
                  }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="longitude"
                  name="longitude"
                  label="Longitude "
                  variant={"outlined"}
                  type="number"
                  fullWidth
                  value={formik.values.longitude}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "longitude",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.longitude && Boolean(formik.errors.longitude)
                  }
                  helperText={
                    formik.touched.longitude &&
                    formik.errors.longitude &&
                    formik.errors.longitude
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="latitude"
                  name="latitude"
                  label="Latitude "
                  variant={"outlined"}
                  type="number"
                  fullWidth
                  value={formik.values.latitude}
                  onChange={(e) => {
                    setLat(e.target.value);
                    formik.setFieldValue(
                      "latitude",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.latitude && Boolean(formik.errors.latitude)
                  }
                  helperText={
                    formik.touched.latitude &&
                    formik.errors.latitude &&
                    formik.errors.latitude
                  }
                />
              </Grid>
            </Grid>
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <LoadingButton fullWidth variant="contained">
                Save
              </LoadingButton>
            </Grid>
            {/* <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Current Location *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.currentLocation}
                    label="Current Location *"
                    onChange={(e) =>
                      formik.setFieldValue("location", e.target.value)
                    }
                  >
                    <MenuItem value={0}>Chennai</MenuItem>
                    <MenuItem value={15}>Delhi</MenuItem>
                    <MenuItem value={30}>Mumbai</MenuItem>
                    <MenuItem value={90}>Bangalore</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
{/* 
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <LoadingButton fullWidth variant="contained">
                  Save
                </LoadingButton>
              </Grid> *
            </Grid> */}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
Profile.acl = {
  action: "read",
  subject: "profile",
};

export default Profile;
