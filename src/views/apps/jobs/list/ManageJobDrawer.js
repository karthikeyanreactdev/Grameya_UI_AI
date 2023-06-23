// ** React Imports
import { useState } from "react";

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
import { EditorState, convertToRaw } from "draft-js";
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
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { createJob } from "src/api-services/recruiter/jobs";
import useNotification from "src/hooks/useNotification";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const schema = yup.object().shape({
  company: yup.string().required(),
  billing: yup.string().required(),
  country: yup.string().required(),
  email: yup.string().email().required(),
  contact: yup
    .number()
    .typeError("Contact Number field is required")
    .min(10, (obj) => showErrors("Contact Number", obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, (obj) => showErrors("First Name", obj.value.length, obj.min))
    .required(),
  username: yup
    .string()
    .min(3, (obj) => showErrors("Username", obj.value.length, obj.min))
    .required(),
});

const defaultValues = {
  companyName: "",
  jobTitle: "",
  jobCategory: "",
  jobSubCategory: "",
  experiance: "",
  jobType: "",
  noticePeriod: "",
  shortDescription: "",
  location: "",
  addressLineOne: "",
  addressLineTwo: "",
  city: "",
  state: "",
  postalCode: "",
};
function valuetext(value) {
  return `${value}°C`;
}

const SidebarAddUser = (props) => {
  // ** Props
  const { open, toggle } = props;

  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();
  const [sendNotification] = useNotification();
  const store = useSelector((state) => state.user);
  const [salary, setSalary] = useState([0, 10]);
  const [isLoading, setIsLoading] = useState(false);
  const [experiance, setExperiance] = useState([0, 20]);
  const [jd, setJd] = useState(EditorState.createEmpty());
  const [categoryList, setCategoryList] = useState([
    { id: 1, jobCategory: "IT" },
    { id: 2, jobCategory: "BPO" },
    { id: 3, jobCategory: "Banking" },
    { id: 4, jobCategory: "HR" },
  ]);
  const [subCategoryList, setSubCategoryList] = useState([
    { id: 101, pid: 1, category: "React" },
    { id: 102, pid: 2, category: "CRE" },
  ]);
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setSalary(newValue);
  };
  const handleChangeExp = (event, newValue) => {
    console.log(newValue);
    setExperiance(newValue);
  };
  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (
      store.allData.some(
        (u) => u.email === data.email || u.username === data.username
      )
    ) {
      store.allData.forEach((u) => {
        if (u.email === data.email) {
          setError("email", {
            message: "Email already exists!",
          });
        }
        if (u.username === data.username) {
          setError("username", {
            message: "Username already exists!",
          });
        }
      });
    } else {
      // dispatch(addUser({ ...data, role, currentPlan: plan }));
      toggle();
      reset();
    }
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
      email: "",
      // addressLineOne: "",
      // addressLineTwo: "",
      // city: "",
      // state: "",
      // postalCode: "",
    },
    //  validationSchema: SignUpValidationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setIsLoading(true);
      let skills = [];
      if (values.skills && values.skills.length > 0) {
        skills = values.skills.map((item) => item.jobCategory);
      }
      const params = {
        company_name: values.companyName,
        job_title: values.jobTitle,
        job_category: values.jobCategory,
        job_sub_category: values.jobSubCategory,
        location: values.location,
        skills: skills,
        experience_from: `${experiance[0]}`,
        experience_to: `${experiance[1]}`,
        salary_from: `${salary[0]}`,
        salary_to: `${salary[1]}`,
        notice_period: `${values.noticePeriod}`,
        job_type: `${values.jobType}`,
        short_description: values.shortDescription,
        email: values.email,
        address_line_one: "Kulithalai bus stand",
        address_line_two: "Kulithalai",
        city: "Karur",
        state: "Tamilnadu",
        postal_code: "639120",
        latitude: "10.77348284",
        longitude: "78.8874482492",
      };
      console.log(params);
      try {
        const result = await createJob(params);
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
    setPlan("basic");
    setRole("subscriber");
    setValue("contact", Number(""));
    toggle();
    reset();
  };
  console.log(draftToHtml(convertToRaw(jd.getCurrentContent())));

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: "100%", sm: "100%", lg: "50%" } },
      }}
    >
      <Header>
        <Typography variant="h5">Create a Job</Typography>
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
              label={"Email for Notification"}
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
                onChange={(event, item) => {
                  formik.setFieldValue("jobCategory", item.label);
                }}
                options={categoryList
                  ?.sort((a, b) => a?.jobCategory - b?.jobCategory)
                  .map((item) => ({
                    label: item.jobCategory,
                    value: item.jobCategory,
                  }))}
                isOptionEqualToValue={(option, value) => option.value === value}
                freeSolo={false}
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
                onChange={(event, item) => {
                  formik.setFieldValue("jobSubCategory", item.label);
                }}
                options={subCategoryList
                  ?.sort((a, b) => a?.category - b?.category)
                  .map((item) => ({
                    label: item.category,
                    value: item.category,
                  }))}
                isOptionEqualToValue={(option, value) => option.value === value}
                freeSolo={false}
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
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="demo-simple-select-label">
                Job Location *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.location}
                label="Job Location *"
                onChange={(e) =>
                  formik.setFieldValue("location", e.target.value)
                }
              >
                <MenuItem value={"Chennai"}>Chennai</MenuItem>
                <MenuItem value={"Delhi"}>Delhi</MenuItem>
                <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
              </Select>
            </FormControl>
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
              options={categoryList}
              getOptionLabel={(option) => option.jobCategory}
              limitTags={5}
              freeSolo={false}
              filterSelectedOptions
              disableClearable
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label={"Skills"}
                  placeholder="Select Skills"
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
                      getAriaValueText={valuetext}
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
                      getAriaValueText={valuetext}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={6} xl={6} xs={12} md={6} sm={12}>
              <FormControl fullWidth sx={{ my: 2, mx: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  Notice Period *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.noticePeriod}
                  label="Notice Period *"
                  onChange={(e) =>
                    formik.setFieldValue("noticePeriod", e.target.value)
                  }
                >
                  <MenuItem value={0}>Immediate</MenuItem>
                  <MenuItem value={15}>15 Days</MenuItem>
                  <MenuItem value={30}>30 Days</MenuItem>
                  <MenuItem value={90}>90 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item lg={6} xl={6} xs={12} md={6} sm={12}>
              <FormControl fullWidth sx={{ my: 2, mx: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  Job Type *
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formik.values.jobType}
                  label="Job Type *"
                  onChange={(e) =>
                    formik.setFieldValue("jobType", e.target.value)
                  }
                >
                  <MenuItem value={0}>Permenant</MenuItem>
                  <MenuItem value={15}>Temporary</MenuItem>
                  <MenuItem value={30}>OnSite</MenuItem>
                  <MenuItem value={90}>WFH</MenuItem>
                  <MenuItem value={90}>Contract</MenuItem>
                </Select>
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
            />
          </Grid>
          <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
            <LoadingButton
              fullWidth
              loading={isLoading}
              variant="contained"
              onClick={() => formik.handleSubmit()}
            >
              Create Job
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SidebarAddUser;
