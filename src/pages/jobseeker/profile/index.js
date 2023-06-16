// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Box,
  MenuItem,
  Button,
  Divider,
  IconButton,
  CardActionArea,
  CardMedia,
  CardActions,
} from "@mui/material";
import Icon from "src/@core/components/icon";

import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import Slider from "@mui/material/Slider";
// ** Third Party Imports
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import MuiTabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import TabPanel from "@mui/lab/TabPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabContext from "@mui/lab/TabContext";
// ** MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import UserProfileHeader from "./UserProfileHeader";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "./PickersCustomInput";
import BasicInfoEditDrawer from "./components/BasicInfoEditDrawer";
import AddNewEducation from "./components/AddNewEducation";
import EditEducation from "./components/EditEducation";
import AddNewExperiance from "./components/AddNewExperiance";
import EditExperiance from "./components/EditExperiance";
import { getProfile } from "src/api-services/seeker/profile";

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: "0 !important",
  "&, & .MuiTabs-scroller": {
    boxSizing: "content-box",
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: 130,
    },
  },
}));

const ACLPage = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const store = useSelector((state) => state.user);
  const [salary, setSalary] = useState([0, 10]);
  const [activeTab, setActiveTab] = useState("info");
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [currentCTC, setCurrentCTC] = useState(0);
  const [expectedCTC, setExpectedCTC] = useState(0);
  const [experiance, setExperiance] = useState(1);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
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

  const [drawerState, setDrawerState] = useState({
    isBasicInfoEdit: false,
    isAddNewEducation: false,
    isEditEducation: false,
    isAddNewExperiance: false,
    isEditExperiance: false,
  });

  const [userdetail, setUserDetail] = useState(null);
  console.log("userdetail", userdetail);

  const handleDrawerStateChangeOpen = (parentName) => {
    const newDrawerState = { ...drawerState };
    newDrawerState[parentName] = true;
    setDrawerState(newDrawerState);
  };

  const handleDrawerStateChangeClose = (parentName) => {
    const newDrawerState = { ...drawerState };
    newDrawerState[parentName] = false;
    setDrawerState(newDrawerState);
  };

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
      noticePeriod: "",
      shortDescription: "",
      location: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      state: "",
      postalCode: "",
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
  const [workExperiance, setWorkExperiance] = useState([
    { companyName: "", designation: "", skills: [], doj: null, dol: null },
  ]);
  const handleFormChange = (index, event) => {
    let data = [...workExperiance];
    console.log(event);
    data[index][event.target.name] = event.target.value;
    setWorkExperiance(data);
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(workExperiance);
  };

  const addFields = () => {
    let object = {
      companyName: "",
      designation: "",
      skills: [],
      doj: null,
      dol: null,
    };

    setWorkExperiance([...workExperiance, object]);
  };

  const removeFields = (index) => {
    let data = [...workExperiance];
    data.splice(index, 1);
    setWorkExperiance(data);
  };
  const handleTabChange = (event, value) => {
    // setIsLoading(true)
    setActiveTab(value);
  };

  const getProfileDetail = async () => {
    try {
      const response = await getProfile();
      console.log("response======>", response);
      if (response?.data?.data) {
        setUserDetail(response.data.data);
      }
    } catch (e) {
      console.log("e", e);
    } finally {
    }
  };

  useEffect(() => {
    getProfileDetail();
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant="scrollable"
                  scrollButtons="auto"
                  onChange={handleTabChange}
                  aria-label="customized tabs example"
                >
                  <Tab
                    value="info"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:user-check" />
                        {!hideText && "Basic Info"}
                      </Box>
                    }
                  />
                  <Tab
                    value="education"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:books" />
                        {!hideText && "Education"}
                      </Box>
                    }
                  />
                  <Tab
                    value="work"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon fontSize="1.125rem" icon="tabler:layout-grid" />
                        {!hideText && "Work Experiance"}
                      </Box>
                    }
                  />
                </TabList>
              </Grid>
              <Grid item xs={12}>
                {false ? (
                  <Box
                    sx={{
                      mt: 6,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {activeTab === "info" && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          {/* <CardHeader title='Basic Info' /> */}
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.full_name && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      First Name
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {userdetail.full_name}
                                    </Typography>
                                  </Grid>
                                </>
                              )}

                              {userdetail?.last_name && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Last Name
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {userdetail.last_name}
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.email && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Email
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {userdetail?.email}
                                    </Typography>
                                  </Grid>
                                </>
                              )}

                              {userdetail?.phone && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Phone
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {userdetail?.phone}
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.jobseekerDetails
                                ?.current_location && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Current Location
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {
                                        userdetail?.jobseekerDetails
                                          ?.current_location
                                      }
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.jobseekerDetails
                                ?.current_location && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Current CTC
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {
                                        userdetail?.jobseekerDetails
                                          ?.current_salary
                                      }
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.jobseekerDetails?.notice_period && (
                                <>
                                  <Grid
                                    item
                                    lg={6}
                                    xl={6}
                                    xs={12}
                                    md={12}
                                    sm={12}
                                  >
                                    <Typography variant="h3" component="div">
                                      Notice Period
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                      {
                                        userdetail?.jobseekerDetails
                                          ?.notice_period
                                      }
                                    </Typography>
                                  </Grid>
                                </>
                              )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              {userdetail?.jobseekerDetails?.skills &&
                                userdetail?.jobseekerDetails?.skills.length && (
                                  <>
                                    <Grid
                                      item
                                      lg={6}
                                      xl={6}
                                      xs={12}
                                      md={12}
                                      sm={12}
                                    >
                                      <Typography variant="h3" component="div">
                                        Skils
                                      </Typography>
                                      <Typography variant="h5" component="div">
                                        {userdetail?.jobseekerDetails?.skills.map(
                                          (element, index) => (
                                            <span key={index}>
                                              {element}
                                              {index !==
                                                userdetail?.jobseekerDetails
                                                  ?.skills.length -
                                                  1 && ", "}
                                            </span>
                                          )
                                        )}
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDrawerStateChangeOpen(
                                      "isBasicInfoEdit"
                                    )
                                  }
                                >
                                  Edit Profile
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        <BasicInfoEditDrawer
                          isOpen={drawerState.isBasicInfoEdit}
                          onClose={handleDrawerStateChangeClose}
                        />
                      </Grid>
                    )}
                    {activeTab === "education" && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                {userdetail?.jobseekerDetails?.educations?.map(
                                  (item, key) => {
                                    return (
                                      <Card sx={{ mt: 3 }} key={key}>
                                        <CardActionArea>
                                          <CardContent>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.degree} {item?.grade_point}{" "}
                                              %
                                            </Typography>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.institution_name}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {item?.institution_address}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              year of pased out:{" "}
                                              {item?.year_of_passout}
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                          <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                              handleDrawerStateChangeOpen(
                                                "isEditEducation"
                                              )
                                            }
                                          >
                                            Edit
                                          </Button>
                                        </CardActions>
                                      </Card>
                                    );
                                  }
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDrawerStateChangeOpen(
                                      "isAddNewEducation"
                                    )
                                  }
                                >
                                  Add New Education
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        <EditEducation
                          isOpen={drawerState.isEditEducation}
                          onClose={handleDrawerStateChangeClose}
                        />
                        <AddNewEducation
                          isOpen={drawerState.isAddNewEducation}
                          onClose={handleDrawerStateChangeClose}
                        />
                      </Grid>
                    )}
                    {activeTab === "work" && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                {userdetail?.jobseekerDetails?.experiences?.map(
                                  (item, index) => {
                                    return (
                                      <Card sx={{ mt: 3 }} key={index}>
                                        <CardActionArea>
                                          <CardContent>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.company_name}
                                            </Typography>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {item?.designation}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              Skill:{" "}
                                              {item?.skills.map(
                                                (element, index) => (
                                                  <span key={index}>
                                                    {element}
                                                    {index !==
                                                      userdetail
                                                        ?.jobseekerDetails
                                                        ?.skills.length -
                                                        1 && ", "}
                                                  </span>
                                                )
                                              )}
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                          <Button
                                            size="small"
                                            color="primary"
                                            onClick={() =>
                                              handleDrawerStateChangeOpen(
                                                "isEditExperiance"
                                              )
                                            }
                                          >
                                            Edit
                                          </Button>
                                        </CardActions>
                                      </Card>
                                    );
                                  }
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>

                          <CardContent
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mx: 32,
                              mt: 4,
                            }}
                          >
                            <Grid container spacing={2} py={2}>
                              <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDrawerStateChangeOpen(
                                      "isAddNewExperiance"
                                    )
                                  }
                                >
                                  Add New
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        <EditExperiance
                          isOpen={drawerState.isEditExperiance}
                          onClose={handleDrawerStateChangeClose}
                        />
                        <AddNewExperiance
                          isOpen={drawerState.isAddNewExperiance}
                          onClose={handleDrawerStateChangeClose}
                        />
                      </Grid>
                    )}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  );
};
ACLPage.acl = {
  action: "read",
  subject: "jsprofile",
};

export default ACLPage;
