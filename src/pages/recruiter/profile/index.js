// ** React Imports
import { useContext, useEffect, useState } from "react";

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
import { useSelector } from "react-redux";
import { updateProfile } from "src/api-services/recruiter/profile";
import useNotification from "src/hooks/useNotification";
import * as yup from "yup";

Geocode.setApiKey(process.env.REACT_APP_GMAP_API_KEY);
Geocode.setLanguage("en");

const Profile = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const [sendNotification] = useNotification();

  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  // console.log("gmpa", process.env.REACT_APP_GMAP_API_KEY);

  const validationSchema = yup.object({
    jobTitle: yup
      .string("Job Title is required")
      .trim()
      .required("Job Title is required")
      .min(10, "Minimum 10 character required"),
    companyName: yup
      .string("Company Name is required")
      .trim()
      .required("Company Name is required"),
    fullname: yup
      .string("Full Name is required")
      .trim()
      .required("Full Name is required"),
    designation: yup
      .string("Designation is required")
      .trim()
      .required("Designation is required"),

    addressLineOne: yup
      .string("Address Line 1 is required")
      .trim()
      .required("Address Line 1 is required"),
    email: yup
      .string("Email is Required")
      .email("Enter the valid email")
      .trim()
      .required("Email is Required"),

    location: yup
      .string("Location is required")
      .required("Location is required"),
    city: yup.string("City is required").trim().required("City is required"),
    state: yup.string("State is required").trim().required("State is required"),
    country: yup
      .string("Country is required")
      .trim()
      .required("Country is required"),
    postalCode: yup
      .string("Postal Code is required")
      .trim()
      .required("Postal Code is required"),

    companyType: yup
      .string("Company Type is required")
      .required("Company Type is required"),
  });
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
      companyName: "",
      companyType: "",
      noticePeriod: "",
      shortDescription: "",
      location: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      country: "",
      state: "",
      postalCode: "",
      latitude: "",
      longitude: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const params = {
        full_name: values.fullname,
        designation: values.designation,
        company_name: values.companyName,
        designation: values.designation,
        phone: values.mobile,
        alternate_mobile: alternateMobile,

        company_type: values.companyType,
        address: values.location,
        address_line_one: values.addressLineOne,
        address_line_two: values.addressLineTwo,
        city: values.city,
        state: values.state,
        country: values.country,
        postal_code: values.postalCode,
        latitude: values.latitude,
        longitude: values.longitude,
      };
      console.log(params);

      try {
        setIsLoading(true);
        const result = await updateProfile(params);
        sendNotification({
          message: result?.data?.message,
          variant: "success",
        });
      } catch (e) {
        sendNotification({
          message: e,
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
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
    apiKey: process.env.REACT_APP_GMAP_API_KEY,
  });

  useEffect(() => {
    console.log("user", userData);
    if (userData) {
      formik.setFieldValue("fullname", userData?.full_name);
      formik.setFieldValue(
        "designation",
        userData?.recruiterDetails?.designation
      );
      formik.setFieldValue("mobile", userData?.phone);
      formik.setFieldValue("email", userData?.email);
      formik.setFieldValue("location", userData?.recruiterDetails?.address);
      formik.setFieldValue(
        "companyName",
        userData?.recruiterDetails?.company_name
      );
      formik.setFieldValue(
        "companyType",
        userData?.recruiterDetails?.company_type
      );

      formik.setFieldValue(
        "addressLineOne",
        userData?.recruiterDetails?.address_line_one
      );

      formik.setFieldValue(
        "addressLineTwo",
        userData?.recruiterDetails?.address_line_two
      );
      formik.setFieldValue("country", userData?.recruiterDetails?.country);
      formik.setFieldValue("state", userData?.recruiterDetails?.state);
      formik.setFieldValue("city", userData?.recruiterDetails?.city);
      formik.setFieldValue(
        "postalCode",
        userData?.recruiterDetails?.postal_code
      );
      formik.setFieldValue("longitude", userData?.recruiterDetails?.longitude);
      formik.setFieldValue("latitude", userData?.recruiterDetails?.latitude);
      setLat(userData?.recruiterDetails?.latitude);
      setLng(userData?.recruiterDetails?.longitude);
    }
  }, [userData, isEdit]);
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader
          userData={userData}
          handleEdit={handleEdit}
          isEdit={isEdit}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent
          //sx={{ display: "flex", justifyContent: "center", mx: 32, mt: 4 }}
          >
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <TextField
                sx={{ mb: 2 }}
                label={"Full Name"}
                disabled={!isEdit}
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
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Company Name"}
                  disabled={!isEdit}
                  required
                  fullWidth
                  name="companyName"
                  error={
                    formik.touched.companyName &&
                    Boolean(formik.errors.companyName)
                  }
                  value={formik.values.companyName
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  helperText={
                    formik.touched.companyName &&
                    formik.errors.companyName &&
                    formik.errors.companyName
                  }
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  disabled={!isEdit}
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
                <FormControl fullWidth disabled={!isEdit}>
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
                  disabled={!isEdit}
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
                disabled={!isEdit}
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
              label="Address Line 1 (e.g. House No. Street
            Name) *"
              variant={"outlined"}
              disabled={!isEdit}
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
              label="Address Line 2 (e.g. Landmark/ Locality)"
              variant={"outlined"}
              disabled={!isEdit}
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
                  label="Country *"
                  variant="outlined"
                  disabled={!isEdit}
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
                  label="State *"
                  variant="outlined"
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
                  label="Postal Code *"
                  variant="outlined"
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
                  disabled={!isEdit}
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
              <LoadingButton
                fullWidth
                loading={isLoading}
                variant="contained"
                sx={{ my: 4 }}
                disabled={!isEdit}
                onClick={() => formik.handleSubmit()}
              >
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
