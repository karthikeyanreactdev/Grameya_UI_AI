import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
// import { makeStyles } from "@mui/styles";

import React, { useEffect, useState } from "react";
import { removeResume, updateProfile } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";

// const useStyles = makeStyles((theme) => ({
//   disabledSelect: {
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: "transparent", // Remove the border color
//     },
//     "& .MuiSelect-icon": {
//       color: theme.palette.text.primary, // Keep the select icon color unchanged
//     },
//   },
// }));

function BasicInfo({
  userDetail,
  isEditMode,
  onHandleEditCloseChange,
  getProfileDetail,
  onHandleChangeLoading,
}) {
  const [sendNotification] = useNotification();
  const [location, setLocation] = useState([
    { id: 1, name: "Trichy" },
    { id: 2, name: "Chennai" },
    { id: 3, name: "Coimbatore" },
    { id: 3, name: "Kulithalai" },
  ]);
  const [skills, setSkills] = useState([
    { id: 1, name: "Node.js" },
    { id: 2, name: "Flutter" },
    { id: 3, name: "Java" },
  ]);
  // const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const [formValue, setFormValue] = useState({
    full_name: "",
    alternate_phone: "",

    resume_headline: "",
    designation: "",
    notice_period: "",

    degree: "",

    total_years_of_experience: "",
    current_salary: "",
    expected_salary: "",
    current_location: "",
    preferred_job_location: [],
    skills: [],
    actively_looking_for_job: false,
  });

  useEffect(() => {
    console.log("userDetail", userDetail);
    const newFormValue = { ...formValue };
    newFormValue.full_name = userDetail?.full_name || "";
    // newFormValue.last_name = userDetail.last_name || "";
    newFormValue.resume_headline =
      userDetail.jobseekerDetails?.resume_headline || "";
    newFormValue.designation = userDetail?.jobseekerDetails?.designation || "";
    newFormValue.alternate_phone = userDetail.alternate_phone || "";
    newFormValue.current_location =
      userDetail?.jobseekerDetails?.current_location || "";
    newFormValue.degree = userDetail?.jobseekerDetails?.degree || "";
    newFormValue.total_years_of_experience =
      userDetail.jobseekerDetails?.total_years_of_experience || "";

    newFormValue.current_salary =
      userDetail.jobseekerDetails?.current_salary.toString() || "";
    newFormValue.expected_salary =
      userDetail.jobseekerDetails?.expected_salary.toString() || "";
    newFormValue.notice_period =
      userDetail.jobseekerDetails?.notice_period || "";
    newFormValue.skills = userDetail.jobseekerDetails?.skills || [];
    newFormValue.preferred_job_location =
      userDetail.jobseekerDetails?.preferred_job_location || [];

    setFormValue(newFormValue);
  }, []);

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue?.full_name ||
      !formValue?.alternate_phone ||
      !formValue?.resume_headline ||
      !formValue?.notice_period ||
      !formValue?.degree ||
      // !formValue?.year_of_passout ||
      !formValue?.total_years_of_experience ||
      !formValue?.current_salary ||
      !formValue?.expected_salary ||
      formValue?.preferred_job_location === 0 ||
      formValue?.skills === 0 ||
      !formValue?.full_name
    ) {
      return;
    }
    onHandleChangeLoading(true);
    try {
      const response = await updateProfile(formValue);

      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        onHandleEditCloseChange();
        getProfileDetail();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      onHandleChangeLoading(false);
    }
  };

  const handleFormInputChange = (e) => {
    const newFormValue = { ...formValue };
    const { name, value } = e.target;
    newFormValue[name] = value;
    setFormValue(newFormValue);
  };

  const handleMultiSelectChange = (parentName, value) => {
    const newFormValue = { ...formValue };
    newFormValue[parentName] = value;
    setFormValue(newFormValue);
  };

  const handleResumeDownload = (url) => {
    let link = document.createElement("a");
    link.download = "resume";
    link.target = "_blank";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResumeRemove = async () => {
    onHandleChangeLoading(true);
    try {
      const response = await removeResume();

      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        // onHandleEditCloseChange();
        getProfileDetail();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      onHandleChangeLoading(false);
    }
  };

  // const validationSchema = yup.object({
  //   // jobTitle: yup
  //   //   .string("Job Title is required")
  //   //   .trim()
  //   //   .required("Job Title is required")
  //   //   .min(10, "Minimum 10 character required"),
  //   companyName: yup
  //     .string("Company Name is required")
  //     .trim()
  //     .required("Company Name is required"),
  //   fullname: yup
  //     .string("Full Name is required")
  //     .trim()
  //     .required("Full Name is required"),
  //   designation: yup
  //     .string("Designation is required")
  //     .trim()
  //     .required("Designation is required"),

  //   addressLineOne: yup
  //     .string("Address Line 1 is required")
  //     .trim()
  //     .required("Address Line 1 is required"),
  //   email: yup
  //     .string("Email is Required")
  //     .email("Enter the valid email")
  //     .trim()
  //     .required("Email is Required"),

  //   location: yup
  //     .string("Location is required")
  //     .required("Location is required"),
  //   city: yup.string("City is required").trim().required("City is required"),
  //   state: yup.string("State is required").trim().required("State is required"),
  //   country: yup
  //     .string("Country is required")
  //     .trim()
  //     .required("Country is required"),
  //   postalCode: yup
  //     .string("Postal Code is required")
  //     .trim()
  //     .required("Postal Code is required"),

  //   companyType: yup
  //     .string("Company Type is required")
  //     .required("Company Type is required"),
  // });
  const formik = useFormik({
    initialValues: {
      full_name: "",
      alternate_phone: "",
      resume_headline: "",
      designation: "",
      notice_period: "",
      degree: "",
      total_years_of_experience: "",
      current_salary: "",
      expected_salary: "",
      current_location: "",
      preferred_job_location: [],
      skills: [],
      actively_looking_for_job: false,
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      // const params = {
      //   full_name: values.fullname,
      //   designation: values.designation,
      //   company_name: values.companyName,
      //   designation: values.designation,
      //   phone: values.mobile,
      //   alternate_mobile: values.alternateMobile,

      //   company_type: values.companyType,
      //   address: values.location,
      //   address_line_one: values.addressLineOne,
      //   address_line_two: values.addressLineTwo,
      //   city: values.city,
      //   state: values.state,
      //   country: values.country,
      //   postal_code: values.postalCode,
      //   latitude: values.latitude,
      //   longitude: values.longitude,
      // };
      // console.log(params);

      // try {
      //   setIsLoading(true);
      //   const result = await updateProfile(params);
      //   sendNotification({
      //     message: result?.data?.message,
      //     variant: "success",
      //   });
      // } catch (e) {
      //   sendNotification({
      //     message: e,
      //     variant: "error",
      //   });
      // } finally {
      //   setIsLoading(false);
      //   dispatch(getUserData({}));
      // }
    },
  });
  return (
    <>
      <Grid item md={12} xs={12}>
        <Card>
          {/* <CardHeader title='Basic Info' /> */}
          <CardContent
          // sx={{
          //   display: "flex",
          //   justifyContent: "center",
          //   mx: 4,
          //   mt: 4,
          // }}
          >
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <TextField
                sx={{ mb: 2 }}
                label={"Resume Headline"}
                fullWidth
                multiline
                minRows={isEditMode ? 1 : 4}
                name="resume_headline"
                value={formik.values.resume_headline
                  .trimStart()
                  .replace(/\s\s+/g, "")
                  .replace(/\p{Emoji_Presentation}/gu, "")}
                onChange={(e) => formik.handleChange(e)}
                error={
                  formik.touched.resume_headline &&
                  Boolean(formik.errors.resume_headline)
                }
                helperText={
                  formik.touched.resume_headline &&
                  formik.errors.resume_headline &&
                  formik.errors.resume_headline
                }
                freeSolo={isEditMode}
                variant={isEditMode ? "standard" : "outlined"}
                InputProps={{
                  readOnly: isEditMode,
                  disableUnderline: isEditMode,
                }}
              />
            </Grid>

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Full Name"}
                  required
                  fullWidth
                  name="full_name"
                  value={formik.values.full_name
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.full_name && Boolean(formik.errors.full_name)
                  }
                  helperText={
                    formik.touched.full_name &&
                    formik.errors.full_name &&
                    formik.errors.full_name
                  }
                  freeSolo={isEditMode}
                  variant={isEditMode ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: isEditMode,
                    disableUnderline: isEditMode,
                  }}
                />
                {/* <Typography variant="h3" component="div">
                      First Name
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail.full_name}
                    </Typography> */}
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Email"}
                  required
                  fullWidth
                  name="email"
                  // value={formik.values.resume_headline
                  //   .trimStart()
                  //   .replace(/\s\s+/g, "")
                  //   .replace(/\p{Emoji_Presentation}/gu, "")}
                  // onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email &&
                    formik.errors.email &&
                    formik.errors.email
                  }
                  // value={userDetail?.email}
                  disabled
                  freeSolo={isEditMode}
                  variant={isEditMode ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: isEditMode,
                    disableUnderline: isEditMode,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} py={2}>
              <>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  {/* <Typography variant="h3" component="div">
                      Email
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.email}
                    </Typography> */}

                  <TextField
                    sx={{ mb: 2 }}
                    label={"Designation"}
                    required
                    fullWidth
                    value={formValue.designation}
                    name="designation"
                    error={submitted && !formValue.designation}
                    helperText={
                      submitted &&
                      !formValue.designation &&
                      "Designation is required"
                    }
                    onChange={handleFormInputChange}
                    freeSolo={isEditMode}
                    variant={isEditMode ? "standard" : "outlined"}
                    InputProps={{
                      readOnly: isEditMode,
                      disableUnderline: isEditMode,
                    }}
                  />
                </Grid>
              </>
              <>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  {/* <Typography variant="h3" component="div">
                      Phone
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.phone}
                    </Typography> */}

                  <TextField
                    sx={{ mb: 2 }}
                    label={"Alternate Mobile Number"}
                    required
                    fullWidth
                    name="alternate_phone"
                    value={formik.values.alternate_phone
                      .trimStart()
                      .replace(/\s\s+/g, "")
                      .replace(/\p{Emoji_Presentation}/gu, "")}
                    onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.alternate_phone &&
                      Boolean(formik.errors.alternate_phone)
                    }
                    helperText={
                      formik.touched.alternate_phone &&
                      formik.errors.alternate_phone &&
                      formik.errors.alternate_phone
                    }
                    freeSolo={isEditMode}
                    variant={isEditMode ? "standard" : "outlined"}
                    InputProps={{
                      readOnly: isEditMode,
                      disableUnderline: isEditMode,
                    }}
                  />
                </Grid>
              </>
            </Grid>
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12} pb={4}>
              <Autocomplete
                multiple
                value={formValue.skills}
                id="tags-filled"
                onChange={(event, newValue) => {
                  handleMultiSelectChange("skills", newValue);
                }}
                // options={categoryList}
                options={skills.map((option) => option.name)}
                readOnly={isEditMode}
                freeSolo={isEditMode}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder=""
                    // value={formValue.skills}
                    variant={isEditMode ? "standard" : "outlined"}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: isEditMode,
                      disableUnderline: isEditMode,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel id="demo-simple-select-label">
                    Current Location *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //   value={formik.values.currentLocation}
                    label="Current Location *"
                    //   onChange={(e) =>
                    //     formik.setFieldValue("location", e.target.value)
                    //   }
                    name="current_location"
                    value={formValue.current_location}
                    error={submitted && !formValue.current_location}
                    helperText={
                      submitted &&
                      !formValue.current_location &&
                      "Current Location is required"
                    }
                    onChange={handleFormInputChange}
                    // freeSolo={isEditMode}
                    // // variant={isEditMode ? "standard" : "outlined"}
                    // inputProps={{
                    //   readOnly: isEditMode,
                    //   disableUnderline: isEditMode,
                    // }}
                    // classes={{ disabled: classes.disabledSelect }}
                    sx={{
                      "&.Mui-disabled": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent", // Remove the border color
                        },
                        "& .MuiSelect-icon": {
                          display: "none", // Hide the select icon
                        },
                      },
                      "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "transparent", // Remove the border color in disabled state
                        },
                      "& .MuiOutlinedInput-root.Mui-disabled .MuiSelect-icon": {
                        display: "none", // Hide the select icon in disabled state
                      },
                    }}
                    disabled={isEditMode}
                    // inputProps={{
                    //   readOnly: isEditMode,
                    //   disableUnderline: true,
                    // }}
                    input={
                      isEditMode && (
                        <Input
                          readOnly={isEditMode}
                          disableUnderline={isEditMode}
                        />
                      )
                    }
                  >
                    <MenuItem value={"Chennai"}>Chennai</MenuItem>
                    <MenuItem value={"Delhi"}>Delhi</MenuItem>
                    <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                    <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
                    <MenuItem value={"Kulithalai"}>Kulithalai</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                {/* <Typography variant="h3" component="div">
                        Preferred Job Location
                      </Typography>
                      <Typography variant="h5" component="div">
                        {userDetail?.jobseekerDetails?.preferred_job_location.map(
                          (element, index) => (
                            <span key={index}>
                              {element}
                              {index !==
                                userDetail?.jobseekerDetails
                                  ?.preferred_job_location.length -
                                  1 && ", "}
                            </span>
                          )
                        )}
                      </Typography> */}

                <Autocomplete
                  multiple
                  sx={{ my: 2 }}
                  id="tags-filled"
                  // options={categoryList}
                  options={location.map((option) => option.name)}
                  value={formValue.preferred_job_location}
                  onChange={(event, newValue) => {
                    handleMultiSelectChange("preferred_job_location", newValue);
                  }}
                  readOnly={isEditMode}
                  freeSolo={isEditMode}
                  lim
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Prefered Job Location *"
                      // placeholder="Prefered Job Location"
                      variant={isEditMode ? "standard" : "outlined"}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: isEditMode,
                        disableUnderline: isEditMode,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} py={2}>
              {userDetail?.jobseekerDetails?.current_location && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    {/* <Typography variant="h3" component="div">
                      Current CTC
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.current_salary}
                    </Typography> */}

                    <TextField
                      sx={{ my: 2 }}
                      label={"Current CTC (in LPA)"}
                      type="text"
                      fullWidth
                      name="current_salary"
                      value={formik.values.current_salary
                        .trimStart()
                        .replace(/\s\s+/g, "")
                        .replace(/\p{Emoji_Presentation}/gu, "")}
                      onChange={(e) => formik.handleChange(e)}
                      error={
                        formik.touched.current_salary &&
                        Boolean(formik.errors.current_salary)
                      }
                      helperText={
                        formik.touched.current_salary &&
                        formik.errors.current_salary &&
                        formik.errors.current_salary
                      }
                      freeSolo={isEditMode}
                      variant={isEditMode ? "standard" : "outlined"}
                      InputProps={{
                        readOnly: isEditMode,
                        disableUnderline: isEditMode,
                      }}
                    />
                  </Grid>
                </>
              )}
              {userDetail?.jobseekerDetails?.expected_salary && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    {/* <Typography variant="h3" component="div">
                      Total years of experience
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.total_years_of_experience}
                    </Typography> */}
                    <TextField
                      sx={{ my: 2 }}
                      label={" Expected CTC (in LPA)"}
                      type="text"
                      fullWidth
                      name="expected_salary"
                      value={formik.values.expected_salary
                        .trimStart()
                        .replace(/\s\s+/g, "")
                        .replace(/\p{Emoji_Presentation}/gu, "")}
                      onChange={(e) => formik.handleChange(e)}
                      error={
                        formik.touched.expected_salary &&
                        Boolean(formik.errors.expected_salary)
                      }
                      helperText={
                        formik.touched.expected_salary &&
                        formik.errors.expected_salary &&
                        formik.errors.expected_salary
                      }
                      freeSolo={isEditMode}
                      variant={isEditMode ? "standard" : "outlined"}
                      InputProps={{
                        readOnly: isEditMode,
                        disableUnderline: isEditMode,
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <FormControl
                  fullWidth
                  sx={{ my: 2 }}
                  error={
                    formik.touched.notice_period &&
                    Boolean(formik.errors.notice_period)
                  }
                >
                  <InputLabel
                    id="demo-simple-select-label "
                    error={
                      formik.touched.notice_period &&
                      Boolean(formik.errors.notice_period)
                    }
                  >
                    Notice Period *
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.notice_period}
                    label="Notice Period *"
                    error={
                      formik.touched.notice_period &&
                      Boolean(formik.errors.notice_period)
                    }
                    helperText={
                      formik.touched.notice_period &&
                      formik.errors.notice_period &&
                      formik.errors.notice_period
                    }
                    onChange={(e) =>
                      formik.setFieldValue("notice_period", e.target.value)
                    }
                  >
                    <MenuItem value={"immediate"}>Immediate</MenuItem>
                    <MenuItem value={"15 Days"}>15 Days</MenuItem>
                    <MenuItem value={"30 Days"}>30 Days</MenuItem>
                    <MenuItem value={"45 Days"}>45 Days</MenuItem>
                    <MenuItem value={"60 Days"}>60 Days</MenuItem>
                    <MenuItem value={"90 Days"}>90 Days</MenuItem>
                  </Select>
                  <FormHelperText>
                    {formik.touched.notice_period &&
                      formik.errors.notice_period &&
                      formik.errors.notice_period}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                {/* <Typography variant="h3" component="div">
                      Total years of experience
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.total_years_of_experience}
                    </Typography> */}
                <TextField
                  sx={{ my: 2 }}
                  label={"Total Experience (in Years) "}
                  type="text"
                  fullWidth
                  name="total_years_of_experience"
                  value={formik.values.total_years_of_experience
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.total_years_of_experience &&
                    Boolean(formik.errors.total_years_of_experience)
                  }
                  helperText={
                    formik.touched.total_years_of_experience &&
                    formik.errors.total_years_of_experience &&
                    formik.errors.total_years_of_experience
                  }
                  freeSolo={isEditMode}
                  variant={isEditMode ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: isEditMode,
                    disableUnderline: isEditMode,
                  }}
                />
              </Grid>
            </Grid>

            {/* <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <Autocomplete
                  multiple
                  value={formValue.skills}
                  id="tags-filled"
                  onChange={(event, newValue) => {
                    handleMultiSelectChange("skills", newValue);
                  }}
                  // options={categoryList}
                  options={skills.map((option) => option.name)}
                  readOnly={isEditMode}
                  freeSolo={isEditMode}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skills"
                      placeholder=""
                      // value={formValue.skills}
                      variant={isEditMode ? "standard" : "outlined"}
                      InputProps={{
                        ...params.InputProps,
                        readOnly: isEditMode,
                        disableUnderline: isEditMode,
                      }}
                    />
                  )}
                />
              </Grid>

              {/* {userDetail?.jobseekerDetails?.designation && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    {/* <Typography variant="h3" component="div">
                      Current Designation
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.designation}
                    </Typography> *
                    <TextField
                      sx={{ mb: 2 }}
                      label={"Designation"}
                      required
                      fullWidth
                      value={formValue.designation}
                      name="designation"
                      error={submitted && !formValue.designation}
                      helperText={
                        submitted &&
                        !formValue.designation &&
                        "Designation is required"
                      }
                      onChange={handleFormInputChange}
                      freeSolo={isEditMode}
                      variant={isEditMode ? "standard" : "outlined"}
                      InputProps={{
                        readOnly: isEditMode,
                        disableUnderline: isEditMode,
                      }}
                    />
                  </Grid>
                </>
              )} *
            </Grid> */}

            {!isEditMode && (
              <>
                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                  {/* <Button
                      variant="outlined"
                      color="error"
                      onClick={onHandleEditCloseChange}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button> */}
                  <LoadingButton
                    variant="contained"
                    fullWidth
                    onClick={handleFormSubmit}
                  >
                    Submit
                  </LoadingButton>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default BasicInfo;
