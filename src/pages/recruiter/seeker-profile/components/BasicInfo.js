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
  // const { userData } = useSelector((state) => state.auth);
  const { skills } = useSelector((state) => state.misc);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoadingFlag, appliedCandidateProfile } = useSelector(
    (state) => state.appliedSeeker
  );
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
  });
  useEffect(() => {
    console.log("user", appliedCandidateProfile);
    const user = appliedCandidateProfile;
    if (appliedCandidateProfile) {
      formik.setFieldValue("full_name", appliedCandidateProfile?.full_name);
      formik.setFieldValue("designation", appliedCandidateProfile?.designation);
      formik.setFieldValue("mobile", appliedCandidateProfile?.phone);
      formik.setFieldValue(
        "alternate_phone",
        appliedCandidateProfile?.alternate_phone
      );
      formik.setFieldValue("email", appliedCandidateProfile?.email);
      formik.setFieldValue("skills", appliedCandidateProfile?.skills);

      formik.setFieldValue(
        "current_location",
        appliedCandidateProfile?.current_location
      );
      formik.setFieldValue(
        "preferred_job_location",
        appliedCandidateProfile?.preferred_job_location
      );

      formik.setFieldValue(
        "resume_headline",
        appliedCandidateProfile?.resume_headline
      );
      formik.setFieldValue(
        "current_salary",
        appliedCandidateProfile?.current_salary
      );
      formik.setFieldValue(
        "expected_salary",
        appliedCandidateProfile?.expected_salary
      );

      formik.setFieldValue(
        "notice_period",
        appliedCandidateProfile?.notice_period
      );
      formik.setFieldValue(
        "total_years_of_experience",
        appliedCandidateProfile?.total_years_of_experience
      );
    }
  }, [appliedCandidateProfile]);

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
                minRows={3}
                maxRows={3}
                name="resume_headline"
                value={formik?.values?.resume_headline}
                // freeSolo={true}
                variant={"standard"}
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
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
                freeSolo={true}
                variant={"standard"}
                value={formik?.values?.full_name}
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
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
                  value={formik?.values?.designation}
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
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
                  freeSolo={true}
                  variant={"standard"}
                  value={formik?.values?.email}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
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
                    freeSolo={true}
                    value={formik?.values?.mobile}
                    variant={"standard"}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
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
                    freeSolo={true}
                    value={formik?.values?.alternate_phone}
                    variant={"standard"}
                    InputProps={{
                      readOnly: true,
                      disableUnderline: true,
                    }}
                  />
                </Grid>
              </>
            </Grid>
            <Grid item lg={12} xl={12} xs={12} md={12} sm={12} pb={4}>
              {/* <Autocomplete
                required
                sx={{ my: 2 }}
                label={"Skills"}
                name={"skills"}
                fullWidth
                value={formik.values.skills}
                multiple
                onChange={(event, item) => {
                  if (!true) {
                    formik.setFieldValue("skills", item);
                  }
                }}
                options={skills}
                getOptionLabel={(option) =>
                  option?.name === null || option?.name === undefined
                    ? option
                    : option?.name
                }
                // limitTags={isEditMode ? 12 : 2}
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
                    variant={"standard"}
                    InputProps={{
                      ...params.InputProps,
                      readOnly: true,
                      disableUnderline: true,
                    }}
                    value={formik?.values?.skills}
                  />
                )}
              /> */}
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={" Current Location"}
                  required
                  fullWidth
                  name="current_location"
                  value={formik?.values?.current_location}
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={" Preferred Location"}
                  required
                  value={formik?.values?.preferred_job_location}
                  fullWidth
                  name="preferred_job_location"
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Current CTC (in LPA)"}
                  value={formik?.values?.current_salary}
                  type="text"
                  required
                  fullWidth
                  name="current_salary"
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ my: 2 }}
                  value={formik?.values?.expected_salary}
                  label={" Expected CTC (in LPA)"}
                  type="text"
                  required
                  fullWidth
                  name="expected_salary"
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} py={2}>
              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  sx={{ mb: 2 }}
                  label={"Notice Period"}
                  value={formik?.values?.notice_period}
                  required
                  fullWidth
                  name="notice_period"
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>

              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                <TextField
                  // sx={{ my: 2 }}
                  label={"Total Experience (in Years) "}
                  type="text"
                  required
                  fullWidth
                  name="total_years_of_experience"
                  value={formik?.values?.total_years_of_experience}
                  freeSolo={true}
                  variant={"standard"}
                  InputProps={{
                    readOnly: true,
                    disableUnderline: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
}

export default BasicInfo;
