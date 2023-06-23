// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";
import { useFormik } from "formik";
// ** Third Party Imports
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";

// ** Component Import
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Slider from "@mui/material/Slider";
// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Actions Imports
// import { addUser } from "src/store/apps/user";
import {
  // Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();
import { LoadingButton } from "@mui/lab";
import {
  createJob,
  getJobById,
  getJobSubCategoryById,
  updateJobById,
} from "src/api-services/recruiter/jobs";
import Geocode from "react-geocode";

import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import GoogleApiWrapper from "../../../../utils/GoogleMap/index";
import useNotification from "src/hooks/useNotification";
// import { validationSchema } from "../validation";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .wrapper-class.rdw-editor-wrapper": {
      borderRadius: " 0px 0px 8px 8px",
      border: "1px solid #e0e0e0",
      "& .notranslate.public-DraftEditor-content": {
        padding: "0px 16px 0px 16px",
      },
    },
  },
});
Geocode.setApiKey(process.env.REACT_APP_GMAP_API_KEY);
Geocode.setLanguage("en");
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));
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
  email: yup
    .string("Email is Required")
    .email("Enter the valid email")
    .trim()
    .required("Email is Required"),
  // jobCategory: yup
  //   .string("Job Category is required")
  //   .required("Job Category is required"),
  //   jobSubCategory: yup
  //   .string("Job Sub Category is required")
  //   .required("Job Sub Category is required"),
  location: yup
    .string("Job Location is required")
    .required("Job Location is required"),

  noticePeriod: yup
    .string("Notice Period is required")
    .required("Notice Period is required"),
  jobType: yup.string("Job Type is required").required("Job Type is required"),
  skills: yup
    .array()
    // .of(
    //   yup.object().shape({
    //     id: yup.string(),
    //     jobCategory: yup.string(),
    //   })
    // )
    .min(1, "Minimum 1 skill is required")
    .max(10, "Maximum 10 skills is allowed"),
});
const SideBarJob = (props) => {
  // ** Props
  const { open, toggle, id } = props;

  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();
  const classes = useStyles();

  const [sendNotification] = useNotification();
  const { userData } = useSelector((state) => state.auth);

  const { jobCategory, skills, noticePeriod, jobType } = useSelector(
    (state) => state.misc
  );
  console.log("msi", jobCategory, skills, noticePeriod, jobType);
  const [salary, setSalary] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [experiance, setExperiance] = useState([0, 0]);
  const [jd, setJd] = useState(EditorState.createEmpty());
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setSalary(newValue);
  };
  const handleChangeExp = (event, newValue) => {
    console.log(newValue);
    setExperiance(newValue);
  };

  const formik = useFormik({
    initialValues: {
      companyName: "",
      jobTitle: "",
      jobCategory: null,
      jobSubCategory: null,
      skills: [],
      experiance: "",
      jobType: "",
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
      email: "",
      // addressLineOne: "",
      // addressLineTwo: "",
      // city: "",
      // state: "",
      // postalCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      console.log(values.skills);
      // setIsLoading(true);
      let addedSkills = [];
      let skills = [];
      if (values.skills && values.skills.length > 0) {
        values.skills.map((item) => {
          const val = typeof item;
          if (val === "string" && val !== "object") {
            addedSkills.push(item);
          } else {
            skills.push(item?.id);
          }
        });
      }

      const params = {
        company_name: values.companyName,
        job_title: values.jobTitle,
        job_category: category,
        job_sub_category: subCategory,
        location: values.location,
        skills: skills,
        added_skills: addedSkills,
        experience_from: `${experiance[0]}`,
        experience_to: `${experiance[1]}`,
        salary_from: `${salary[0]}`,
        salary_to: `${salary[1]}`,
        notice_period: `${values.noticePeriod}`,
        job_type: `${values.jobType}`,
        short_description: `${draftToHtml(
          convertToRaw(jd.getCurrentContent())
        )}`
          // .replace(/\"/g, '"')
          .replace(/\"/g, '"'),
        email: values.email,
        //address: values.location,
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

        let result = null;
        if (id === "") {
          result = await createJob(params);
        } else {
          params["job_id"] = id;
          result = await updateJobById(params);
        }
        formik.resetForm();
        toggle();

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
  const handleClose = () => {
    toggle();
  };
  // console.log(draftToHtml(convertToRaw(jd.getCurrentContent())));

  const getJob = async () => {
    try {
      const result = await getJobById(id);
      console.log(result?.data?.data);
      setJobData(result?.data?.data);
      const data = result?.data?.data;
      if (data) {
        formik.setFieldValue("companyName", data?.company_name);
        formik.setFieldValue("jobTitle", data?.job_title);
        formik.setFieldValue("jobType", data?.job_type);
        formik.setFieldValue("noticePeriod", data?.notice_period);
        formik.setFieldValue("shortDescription", data?.short_description);
        formik.setFieldValue("location", data?.location);
        formik.setFieldValue("email", data?.email);
        formik.setFieldValue("jobCategory", data?.job_category);
        formik.setFieldValue("jobSubCategory", data?.job_sub_category);
        formik.setFieldValue("addressLineOne", data?.address_line_one);

        formik.setFieldValue("addressLineTwo", data?.address_line_two);
        formik.setFieldValue("country", data?.country);
        formik.setFieldValue("state", data?.state);
        formik.setFieldValue("city", data?.city);
        formik.setFieldValue("postalCode", data?.postal_code);
        formik.setFieldValue("longitude", data?.longitude);
        formik.setFieldValue("latitude", data?.latitude);
        setLat(data?.latitude);
        setLng(data?.longitude);
        // if (Array.isArray(data?.skills)) {
        //   let mapping_value = data?.skills.map((item) =>
        //     categoryList.find((e) => e.jobCategory === item)
        //   );
        //   formik.setFieldValue("skills", mapping_value);
        formik.setFieldValue("skills", data?.skills);
        // }
        setExperiance([data?.experience_from, data?.experience_to]);
        setSalary([data?.salary_from, data?.salary_to]);

        const blocksFromHTML = convertFromHTML(data?.short_description);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );

        setJd(EditorState.createWithContent(state));
      }
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    formik.resetForm();

    if (id !== "") {
      getJob();
    } else {
      if (userData) {
        formik.setFieldValue("email", userData?.email);
        formik.setFieldValue(
          "companyName",
          userData?.recruiterDetails?.company_name
        );
        formik.setFieldValue("location", userData?.recruiterDetails?.address);
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
        formik.setFieldValue(
          "longitude",
          userData?.recruiterDetails?.longitude
        );
        formik.setFieldValue("latitude", userData?.recruiterDetails?.latitude);
        setLat(userData?.recruiterDetails?.latitude);
        setLng(userData?.recruiterDetails?.longitude);
      }
    }
  }, [id, userData]);

  const handleJobCategory = async (id) => {
    try {
      formik.setFieldValue("jobSubCategory", "");
      const result = await getJobSubCategoryById(id);
      console.log(result?.data?.data?.records);
      setSubCategoryList(result?.data?.data?.records);
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      // setIsLoading(false);
    }
  };
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
  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      className={classes.root}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: "100%", sm: "100%", lg: "50%" } },
      }}
    >
      <Header>
        <Typography variant="h5">
          {id !== "" ? "Edit a Job" : "Create a Job"}
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            p: "0.438rem",
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: (theme) =>
                `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <Grid container spacing={2}>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <TextField
              sx={{ my: 2 }}
              label={"Company Name"}
              required
              // disabled
              fullWidth
              name="companyName"
              error={
                formik.touched.companyName && Boolean(formik.errors.companyName)
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

          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <TextField
              sx={{ my: 2 }}
              label={"Job Title"}
              multiline
              minRows={2}
              maxRows={3}
              required
              fullWidth
              name="jobTitle"
              error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}
              value={formik.values.jobTitle
                .trimStart()
                .replace(/\s\s+/g, "")
                .replace(/\p{Emoji_Presentation}/gu, "")}
              onChange={(e) => formik.handleChange(e)}
              helperText={
                formik.touched.jobTitle &&
                formik.errors.jobTitle &&
                formik.errors.jobTitle
              }
            />
          </Grid>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <TextField
              sx={{ my: 2 }}
              label={"Email for Communication"}
              required
              fullWidth
              name="email"
              error={formik.touched.email && Boolean(formik.errors.email)}
              value={formik.values.email
                ?.trimStart()
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
          <Grid container spacing={2}>
            <Grid item lg={6} xl={6} md={12} xs={12} sm={12}>
              <Autocomplete
                required
                sx={{ my: 2, mx: 2 }}
                label={"Job Category"}
                name={"jobCategory"}
                fullWidth
                value={formik.values.jobCategory}
                selectOnFocus
                // clearOnBlur
                handleHomeEndKeys
                onChange={(event, newValue) => {
                  console.log(newValue);
                  if (typeof newValue === "string") {
                    formik.setFieldValue("jobCategory", newValue);

                    setCategory(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input

                    formik.setFieldValue("jobCategory", newValue.inputValue);

                    setCategory(newValue.inputValue);
                  } else {
                    formik.setFieldValue("jobCategory", newValue?.name);
                    handleJobCategory(newValue?.id);
                    setCategory(newValue?.id);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option?.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                // onChange={(event, item) => {
                //   formik.setFieldValue("jobCategory", item?.label);
                //   handleJobCategory(item?.id);
                //   setCategory(item?.id);
                // }}
                // options={jobCategory
                //   // ?.sort((a, b) => a?.jobCategory - b?.name)
                //   .map((item) => ({
                //     label: item?.name,
                //     value: item?.name,
                //     id: item?.id,
                //   }))}
                // isOptionEqualToValue={(option, value) =>
                //   option?.value === value
                // }
                options={jobCategory}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option?.name;
                }}
                // getOptionLabel={(option) =>
                //   option?.name === null || option?.name === undefined
                //     ? option
                //     : option?.name
                // }
                freeSolo={true}
                // renderOption={(props, option) => (
                //   <li {...props}>{option?.name}</li>
                // )}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label={"Job Category"}
                    error={
                      formik.touched.jobCategory &&
                      Boolean(formik.errors.jobCategory)
                    }
                    helperText={
                      formik.touched.jobCategory &&
                      formik.errors.jobCategory &&
                      formik.errors.jobCategory
                    }
                    variant={"outlined"}
                    InputProps={{
                      ...params.InputProps,
                    }}
                    value={formik?.values?.jobCategory}
                  />
                )}
              />
            </Grid>
            <Grid item lg={6} xl={6} md={12} xs={12} sm={12}>
              <Autocomplete
                required
                sx={{ my: 2, mx: 2 }}
                label={"Job Sub Category"}
                name={"jobSubCategory"}
                fullWidth
                value={formik.values.jobSubCategory}
                selectOnFocus
                // clearOnBlur
                handleHomeEndKeys
                // onChange={(event, item) => {
                //   formik.setFieldValue("jobSubCategory", item?.label);
                //   setSubCategory(item?.id);
                // }}

                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option?.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue("jobSubCategory", newValue);

                    setSubCategory(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input

                    formik.setFieldValue("jobSubCategory", newValue.inputValue);

                    setSubCategory(newValue.inputValue);
                  } else {
                    formik.setFieldValue("jobSubCategory", newValue?.name);
                    setSubCategory(newValue?.id);
                  }
                }}
                options={subCategoryList}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option?.name;
                }}
                // getOptionLabel={(option) =>
                //   option?.name === null || option?.name === undefined
                //     ? option
                //     : option?.name
                // }
                // options={subCategoryList
                //   ?.sort((a, b) => a?.name - b?.name)
                //   .map((item) => ({
                //     label: item?.name,
                //     value: item?.name,
                //     id: item?.id,
                //   }))}
                // isOptionEqualToValue={(option, value) =>
                //   option?.value === value
                // }
                freeSolo={true}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label={"Job Sub Category"}
                    error={
                      formik.touched.jobSubCategory &&
                      Boolean(formik.errors.jobSubCategory)
                    }
                    helperText={
                      formik.touched.jobSubCategory &&
                      formik.errors.jobSubCategory &&
                      formik.errors.jobSubCategory
                    }
                    variant={"outlined"}
                    InputProps={{
                      ...params.InputProps,
                    }}
                    value={formik?.values?.jobSubCategory}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
            <Autocomplete
              required
              sx={{ my: 2 }}
              label={"Skills"}
              name={"skills"}
              fullWidth
              value={formik.values.skills}
              multiple
              onChange={(event, item) => {
                formik.setFieldValue("skills", item);
              }}
              options={skills}
              getOptionLabel={(option) =>
                option?.name === null || option?.name === undefined
                  ? option
                  : option?.name
              }
              // options={skills
              //   // ?.sort((a, b) => a?.name - b?.name)
              //   .map((item) => ({
              //     label: item?.name,
              //     name: item?.id,
              //   }))}
              limitTags={2}
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
                  placeholder="Select Skill(s)"
                  error={formik.touched.skills && Boolean(formik.errors.skills)}
                  helperText={
                    formik.touched.skills &&
                    formik.errors.skills &&
                    formik.errors.skills
                  }
                  variant={"outlined"}
                  InputProps={{
                    ...params.InputProps,
                  }}
                  value={formik?.values?.skills}
                />
              )}
            />
          </Grid>
          <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Grid container spacing={2}>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                  <TextField
                    sx={{ my: 2 }}
                    label={"Experience From "}
                    type="number"
                    fullWidth
                    name="from"
                    value={experiance[0] || 0}
                    onChange={(e) => {
                      setExperiance([e.target.value, experiance[1]]);
                    }}
                  />
                </Grid>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                  <TextField
                    sx={{ my: 2 }}
                    label={" Experience To "}
                    type="number"
                    fullWidth
                    name="to"
                    value={experiance[1] || 0}
                    onChange={(e) => {
                      setExperiance([experiance[0], e.target.value]);
                    }}
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      px: 8,
                    }}
                  >
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      marks={[
                        {
                          value: 0,
                          label: "1 Year",
                        },

                        {
                          value: 100,
                          label: "50years",
                        },
                      ]}
                      value={experiance}
                      onChange={handleChangeExp}
                      valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Grid container spacing={2}>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                  <TextField
                    sx={{ my: 2 }}
                    label={"Salary From "}
                    type="number"
                    fullWidth
                    name="from"
                    value={salary[0] || 0}
                    onChange={(e) => {
                      setSalary([e.target.value, salary[1]]);
                    }}
                  />
                </Grid>
                <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                  <TextField
                    sx={{ my: 2 }}
                    label={" Salary To "}
                    type="number"
                    fullWidth
                    name="to"
                    value={salary[1] || 0}
                    onChange={(e) => {
                      setSalary([salary[0], e.target.value]);
                    }}
                  />
                </Grid>
                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      px: 8,
                    }}
                  >
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      marks={[
                        {
                          value: 0,
                          label: "1 LPA",
                        },

                        {
                          value: 100,
                          label: "100 LPA",
                        },
                      ]}
                      value={salary}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={6} xl={6} xs={12} md={6} sm={12}>
              <FormControl
                fullWidth
                sx={{ my: 2, mx: 2 }}
                error={
                  formik.touched.noticePeriod &&
                  Boolean(formik.errors.noticePeriod)
                }
              >
                <InputLabel
                  id="demo-simple-select-label "
                  error={
                    formik.touched.noticePeriod &&
                    Boolean(formik.errors.noticePeriod)
                  }
                >
                  Notice Period *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.noticePeriod}
                  label="Notice Period *"
                  error={
                    formik.touched.noticePeriod &&
                    Boolean(formik.errors.noticePeriod)
                  }
                  helperText={
                    formik.touched.noticePeriod &&
                    formik.errors.noticePeriod &&
                    formik.errors.noticePeriod
                  }
                  onChange={(e) =>
                    formik.setFieldValue("noticePeriod", e.target.value)
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
                  {formik.touched.noticePeriod &&
                    formik.errors.noticePeriod &&
                    formik.errors.noticePeriod}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item lg={6} xl={6} xs={12} md={6} sm={12}>
              <FormControl
                fullWidth
                sx={{ my: 2, mx: 2 }}
                error={formik.touched.jobType && Boolean(formik.errors.jobType)}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  error={
                    formik.touched.jobType && Boolean(formik.errors.jobType)
                  }
                >
                  Job Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.jobType}
                  label="Job Type *"
                  error={
                    formik.touched.jobType && Boolean(formik.errors.jobType)
                  }
                  onChange={(e) =>
                    formik.setFieldValue("jobType", e.target.value)
                  }
                >
                  <MenuItem value={"contract"}>Contract</MenuItem>
                  <MenuItem value={"internship"}>Internship</MenuItem>
                  <MenuItem value={"onsite"}>On Site</MenuItem>
                  <MenuItem value={"permenant"}>Permenant</MenuItem>
                  <MenuItem value={"parttime"}>Part Time</MenuItem>
                  <MenuItem value={"temporary"}>Temporary</MenuItem>
                  <MenuItem value={"wfh"}>WFH</MenuItem>
                </Select>
                <FormHelperText>
                  {formik.touched.jobType &&
                    formik.errors.jobType &&
                    formik.errors.jobType}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <InputLabel id="jd" sx={{ my: 2 }}>
              {" "}
              Job Short Description
            </InputLabel>
            <ReactDraftWysiwyg
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              editorState={jd}
              onEditorStateChange={(data) => setJd(data)}
              labelId="jd"
              // toolbar={{
              //   inline: { inDropdown: true },
              //   list: { inDropdown: true },
              //   // textAlign: { inDropdown: true },
              //   // link: { inDropdown: true },
              //   history: { inDropdown: true },
              // }}
            />
          </Grid>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={6} sx={{ my: 2 }}>
            <Autocomplete
              id="location"
              name="location"
              label="Job Location*"
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
                  label="Job Location *"
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
            <Grid
              item
              lg={12}
              xl={12}
              xs={12}
              md={12}
              sm={6}
              sx={{ my: 2, ml: 2 }}
            >
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
            label="Address Line 1 (e.g. House No./ Street
            Name) *"
            variant={"outlined"}
            fullWidth
            sx={{ my: 2, mx: 2 }}
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
            fullWidth
            sx={{ my: 2, mx: 2 }}
            name="addressLineTwo"
            value={formik.values.addressLineTwo}
            onChange={formik.handleChange}
          />
          <Grid container spacing={2} sx={{ mx: 0.2 }}>
            <Grid item lg={6} xl={6} xs={12} md={12} sm={12} sx={{ my: 2 }}>
              <TextField
                id="country"
                label="Country *"
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
                error={formik.touched.country && Boolean(formik.errors.country)}
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
          <Grid container spacing={2} sx={{ mx: 0.2 }}>
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
                label="Postal Code *"
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
                  formik.touched.postalCode && Boolean(formik.errors.postalCode)
                }
                helperText={
                  formik.touched.postalCode &&
                  formik.errors.postalCode &&
                  formik.errors.postalCode
                }
              />
            </Grid>
          </Grid>
          {/* <Grid container spacing={2} sx={{ mx: 0.2 }}>
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
          </Grid> */}
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <LoadingButton
              fullWidth
              loading={isLoading}
              variant="contained"
              onClick={() => formik.handleSubmit()}
            >
              {id !== "" ? "Update Job" : "Create Job"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideBarJob;
