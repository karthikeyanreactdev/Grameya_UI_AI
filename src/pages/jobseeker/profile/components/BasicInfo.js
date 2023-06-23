import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
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
    // first_name: "",
    // last_name: "",
    resume_headline: "",
    designation: "",
    notice_period: "",
    // qualification: "",
    degree: "",
    // institution: "",
    // year_of_passout: "",
    // any_secial_course_completed: "",
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

  return (
    <>
      <Grid item md={12} xs={12}>
        <Card>
          {/* <CardHeader title='Basic Info' /> */}
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <TextField
                sx={{ mb: 2 }}
                label={"Resume Headline"}
                fullWidth
                multiline
                minRows={isEditMode ? 1 : 4}
                name="resume_headline"
                onChange={handleFormInputChange}
                value={formValue.resume_headline}
                error={submitted && !formValue.resume_headline}
                helperText={
                  submitted &&
                  !formValue.resume_headline &&
                  "Resume Headline is required"
                }
                freeSolo={isEditMode}
                variant={isEditMode ? "standard" : "outlined"}
                InputProps={{
                  readOnly: isEditMode,
                  disableUnderline: isEditMode,
                }}
              />
            </Grid>

            {/* <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
              {userDetail?.jobseekerDetails?.resume_url && (
                <>
                  <List>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={handleResumeRemove}
                        >
                          <ClearIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        onClick={() =>
                          handleResumeDownload(
                            userDetail?.jobseekerDetails?.resume_url
                          )
                        }
                        sx={{ cursor: "pointer" }}
                        primary="Resume"
                      />
                    </ListItem>
                  </List>
                </>
              )}
            </Grid> */}
          </CardContent>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              {userDetail?.full_name && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={"Full Name"}
                      required
                      fullWidth
                      name="full_name"
                      onChange={handleFormInputChange}
                      value={formValue.full_name}
                      error={submitted && !formValue.full_name}
                      helperText={
                        submitted &&
                        !formValue.full_name &&
                        "Full Name is required"
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
                </>
              )}

              {userDetail?.jobseekerDetails?.degree && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    <TextField
                      sx={{ mb: 2 }}
                      label={"Email"}
                      required
                      fullWidth
                      name="full_name"
                      onChange={handleFormInputChange}
                      value={userDetail?.email}
                      disabled
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
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              {userDetail?.email && (
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
              )}

              {userDetail?.phone && (
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
                      value={formValue.alternate_phone}
                      error={submitted && !formValue.alternate_phone}
                      helperText={
                        submitted &&
                        !formValue.alternate_phone &&
                        "Alternate Mobile Number is required"
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
              )}
            </Grid>
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              {userDetail?.jobseekerDetails?.current_location && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    {/* <Typography variant="h3" component="div">
                      Current Location
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.current_location}
                    </Typography> */}

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
                          "& .MuiOutlinedInput-root.Mui-disabled .MuiSelect-icon":
                            {
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
                </>
              )}
              {userDetail?.jobseekerDetails?.preferred_job_location &&
                userDetail?.jobseekerDetails?.preferred_job_location.length && (
                  <>
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
                        id="tags-filled"
                        // options={categoryList}
                        options={location.map((option) => option.name)}
                        value={formValue.preferred_job_location}
                        onChange={(event, newValue) => {
                          handleMultiSelectChange(
                            "preferred_job_location",
                            newValue
                          );
                        }}
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
                  </>
                )}
            </Grid>
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
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
                      value={formValue.current_salary}
                      error={submitted && !formValue.current_salary}
                      helperText={
                        submitted &&
                        !formValue.current_salary &&
                        "Current CTC (in LPA) is required"
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
                      value={formValue.expected_salary}
                      error={submitted && !formValue.expected_salary}
                      helperText={
                        submitted &&
                        !formValue.expected_salary &&
                        "Expected CTC (in LPA) is required"
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
              )}
            </Grid>
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              {userDetail?.jobseekerDetails?.notice_period && (
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
                      label={"Notice Period"}
                      type="text"
                      fullWidth
                      name="notice_period"
                      value={formValue.notice_period}
                      error={submitted && !formValue.notice_period}
                      helperText={
                        submitted &&
                        !formValue.notice_period &&
                        "Notice Period is required"
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
              )}
              {userDetail?.jobseekerDetails?.total_years_of_experience && (
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
                      label={"Total Experience (in Years) "}
                      type="text"
                      fullWidth
                      name="total_years_of_experience"
                      value={formValue.total_years_of_experience}
                      error={submitted && !formValue.total_years_of_experience}
                      helperText={
                        submitted &&
                        !formValue.total_years_of_experience &&
                        "Total Experience (in Years) is required"
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
              )}
            </Grid>
          </CardContent>

          <CardContent
            sx={{
              display: "flex",
              justifyContent: "center",
              mx: 4,
              mt: 4,
            }}
          >
            <Grid container spacing={2} py={2}>
              {userDetail?.jobseekerDetails?.skills &&
                userDetail?.jobseekerDetails?.skills.length && (
                  <>
                    <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                      {/* <Typography variant="h3" component="div">
                        Skils
                      </Typography>
                      <Typography variant="h5" component="div">
                        {userDetail?.jobseekerDetails?.skills.map(
                          (element, index) => (
                            <span key={index}>
                              {element}
                              {index !==
                                userDetail?.jobseekerDetails?.skills.length -
                                  1 && ", "}
                            </span>
                          )
                        )}
                      </Typography> */}
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
                  </>
                )}
              {userDetail?.jobseekerDetails?.designation && (
                <>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    {/* <Typography variant="h3" component="div">
                      Current Designation
                    </Typography>
                    <Typography variant="h5" component="div">
                      {userDetail?.jobseekerDetails?.designation}
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
              )}
            </Grid>
          </CardContent>

          {!isEditMode && (
            <>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mx: 4,
                  mt: 4,
                }}
              >
                <Grid container spacing={2} py={2}>
                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                    <Button variant="contained" onClick={handleFormSubmit}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </>
          )}
        </Card>
      </Grid>
    </>
  );
}

export default BasicInfo;
