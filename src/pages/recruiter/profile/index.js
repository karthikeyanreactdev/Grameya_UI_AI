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
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "src/api-services/recruiter/profile";
import useNotification from "src/hooks/useNotification";
import * as yup from "yup";
import { getUserData } from "src/store/apps/auth";
import { makeStyles } from "@mui/styles";
Geocode.setApiKey(process.env.REACT_APP_GMAP_API_KEY);
Geocode.setLanguage("en");
const useStyles = makeStyles({
  root: {
    "& .MuiFormLabel-root.MuiInputBase-multiline .MuiInputLabel-root.Mui-disabled":
      {
        color: "black",
        opacity: 0.8,
      },
    "& .MuiFormLabel-root.MuiInputLabel-root.Mui-disabled": {
      color: "black",
      opacity: 0.8,
    },
    "& .MuiInputBase-input.MuiInputBase-inputMultiline.Mui-disabled": {
      // color: "black",
      "-webkit-text-fill-color": "black",
      opacity: 0.8,
    },
    // "& .MuiFormLabel-root.MuiInputLabel-root.Mui-disabled": {
    "& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled": {
      // color: "black",
      "-webkit-text-fill-color": "black",
      opacity: 0.8,
    },
  },
});
const linkRegMatch =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
//;
const Profile = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const classes = useStyles();
  const [sendNotification] = useNotification();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  // console.log("gmpa", process.env.REACT_APP_GMAP_API_KEY);

  const validationSchema = yup.object({
    // jobTitle: yup
    //   .string("Job Title is required")
    //   .trim()
    //   .required("Job Title is required")
    //   .min(10, "Minimum 10 character required"),
    companyName: yup
      .string("Company Name is required")
      .trim()
      .required("Company Name is required")
      .min(10, "Minimum 10 character required")
      .max(70, "Maximum 70 character only allowed"),
    fullname: yup
      .string("Full Name is required")
      .trim()
      .required("Full Name is required")
      .min(10, "Minimum 10 character required")
      .max(70, "Maximum 70 character only allowed"),
    designation: yup
      .string("Designation is required")
      .trim()
      .required("Designation is required")
      .min(10, "Minimum 10 character required")
      .max(50, "Maximum 50 character only allowed"),

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
    about_us: yup
      .string("")
      .trim()
      .min(10, "Minimum 10 character required")
      .max(500, "Maximum 500 character is allowed"),

    website: yup
      .string()
      .trim()
      .matches(linkRegMatch, "Website URL should be a valid URL")
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        "Enter correct Website URL"
      )
      .required("Website URL is required"),
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
      website: "",
      about_us: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const params = {
        full_name: values.fullname,
        designation: values.designation,
        company_name: values.companyName,
        designation: values.designation,
        phone: values.mobile,
        alternate_mobile: values.alternateMobile,

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
        website: values.website,
        about_us: values.about_us,
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
        dispatch(getUserData({}));
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

      formik.setFieldValue("website", userData?.recruiterDetails?.website);
      formik.setFieldValue("about_us", userData?.recruiterDetails?.about_us);
      setLat(userData?.recruiterDetails?.latitude);
      setLng(userData?.recruiterDetails?.longitude);
    }
  }, [userData, isEdit]);
  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  return (
    <Grid container spacing={6} className={classes.root}>
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
                //disabled={!isEdit}
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
                freeSolo={!isEdit}
                variant={!isEdit ? "standard" : "outlined"}
                InputProps={{
                  readOnly: !isEdit,
                  disableUnderline: !isEdit,
                }}
              />
            </Grid>
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Company Name"}
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                {isEdit ? (
                  <FormControl
                    fullWidth //disabled={!isEdit}
                  >
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
                ) : (
                  <TextField
                    sx={{ mb: 2 }}
                    //disabled={!isEdit}
                    label={" Company Type "}
                    required
                    fullWidth
                    name="companyType"
                    error={
                      formik.touched.companyType &&
                      Boolean(formik.errors.companyType)
                    }
                    value={formik.values.companyType
                      .trimStart()
                      .replace(/\s\s+/g, "")
                      .replace(/\p{Emoji_Presentation}/gu, "")}
                    onChange={(e) => formik.handleChange(e)}
                    helperText={
                      formik.touched.companyType &&
                      formik.errors.companyType &&
                      formik.errors.companyType
                    }
                    freeSolo={!isEdit}
                    variant={!isEdit ? "standard" : "outlined"}
                    InputProps={{
                      readOnly: !isEdit,
                      disableUnderline: !isEdit,
                    }}
                  />
                )}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Alternate Mobile Number"}
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  // sx={{ mb: 2 }}
                  id="website"
                  name="website"
                  label="Website "
                  // variant={"outlined"}
                  //disabled={!isEdit}
                  fullWidth
                  // size="small"
                  required
                  value={formik.values.website}
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "website",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.website && Boolean(formik.errors.website)
                  }
                  helperText={
                    formik.touched.website &&
                    formik.errors.website &&
                    formik.errors.website
                  }
                />
              </Grid>
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  // sx={{ mb: 2 }}
                  id="aboutus"
                  name="about_us"
                  label="About Us"
                  // variant={"outlined"}
                  //disabled={!isEdit}
                  fullWidth
                  multiline
                  minRows={!isEdit ? 1 : 3}
                  maxRows={3}
                  // size="small"
                  // required
                  value={formik.values.about_us}
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                  onChange={(e) => {
                    setLng(e.target.value);
                    formik.setFieldValue(
                      "about_us",
                      e.target?.value?.trimStart().replace(/\s\s+/g, "")
                    );
                  }}
                  error={
                    formik.touched.about_us && Boolean(formik.errors.about_us)
                  }
                  helperText={
                    formik.touched.about_us &&
                    formik.errors.about_us &&
                    formik.errors.about_us
                  }
                />
              </Grid>
            </Grid>
            <Grid>
              {!isEdit ? (
                <TextField
                  id="location"
                  name="location"
                  label="Location*"
                  // variant="outlined"
                  //disabled={!isEdit}
                  fullWidth
                  sx={{ my: 2, mt: 4 }}
                  value={formik.values.location}
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                  error={
                    formik.touched.location && Boolean(formik.errors.location)
                  }
                  helperText={
                    formik.touched.location &&
                    formik.errors.location &&
                    formik.errors.location
                  }
                />
              ) : (
                <Autocomplete
                  id="location"
                  name="location"
                  label="Location*"
                  variant="outlined"
                  //disabled={!isEdit}
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
                    } else {
                      getPlacePredictions({ input: "" });
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
                        formik.touched.location &&
                        Boolean(formik.errors.location)
                      }
                      helperText={
                        formik.touched.location &&
                        formik.errors.location &&
                        formik.errors.location
                      }
                    />
                  )}
                />
              )}
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
              label="Address Line 1 (e.g. House No / Street
            Name) *"
              //disabled={!isEdit}
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
              freeSolo={!isEdit}
              variant={!isEdit ? "standard" : "outlined"}
              InputProps={{
                readOnly: !isEdit,
                disableUnderline: !isEdit,
              }}
            />
            <TextField
              id="addressLineTwo"
              label="Address Line 2 (e.g. Landmark / Locality)"
              //disabled={!isEdit}
              fullWidth
              sx={{ my: 2 }}
              name="addressLineTwo"
              value={formik.values.addressLineTwo}
              onChange={formik.handleChange}
              freeSolo={!isEdit}
              variant={!isEdit ? "standard" : "outlined"}
              InputProps={{
                readOnly: !isEdit,
                disableUnderline: !isEdit,
              }}
            />
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="country"
                  label="Country *"
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="state"
                  label="State *"
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="city"
                  label="City *"
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="postalCode"
                  name="postalCode"
                  label="Pin Code *"
                  //disabled={!isEdit}
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
                  freeSolo={!isEdit}
                  variant={!isEdit ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: !isEdit,
                    disableUnderline: !isEdit,
                  }}
                />
              </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
                <TextField
                  id="longitude"
                  name="longitude"
                  label="Longitude "
                  variant={"outlined"}
                  type="number"
                  //disabled={!isEdit}
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
                  //disabled={!isEdit}
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
            </Grid> */}
            {isEdit && (
              <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                <LoadingButton
                  fullWidth
                  loading={isLoading}
                  variant="contained"
                  sx={{ my: 4 }}
                  //disabled={!isEdit}
                  onClick={() => formik.handleSubmit()}
                >
                  Save
                </LoadingButton>
              </Grid>
            )}
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
