// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Context Imports
import {
  Grid,
  Box,
  Button,
  CardActionArea,
  CardActions,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import Icon from "src/@core/components/icon";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import MuiTabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import TabPanel from "@mui/lab/TabPanel";
import useMediaQuery from "@mui/material/useMediaQuery";
import TabContext from "@mui/lab/TabContext";
// ** MUI Imports
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import UserProfileHeader from "./UserProfileHeader";
import AddNewEducation from "./components/AddNewEducation";
import EditEducation from "./components/EditEducation";
import AddNewExperiance from "./components/AddNewExperiance";
import EditExperiance from "./components/EditExperiance";
import {
  getProfile,
  removeJobseekerEducation,
  removeJobseekerExperience,
} from "src/api-services/seeker/profile";
import EditBasicInfo from "./components/EditBasicInfo";
import useNotification from "src/hooks/useNotification";
import BasicInfo from "./components/BasicInfo";
import CommonLoader from "src/shared/CommonLoader";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ResumeSection from "./components/ResumeSection";
import CustomChip from "src/@core/components/mui/chip";
import CertificationDetail from "./components/CertificationDetail";
import AddCertification from "./components/AddCertification";
import EditCertification from "./components/EditCertification";

const userStatusObj = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

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
  const theme = useTheme();
  const { direction } = theme;
  const [activeTab, setActiveTab] = useState("info");
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [selectedExp, setSelectedExp] = useState(null);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [sendNotification] = useNotification();
  const [isEditMode, setIsEditMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [drawerState, setDrawerState] = useState({
    isBasicInfoEdit: false,
    isAddNewEducation: false,
    isEditEducation: false,
    isAddNewExperiance: false,
    isEditExperiance: false,
  });

  const [userDetail, setUserDetail] = useState(null);

  const handleChangeLoading = (status) => {
    setIsLoading(status);
  };

  const handleSelectExp = (item) => {
    setSelectedExp(item);
  };

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

  const handleTabChange = (event, value) => {
    // setIsLoading(true)
    setActiveTab(value);
  };

  const getProfileDetail = async () => {
    handleChangeLoading(true);
    try {
      const response = await getProfile();
      if (response?.data?.data) {
        setUserDetail(response.data.data);
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      handleChangeLoading(false);
    }
  };

  useEffect(() => {
    getProfileDetail();
  }, []);

  const handleDeleteEducation = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    handleChangeLoading(true);
    try {
      const apiData = {
        education_id: formValue,
      };
      const response = await removeJobseekerEducation(apiData);
      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
        // handleClose();
      }
    } catch (e) {
      console.log("e", e);
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      handleChangeLoading(false);
    }
  };

  const handleDeleteExpirince = async (formValue) => {
    console.log("check");
    // setSubmitted(true);
    handleChangeLoading(true);
    try {
      const apiData = {
        experience_id: formValue,
      };
      const response = await removeJobseekerExperience(apiData);
      console.log("response", response);
      if (response.status === 200) {
        sendNotification({
          message: response?.data?.message,
          variant: "success",
        });
        getProfileDetail();
        // handleClose();
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      handleChangeLoading(false);
    }
  };

  const handleEditChange = () => {
    setIsEditMode(false);
  };

  const handleEditCloseChange = () => {
    setIsEditMode(true);
  };

  const formatDate = (dateValue) => {
    const inputDate = new Date(dateValue);
    const formattedDate = inputDate.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const handleSelectCertification = (item) => {
    setSelectedCertificate(item);
  };

  return (
    <>
      <CommonLoader isLoading={isLoading} />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserProfileHeader
            onHandleEdit={handleEditChange}
            getProfileDetail={getProfileDetail}
            onHandleChangeLoading={handleChangeLoading}
            userDetail={userDetail}
          />
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
                    <Tab
                      value="resume"
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            ...(!hideText && { "& svg": { mr: 2 } }),
                          }}
                        >
                          <Icon
                            fontSize="1.125rem"
                            icon="mingcute:profile-line"
                          />
                          {!hideText && "Resume"}
                        </Box>
                      }
                    />
                    <Tab
                      value="certification"
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            ...(!hideText && { "& svg": { mr: 2 } }),
                          }}
                        >
                          <Icon fontSize="1.125rem" icon="bxs:certification" />
                          {!hideText && "Certification"}
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
                        <>
                          {userDetail && (
                            <>
                              <BasicInfo
                                userDetail={userDetail}
                                isEditMode={isEditMode}
                                onHandleEditCloseChange={handleEditCloseChange}
                                getProfileDetail={getProfileDetail}
                                onHandleChangeLoading={handleChangeLoading}
                              />
                            </>
                          )}

                          {drawerState.isBasicInfoEdit && (
                            <>
                              <EditBasicInfo
                                getProfileDetail={getProfileDetail}
                                isOpen={drawerState.isBasicInfoEdit}
                                onClose={handleDrawerStateChangeClose}
                                userDetail={userDetail}
                              />
                            </>
                          )}
                        </>
                      )}
                      {activeTab === "education" && (
                        <Grid item md={12} xs={12}>
                          <>
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Grid container spacing={2} py={2}>
                                <Grid
                                  item
                                  lg={12}
                                  xl={12}
                                  xs={12}
                                  md={12}
                                  sm={12}
                                >
                                  {userDetail?.jobseekerDetails?.educations
                                    .length > 0 && (
                                    <Box>
                                      <Grid
                                        container
                                        spacing={2}
                                        columns={{ xs: 4, sm: 12, md: 12 }}
                                      >
                                        {userDetail?.jobseekerDetails?.educations?.map(
                                          (row, index) => {
                                            return (
                                              <Grid
                                                // item
                                                // xs={12}
                                                // sx={12}
                                                // lg={12}
                                                // xl={12}
                                                item
                                                xs={12}
                                                sm={6}
                                                md={6}
                                              >
                                                <Card
                                                  raised={false}
                                                  sx={{
                                                    mb: 2,
                                                    border:
                                                      "1px solid rgba(0, 0, 0, 0.5)",
                                                    "&:hover": {
                                                      boxShadow:
                                                        "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                                      transform:
                                                        "translateY(-5px)",
                                                    },
                                                  }}
                                                >
                                                  <CardContent sx={{ pb: 0 }}>
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <Grid
                                                        item
                                                        xs={11}
                                                        sm={11}
                                                        md={11}
                                                        lg={11}
                                                      >
                                                        <Typography
                                                          sx={{ mb: 4 }}
                                                          color="text.primary"
                                                          variant="h5"
                                                          gutterBottom
                                                        >
                                                          {row?.education_type ===
                                                            "10th" ||
                                                          row?.education_type ===
                                                            "12th" ? (
                                                            <>
                                                              <Typography
                                                                gutterBottom
                                                                variant="h5"
                                                                component="div"
                                                              >
                                                                {
                                                                  row?.education_type
                                                                }{" "}
                                                                {
                                                                  row?.grade_or_marks
                                                                }{" "}
                                                                %
                                                              </Typography>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <Typography
                                                                gutterBottom
                                                                variant="h5"
                                                                component="div"
                                                              >
                                                                {row?.course}{" "}
                                                                {
                                                                  row?.grade_or_marks
                                                                }{" "}
                                                                %
                                                              </Typography>
                                                            </>
                                                          )}
                                                        </Typography>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={1}
                                                        sm={1}
                                                        md={1}
                                                        lg={1}
                                                      >
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            mr: 2,
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          <Icon
                                                            onClick={() =>
                                                              handleDeleteEducation(
                                                                row?.id
                                                              )
                                                            }
                                                            fontSize="1.25rem"
                                                            icon="tabler:trash"
                                                            color="#D2042D"
                                                          />
                                                        </Box>
                                                      </Grid>
                                                    </Grid>
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        {(row.university_or_institute_name ||
                                                          row.board) && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.secondary",
                                                                },
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  mr: 2,
                                                                }}
                                                              >
                                                                <Icon
                                                                  fontSize="1.25rem"
                                                                  icon="tabler:building"
                                                                  color="brown"
                                                                />
                                                              </Box>

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  {row.university_or_institute_name ||
                                                                    row.board}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}

                                                        {row.university_or_institute_address && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.secondary",
                                                                },
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  mr: 2,
                                                                }}
                                                              >
                                                                <Icon
                                                                  fontSize="1.25rem"
                                                                  icon="tabler:map-pin"
                                                                  color="red"
                                                                />
                                                              </Box>

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  {
                                                                    row.university_or_institute_address
                                                                  }
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        {(row.year_of_passout ||
                                                          row.course_duration_end) && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.primary",
                                                                },
                                                              }}
                                                            >
                                                              {/* <Box
                                                            sx={{
                                                              display: "flex",
                                                              mr: 2,
                                                            }}
                                                          >
                                                            <Icon
                                                              fontSize="1.25rem"
                                                              icon="tabler:brand-google-analytics"
                                                              color="darkgreen"
                                                            />
                                                          </Box> */}

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  Years of
                                                                  passed out{" "}
                                                                  {row.year_of_passout ||
                                                                    row.course_duration_end}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}
                                                      </Grid>
                                                      {/* <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            "&:not(:last-of-type)":
                                                              { mb: 3 },
                                                            "& svg": {
                                                              color:
                                                                "text.primary",
                                                            },
                                                          }}
                                                        >
                                                          <Box
                                                            sx={{
                                                              display: "flex",
                                                              mr: 2,
                                                              color: "warning",
                                                            }}
                                                          >
                                                            ₹
                                                          </Box>

                                                          <Box
                                                            sx={{
                                                              columnGap: 2,
                                                              display: "flex",
                                                              flexWrap: "wrap",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <Typography
                                                              sx={{
                                                                color:
                                                                  "text.primary",
                                                              }}
                                                            >
                                                              {`${
                                                                row.salary_from +
                                                                "-" +
                                                                row.salary_to
                                                              } LPA`}
                                                            </Typography>
                                                          </Box>
                                                        </Box>
                                                      </Grid> */}
                                                      {/* <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        <CustomChip
                                                          rounded
                                                          skin="light"
                                                          size="small"
                                                          label={row.job_type}
                                                          color={
                                                            userStatusObj[
                                                              row.status
                                                            ]
                                                          }
                                                          sx={{
                                                            textTransform:
                                                              "capitalize",
                                                          }}
                                                        />
                                                      </Grid> */}
                                                    </Grid>
                                                  </CardContent>
                                                  <CardActions
                                                    sx={{ pb: 3, pl: 0 }}
                                                  >
                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} lg={6}>
                                                        <Typography
                                                          // component="div"
                                                          color="text.secondary"
                                                          sx={{ fontSize: 16 }}
                                                        ></Typography>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        lg={6}
                                                        sx={{
                                                          display: "flex",
                                                          justifyContent:
                                                            "flex-end",
                                                        }}
                                                      >
                                                        <Button
                                                          size="small"
                                                          variant="contained"
                                                          onClick={() => {
                                                            setSelectedEducation(
                                                              row
                                                            );
                                                            handleDrawerStateChangeOpen(
                                                              "isEditEducation"
                                                            );
                                                          }}
                                                        >
                                                          Edit
                                                        </Button>
                                                      </Grid>
                                                    </Grid>
                                                  </CardActions>
                                                </Card>
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </Grid>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </CardContent>

                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Grid container spacing={2} py={2}>
                                <Grid
                                  item
                                  lg={6}
                                  xl={6}
                                  xs={12}
                                  md={12}
                                  sm={12}
                                >
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
                          </>
                          {drawerState.isEditEducation && (
                            <EditEducation
                              isOpen={drawerState.isEditEducation}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              selectedEducation={selectedEducation}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}

                          {drawerState.isAddNewEducation && (
                            <AddNewEducation
                              isOpen={drawerState.isAddNewEducation}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}
                        </Grid>
                      )}
                      {activeTab === "work" && (
                        <Grid item md={12} xs={12}>
                          <>
                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Grid container spacing={2} py={2}>
                                <Grid
                                  item
                                  lg={12}
                                  xl={12}
                                  xs={12}
                                  md={12}
                                  sm={12}
                                >
                                  {userDetail?.jobseekerDetails?.experiences
                                    .length > 0 && (
                                    <Box>
                                      <Grid
                                        container
                                        spacing={2}
                                        columns={{ xs: 4, sm: 12, md: 12 }}
                                      >
                                        {userDetail?.jobseekerDetails?.experiences?.map(
                                          (row, index) => {
                                            return (
                                              <Grid item xs={12} sm={6} md={6}>
                                                <Card
                                                  raised={false}
                                                  sx={{
                                                    mb: 2,
                                                    border:
                                                      "1px solid rgba(0, 0, 0, 0.5)",
                                                    "&:hover": {
                                                      boxShadow:
                                                        "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                                      transform:
                                                        "translateY(-5px)",
                                                    },
                                                  }}
                                                >
                                                  <CardContent sx={{ pb: 0 }}>
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                          "space-between",
                                                      }}
                                                    >
                                                      <Grid
                                                        item
                                                        xs={11}
                                                        sm={11}
                                                        md={11}
                                                        lg={11}
                                                      >
                                                        <Typography
                                                          sx={{ mb: 4 }}
                                                          color="text.primary"
                                                          variant="h5"
                                                          gutterBottom
                                                        >
                                                          {row?.company_name && (
                                                            <>
                                                              <Typography
                                                                gutterBottom
                                                                variant="h5"
                                                                component="div"
                                                              >
                                                                {
                                                                  row.company_name
                                                                }
                                                              </Typography>
                                                            </>
                                                          )}
                                                        </Typography>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={1}
                                                        sm={1}
                                                        md={1}
                                                        lg={1}
                                                      >
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            mr: 2,
                                                            cursor: "pointer",
                                                          }}
                                                        >
                                                          <Icon
                                                            onClick={() => {
                                                              handleDeleteExpirince(
                                                                row.id
                                                              );
                                                            }}
                                                            fontSize="1.25rem"
                                                            icon="tabler:trash"
                                                            color="#D2042D"
                                                          />
                                                        </Box>
                                                      </Grid>
                                                    </Grid>
                                                    <Grid
                                                      container
                                                      spacing={2}
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        {row.designation && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.secondary",
                                                                },
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  mr: 2,
                                                                }}
                                                              >
                                                                <Icon
                                                                  fontSize="1.25rem"
                                                                  icon="eos-icons:cluster-role"
                                                                  color="brown"
                                                                />
                                                              </Box>

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  {
                                                                    row.designation
                                                                  }
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}

                                                        {row.skills.length >
                                                          0 && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.secondary",
                                                                },
                                                              }}
                                                            >
                                                              <Box
                                                                sx={{
                                                                  display:
                                                                    "flex",
                                                                  mr: 2,
                                                                }}
                                                              >
                                                                <Icon
                                                                  fontSize="1.25rem"
                                                                  icon="carbon:skill-level"
                                                                  color="red"
                                                                />
                                                              </Box>

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  Skill:{" "}
                                                                  {row?.skills.map(
                                                                    (
                                                                      element,
                                                                      index
                                                                    ) => (
                                                                      <span
                                                                        key={
                                                                          index
                                                                        }
                                                                      >
                                                                        {
                                                                          element
                                                                        }
                                                                        {index !==
                                                                          userDetail
                                                                            ?.jobseekerDetails
                                                                            ?.skills
                                                                            .length -
                                                                            1 &&
                                                                          ", "}
                                                                      </span>
                                                                    )
                                                                  )}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        {row.end_date && (
                                                          <>
                                                            <Box
                                                              sx={{
                                                                display: "flex",
                                                                "&:not(:last-of-type)":
                                                                  { mb: 3 },
                                                                "& svg": {
                                                                  color:
                                                                    "text.primary",
                                                                },
                                                              }}
                                                            >
                                                              {/* <Box
                                                            sx={{
                                                              display: "flex",
                                                              mr: 2,
                                                            }}
                                                          >
                                                            <Icon
                                                              fontSize="1.25rem"
                                                              icon="tabler:brand-google-analytics"
                                                              color="darkgreen"
                                                            />
                                                          </Box> */}

                                                              <Box
                                                                sx={{
                                                                  columnGap: 2,
                                                                  display:
                                                                    "flex",
                                                                  flexWrap:
                                                                    "wrap",
                                                                  alignItems:
                                                                    "center",
                                                                }}
                                                              >
                                                                <Typography
                                                                  sx={{
                                                                    color:
                                                                      "text.primary",
                                                                  }}
                                                                >
                                                                  Relieving
                                                                  date:{" "}
                                                                  {formatDate(
                                                                    row.end_date
                                                                  )}
                                                                </Typography>
                                                              </Box>
                                                            </Box>
                                                          </>
                                                        )}
                                                      </Grid>
                                                      {/* <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            "&:not(:last-of-type)":
                                                              { mb: 3 },
                                                            "& svg": {
                                                              color:
                                                                "text.primary",
                                                            },
                                                          }}
                                                        >
                                                          <Box
                                                            sx={{
                                                              display: "flex",
                                                              mr: 2,
                                                              color: "warning",
                                                            }}
                                                          >
                                                            ₹
                                                          </Box>

                                                          <Box
                                                            sx={{
                                                              columnGap: 2,
                                                              display: "flex",
                                                              flexWrap: "wrap",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <Typography
                                                              sx={{
                                                                color:
                                                                  "text.primary",
                                                              }}
                                                            >
                                                              {`${
                                                                row.salary_from +
                                                                "-" +
                                                                row.salary_to
                                                              } LPA`}
                                                            </Typography>
                                                          </Box>
                                                        </Box>
                                                      </Grid> */}
                                                      {/* <Grid
                                                        item
                                                        xs={12}
                                                        sm={4}
                                                        md={3}
                                                        lg={3}
                                                      >
                                                        <CustomChip
                                                          rounded
                                                          skin="light"
                                                          size="small"
                                                          label={row.job_type}
                                                          color={
                                                            userStatusObj[
                                                              row.status
                                                            ]
                                                          }
                                                          sx={{
                                                            textTransform:
                                                              "capitalize",
                                                          }}
                                                        />
                                                      </Grid> */}
                                                    </Grid>
                                                  </CardContent>
                                                  <CardActions
                                                    sx={{ pb: 3, pl: 0 }}
                                                  >
                                                    <Grid container spacing={2}>
                                                      <Grid item xs={12} lg={6}>
                                                        <Typography
                                                          // component="div"
                                                          color="text.secondary"
                                                          sx={{ fontSize: 16 }}
                                                        ></Typography>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        lg={6}
                                                        sx={{
                                                          display: "flex",
                                                          justifyContent:
                                                            "flex-end",
                                                        }}
                                                      >
                                                        <Button
                                                          size="small"
                                                          variant="contained"
                                                          onClick={() => {
                                                            handleSelectExp(
                                                              item
                                                            );
                                                            handleDrawerStateChangeOpen(
                                                              "isEditExperiance"
                                                            );
                                                          }}
                                                        >
                                                          Edit
                                                        </Button>
                                                      </Grid>
                                                    </Grid>
                                                  </CardActions>
                                                </Card>
                                              </Grid>
                                            );
                                          }
                                        )}
                                      </Grid>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </CardContent>

                            <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Grid container spacing={2} py={2}>
                                <Grid
                                  item
                                  lg={6}
                                  xl={6}
                                  xs={12}
                                  md={12}
                                  sm={12}
                                >
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
                          </>
                          {drawerState.isEditExperiance && (
                            <EditExperiance
                              isOpen={drawerState.isEditExperiance}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              selectedExp={selectedExp}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}

                          {drawerState.isAddNewExperiance && (
                            <AddNewExperiance
                              isOpen={drawerState.isAddNewExperiance}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}
                        </Grid>
                      )}

                      {activeTab === "resume" && (
                        <ResumeSection
                          userDetail={userDetail}
                          getProfileDetail={getProfileDetail}
                          onHandleChangeLoading={handleChangeLoading}
                        />
                      )}
                      {activeTab === "certification" && (
                        <>
                          <CertificationDetail
                            userDetail={userDetail}
                            getProfileDetail={getProfileDetail}
                            onHandleChangeLoading={handleChangeLoading}
                            handleDrawerStateChangeOpen={
                              handleDrawerStateChangeOpen
                            }
                            handleSelectCertification={
                              handleSelectCertification
                            }
                          />

                          {drawerState.isEditCertification && (
                            <EditCertification
                              isOpen={drawerState.isEditCertification}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              selectedCertificate={selectedCertificate}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}

                          {drawerState.isAddCertification && (
                            <AddCertification
                              isOpen={drawerState.isAddCertification}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              onHandleChangeLoading={handleChangeLoading}
                            />
                          )}
                        </>
                      )}
                    </TabPanel>
                  )}
                </Grid>
              </Grid>
            </TabContext>
          </Grid>
        )}
      </Grid>
    </>
  );
};
ACLPage.acl = {
  action: "read",
  subject: "jsprofile",
};

export default ACLPage;
