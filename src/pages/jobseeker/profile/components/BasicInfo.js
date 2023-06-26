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
import * as yup from "yup";

import React, { useEffect, useState } from "react";
import { removeResume, updateProfile } from "src/api-services/seeker/profile";
import useNotification from "src/hooks/useNotification";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";

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
  const { userData } = useSelector((state) => state.auth);
  const { skills } = useSelector((state) => state.misc);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object({
    resume_headline: yup
      .string("Resume Headline is required")
      .trim()
      .min(10, "Minimum 10 character required")
      .max(100, "Maximum 100 character is allowed")
      .required("Resume Headline is required"),
    full_name: yup
      .string("Full Name is required")
      .trim()
      .min(10, "Minimum 10 character required")
      .max(75, "Maximum 75 character  is allowed")
      .required("Full Name is required"),
    designation: yup
      .string("Designation is required")
      .trim()
      .min(10, "Minimum 10 character required")
      .max(50, "Maximum 50 character  is allowed")
      .required("Designation is required"),

    notice_period: yup
      .string("Notice Period is required")
      .required("Notice Period is required"),
    skills: yup
      .array()

      .min(1, "Minimum 1 skill is required")
      .max(10, "Maximum 10 skills is allowed"),

    current_location: yup
      .string("Current Location is required")
      .required("Current Location is required"),
    current_salary: yup
      .string("Current Salary is required")
      .trim()
      .required("Current Salary is required"),
    expected_salary: yup
      .string("Expected Salary is required")
      .trim()
      .required("Expected Salary is required"),
    preferred_job_location: yup
      .array()
      // .trim()
      .required("Preferred Location is required"),

    total_years_of_experience: yup
      .string("Total Experience is required")
      .required("Total Experience is required"),
  });
  const formik = useFormik({
    initialValues: {
      full_name: "",
      alternate_phone: "",
      email: "",
      mobile: "",
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
      actively_looking_for_job: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const params = {
        full_name: values.full_name,
        alternate_phone: values.alternate_phone,
        // first_name: values.full_name,
        // last_name: values.full_name,
        resume_headline: values.resume_headline,
        designation: values.designation,
        notice_period: values.notice_period,

        total_years_of_experience: values.total_years_of_experience,
        current_salary: `${values.current_salary}`,
        expected_salary: `${values.expected_salary}`,
        current_location: values.current_location,
        preferred_job_location: [values.preferred_job_location],
        skills: values.skills,
        actively_looking_for_job: values.actively_looking_for_job,
      };
      console.log(params);
      try {
        setIsLoading(true);
        //   const result = await upd
        const response = await updateProfile(params);

        console.log("response", response);

        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
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
  useEffect(() => {
    console.log("user", userData);
    const user = userData?.jobseekerDetails;

    if (userData) {
      formik?.setFieldValue("full_name", userData?.full_name);
      formik.setFieldValue(
        "designation",
        userData?.jobseekerDetails?.designation
      );
      formik.setFieldValue("mobile", userData?.phone);
      formik.setFieldValue("alternate_phone", userData?.alternate_phone);
      formik.setFieldValue("email", userData?.email);
      formik.setFieldValue("skills", userData?.jobseekerDetails?.skills);

      formik.setFieldValue(
        "current_location",
        userData?.jobseekerDetails?.current_location
      );
      formik.setFieldValue(
        "preferred_job_location",
        userData?.jobseekerDetails?.preferred_job_location
      );

      formik.setFieldValue(
        "resume_headline",
        userData?.jobseekerDetails?.resume_headline
      );
      formik.setFieldValue(
        "current_salary",
        userData?.jobseekerDetails?.current_salary
      );
      formik.setFieldValue(
        "expected_salary",
        userData?.jobseekerDetails?.expected_salary
      );

      formik.setFieldValue(
        "notice_period",
        userData?.jobseekerDetails?.notice_period
      );
      formik.setFieldValue(
        "total_years_of_experience",
        userData?.jobseekerDetails?.total_years_of_experience
      );
    }
  }, [userData]);

  return (
    <>
      <Grid item md={12} xs={12}>
        <Card>
          <CardContent>
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <TextField
                sx={{ my: 2 }}
                label={"Resume Headline"}
                required
                fullWidth
                multiline
                minRows={isEditMode ? 1 : 3}
                maxRows={3}
                name="resume_headline"
                value={formik.values.resume_headline
                  ?.trimStart()
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
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
              <TextField
                sx={{ my: 2 }}
                label={"Full Name"}
                required
                fullWidth
                name="full_name"
                value={formik.values.full_name
                  ?.trimStart()
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
            </Grid>
            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Designation"}
                  required
                  fullWidth
                  name="designation"
                  value={formik.values.designation
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.designation &&
                    Boolean(formik.errors.designation)
                  }
                  helperText={
                    formik.touched.designation &&
                    formik.errors.designation &&
                    formik.errors.designation
                  }
                  freeSolo={isEditMode}
                  variant={isEditMode ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: isEditMode,
                    disableUnderline: isEditMode,
                  }}
                />
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Email"}
                  required
                  fullWidth
                  name="email"
                  value={formik.values.email
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  // onChange={(e) => formik.handleChange(e)}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email &&
                    formik.errors.email &&
                    formik.errors.email
                  }
                  // value={userDetail?.email}
                  // disabled
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
                  <TextField
                    sx={{ mb: 2 }}
                    label={" Mobile Number"}
                    required
                    fullWidth
                    name="mobile"
                    value={formik.values.mobile
                      .trimStart()
                      .replace(/\s\s+/g, "")
                      .replace(/\p{Emoji_Presentation}/gu, "")}
                    // onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.mobile && Boolean(formik.errors.mobile)
                    }
                    helperText={
                      formik.touched.mobile &&
                      formik.errors.mobile &&
                      formik.errors.mobile
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
              <>
                <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Alternate Mobile Number"}
                    // required
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
                required
                sx={{ my: 2 }}
                label={"Skills"}
                name={"skills"}
                fullWidth
                value={formik.values.skills}
                multiple
                onChange={(event, item) => {
                  if (!isEditMode) {
                    formik.setFieldValue("skills", item);
                  }
                }}
                options={skills}
                getOptionLabel={(option) =>
                  option?.name === null || option?.name === undefined
                    ? option
                    : option?.name
                }
                limitTags={isEditMode ? 12 : 2}
                freeSolo
                filterSelectedOptions
                // filterOptions={filterOptions}
                disableClearable
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      // color="black"
                      // sx={{ color: "#" }}
                      label={
                        option?.name === null || option?.name === undefined
                          ? option
                          : option?.name
                      }
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label={"Skills"}
                    placeholder={!isEditMode && "Select Skill(s)"}
                    error={
                      formik.touched.skills && Boolean(formik.errors.skills)
                    }
                    helperText={
                      formik.touched.skills &&
                      formik.errors.skills &&
                      formik.errors.skills
                    }
                    variant={isEditMode ? "standard" : "outlined"}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: isEditMode,
                      disableUnderline: isEditMode,
                    }}
                    value={formik?.values?.skills}
                  />
                )}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={" Current Location"}
                  required
                  fullWidth
                  name="current_location"
                  value={`${formik.values.current_location}`
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.current_location &&
                    Boolean(formik.errors.current_location)
                  }
                  helperText={
                    formik.touched.current_location &&
                    formik.errors.current_location &&
                    formik.errors.current_location
                  }
                  freeSolo={isEditMode}
                  variant={isEditMode ? "standard" : "outlined"}
                  InputProps={{
                    readOnly: isEditMode,
                    disableUnderline: isEditMode,
                  }}
                />
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={" Preferred Location"}
                  required
                  fullWidth
                  name="preferred_job_location"
                  value={`${formik.values.preferred_job_location}`
                    .trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => formik.handleChange(e)}
                  error={
                    formik.touched.preferred_job_location &&
                    Boolean(formik.errors.preferred_job_location)
                  }
                  helperText={
                    formik.touched.preferred_job_location &&
                    formik.errors.preferred_job_location &&
                    formik.errors.preferred_job_location
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

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Current CTC (in LPA)"}
                  type="text"
                  required
                  fullWidth
                  name="current_salary"
                  value={`${formik.values.current_salary}`
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

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={" Expected CTC (in LPA)"}
                  type="text"
                  required
                  fullWidth
                  name="expected_salary"
                  value={`${formik.values.expected_salary}`
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
            </Grid>

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                {isEditMode ? (
                  <TextField
                    sx={{ mb: 2 }}
                    label={"Notice Period"}
                    required
                    fullWidth
                    name="notice_period"
                    value={`${formik.values.notice_period}`
                      .trimStart()
                      .replace(/\s\s+/g, "")
                      .replace(/\p{Emoji_Presentation}/gu, "")}
                    onChange={(e) => formik.handleChange(e)}
                    error={
                      formik.touched.notice_period &&
                      Boolean(formik.errors.notice_period)
                    }
                    helperText={
                      formik.touched.notice_period &&
                      formik.errors.notice_period &&
                      formik.errors.notice_period
                    }
                    freeSolo={isEditMode}
                    variant={isEditMode ? "standard" : "outlined"}
                    InputProps={{
                      readOnly: isEditMode,
                      disableUnderline: isEditMode,
                    }}
                  />
                ) : (
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
                )}
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Total Experience (in Years) "}
                  type="text"
                  required
                  fullWidth
                  name="total_years_of_experience"
                  value={`${formik.values.total_years_of_experience}`
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
                    loading={isLoading}
                    disabled={isLoading}
                    fullWidth
                    onClick={() => formik.handleSubmit()}
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
