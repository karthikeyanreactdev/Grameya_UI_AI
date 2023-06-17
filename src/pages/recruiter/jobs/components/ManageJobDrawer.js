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
import { addUser } from "src/store/apps/user";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  createJob,
  getJobById,
  updateJobById,
} from "src/api-services/recruiter/jobs";
import useNotification from "src/hooks/useNotification";
import validationSchema from "../validation";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const SideBarJob = (props) => {
  // ** Props
  const { open, toggle, id } = props;

  // ** State
  const [plan, setPlan] = useState("basic");
  const [role, setRole] = useState("subscriber");

  // ** Hooks
  const dispatch = useDispatch();
  const [sendNotification] = useNotification();
  const { userData } = useSelector((state) => state.auth);

  const [salary, setSalary] = useState([0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [experiance, setExperiance] = useState([0, 0]);
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
    validationSchema: validationSchema,
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
        short_description: `${draftToHtml(
          convertToRaw(jd.getCurrentContent())
        )}`
          // .replace(/\"/g, '"')
          .replace(/\"/g, '"'),
        email: values.email,
        address_line_one: "Kulithalai bus stand",
        address_line_two: "Kulithalai",
        city: "Karur",
        state: "Tamilnadu",
        postal_code: "639120",
        latitude: "10.77348284",
        longitude: "78.8874482492",
      };

      try {
        let result = null;
        if (id === "") {
          result = await createJob(params);
        } else {
          params["job_id"] = id;
          result = await updateJobById(params);
        }
        toggle();
        formik.resetForm();
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
        if (Array.isArray(data?.skills)) {
          let mapping_value = data?.skills.map((item) =>
            categoryList.find((e) => e.jobCategory === item)
          );
          formik.setFieldValue("skills", mapping_value);
        }
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
    if (id !== "") {
      getJob();
    } else {
      if (userData) {
        formik.setFieldValue("email", userData?.email);
      }
    }
  }, [id]);
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
              label={"Email for notification"}
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
                  formik.setFieldValue("jobCategory", item?.label);
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
                  formik.setFieldValue("jobSubCategory", item?.label);
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
            <FormControl
              fullWidth
              sx={{ my: 2 }}
              error={formik.touched.location && Boolean(formik.errors.location)}
            >
              <InputLabel
                id="demo-simple-select-label"
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
              >
                Job Location *
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.location}
                label="Job Location *"
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={
                  formik.touched.location &&
                  formik.errors.location &&
                  formik.errors.location
                }
                onChange={(e) =>
                  formik.setFieldValue("location", e.target.value)
                }
              >
                <MenuItem value={"Chennai"}>Chennai</MenuItem>
                <MenuItem value={"Delhi"}>Delhi</MenuItem>
                <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
              </Select>
              <FormHelperText>
                {formik.touched.location &&
                  formik.errors.location &&
                  formik.errors.location}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
            <Autocomplete
              required
              sx={{ my: 2 }}
              label={"Skills"}
              name={"skills"}
              fullWidth
              defaultValue={formik.values.skills}
              multiple
              onChange={(event, item) => {
                formik.setFieldValue("skills", item);
              }}
              options={categoryList.map((option) => option.jobCategory)}
              limitTags={10}
              freeSolo
              filterSelectedOptions
              disableClearable
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
                    label={"Experiance From "}
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
                    label={" Experiance To "}
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
                  <MenuItem value={"internship"}>Internship</MenuItem>
                  <MenuItem value={"permenant"}>Permenant</MenuItem>
                  <MenuItem value={"temporary"}>Temporary</MenuItem>
                  <MenuItem value={"onsite"}>On Site</MenuItem>
                  <MenuItem value={"wfh"}>WFH</MenuItem>
                  <MenuItem value={"contract"}>Contract</MenuItem>
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
              Job Shot Description
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
              {id !== "" ? "Update Job" : "Create Job"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideBarJob;
