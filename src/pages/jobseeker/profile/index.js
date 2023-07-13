// ** React Imports
import { useContext, useEffect, useRef, useState } from "react";

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
  Tooltip,
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
import AddNewExperiance from "./components/AddNewExperiance";
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
import { DeleteOutline } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "src/store/apps/auth";
import Swal from "sweetalert2";
import moment from "moment";
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
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("info");
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const { userData } = useSelector((state) => state.auth);

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
  const resumeComponentRef = useRef(null);

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
    setSelectedCertificate(null);
    setSelectedExp(null);
    setSelectedEducation(null);
    setDrawerState(newDrawerState);
  };

  const handleTabChange = (event, value) => {
    // setIsLoading(true)
    setActiveTab(value);
  };

  const getProfileDetail = async () => {
    handleChangeLoading(true);
    dispatch(getUserData({}));
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
    Swal.fire({
      title: "Do you want to Delete?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
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
      }
    });
  };

  const handleDeleteExpirince = async (formValue) => {
    Swal.fire({
      title: "Do you want to Delete?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
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
      }
    });
  };

  const handleEditChange = () => {
    setIsEditMode(!isEditMode);
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

  const handleClick = () => {
    // Call the child component's function using the ref
    resumeComponentRef.current.handleFileUpload();
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
            userDetail={userData}
            isEditMode={isEditMode}
            activeTab={activeTab}
            onHandleDrawerStateChangeOpen={handleDrawerStateChangeOpen}
            handleClick={handleClick}
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
                          <Icon
                            fontSize="1.125rem"
                            icon="ic:outline-work-history"
                          />
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
                          <Icon
                            fontSize="1.125rem"
                            icon="simple-line-icons:badge"
                          />
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
                          <Card>
                            {/* <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Typography variant="h4" component="h4">
                                Education
                              </Typography>
                              {/* <Button
                                variant="contained"
                                onClick={() =>
                                  handleDrawerStateChangeOpen(
                                    "isAddNewEducation"
                                  )
                                }
                              >
                                Add New Education
                              </Button> *
                            </CardContent> */}

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
                                                md={4}
                                                lg={4}
                                                xl={4}
                                              >
                                                <Card
                                                  raised={false}
                                                  sx={{
                                                    mb: 2,
                                                    border:
                                                      "1px solid rgba(0, 0, 0, 0.5)",
                                                    // boxShadow: "0 0 2px 2px #187de4",
                                                    "&:hover": {
                                                      // boxShadow: "0px 5px 5px 5px rgba(0, 0, 0, 0.5)",
                                                      cursor: "pointer",

                                                      boxShadow:
                                                        "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                                      transform:
                                                        "translateY(-5px)",
                                                      // mb: 2,
                                                      // border: "1px solid #ededed",
                                                      // "&:hover": {
                                                      //   boxShadow:
                                                      //     "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                                      //   transform:
                                                      //     "translateY(-5px)",
                                                    },
                                                    height: "100%",
                                                  }}
                                                >
                                                  <CardContent>
                                                    <Typography
                                                      color="text.primary"
                                                      // variant="h6"
                                                      sx={{
                                                        fontWeight: "500",
                                                        fontSize: ".800rem",
                                                      }}
                                                    >
                                                      {row?.education_type ===
                                                        "10th" ||
                                                      row?.education_type ===
                                                        "12th" ? (
                                                        <>
                                                          {row?.education_type?.substring(
                                                            0,
                                                            20
                                                          )}
                                                        </>
                                                      ) : (
                                                        <>
                                                          {row?.course.length >=
                                                          50
                                                            ? row?.course?.substring(
                                                                0,
                                                                40
                                                              ) + ".."
                                                            : row?.course}
                                                        </>
                                                      )}
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        mt: 2,
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <Icon
                                                        // fontSize="1.25rem"
                                                        icon="emojione-v1:bar-chart"
                                                        color="primary"
                                                        fontSize="1rem"
                                                        // style={{
                                                        //   fontSize: "24px",
                                                        // }}
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        Passed with a{" "}
                                                        {row?.grade_or_marks}%
                                                        score.
                                                      </Typography>
                                                    </Box>

                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        alignItems: "center",
                                                        mt: 2,
                                                      }}
                                                    >
                                                      <Icon
                                                        fontSize="1rem"
                                                        icon="fxemoji:school"
                                                        color="black"
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        {row?.university_or_institute_name?.substring(
                                                          0,
                                                          30
                                                        ) ||
                                                          row?.board.substring(
                                                            0,
                                                            30
                                                          )}
                                                      </Typography>
                                                    </Box>
                                                    {row.university_or_institute_address && (
                                                      <>
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            gap: "10px",
                                                            alignItems:
                                                              "center",
                                                            mt: 2,
                                                          }}
                                                        >
                                                          <Icon
                                                            fontSize="1rem"
                                                            icon="mdi:location"
                                                            color="red"
                                                            // style={{
                                                            //   color:
                                                            //     "text.primary",
                                                            //   fontSize:
                                                            //     "0.775rem",
                                                            // }}
                                                          />
                                                          <Typography
                                                            sx={{
                                                              color:
                                                                "text.primary",
                                                              fontSize:
                                                                "0.775rem",
                                                            }}
                                                          >
                                                            {row?.university_or_institute_address.substring(
                                                              0,
                                                              50
                                                            )}
                                                          </Typography>
                                                        </Box>
                                                      </>
                                                    )}

                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        alignItems: "center",
                                                        mt: 2,
                                                      }}
                                                    >
                                                      <Icon
                                                        fontSize="1rem"
                                                        icon="fxemoji:graduationcap"
                                                        color="green"
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        Graduated in{" "}
                                                        {moment(
                                                          row.year_of_passout ||
                                                            row.course_duration_end
                                                        ).format("YYYY")}
                                                        .
                                                      </Typography>
                                                    </Box>
                                                  </CardContent>

                                                  <CardActions
                                                    sx={{
                                                      justifyContent: "end",
                                                    }}
                                                  >
                                                    <Button
                                                      size="small"
                                                      variant="contained"
                                                      color="error"
                                                      onClick={() =>
                                                        handleDeleteEducation(
                                                          row?.id
                                                        )
                                                      }
                                                    >
                                                      Delete
                                                    </Button>
                                                    <Button
                                                      size="small"
                                                      variant="contained"
                                                      onClick={() => {
                                                        setSelectedEducation(
                                                          row
                                                        );
                                                        handleDrawerStateChangeOpen(
                                                          "isAddNewEducation"
                                                        );
                                                      }}
                                                    >
                                                      Edit
                                                    </Button>
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
                          </Card>
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
                              selectedEducation={selectedEducation}
                            />
                          )}
                        </Grid>
                      )}

                      {activeTab === "work" && (
                        <Grid item md={12} xs={12}>
                          <Card>
                            {/* <CardContent
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                // mx: 32,
                                mt: 4,
                              }}
                            >
                              <Typography variant="h4" component="h4">
                                Work Experiance
                              </Typography>
                              {/* <Button
                                variant="contained"
                                onClick={() =>
                                  handleDrawerStateChangeOpen(
                                    "isAddNewExperiance"
                                  )
                                }
                              >
                                Add New
                              </Button> 
                            </CardContent> */}

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
                                              <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                lg={4}
                                                xl={4}
                                              >
                                                <Card
                                                  raised={false}
                                                  sx={{
                                                    mb: 2,
                                                    border:
                                                      "1px solid rgba(0, 0, 0, 0.5)",
                                                    // boxShadow: "0 0 2px 2px #187de4",
                                                    "&:hover": {
                                                      // boxShadow: "0px 5px 5px 5px rgba(0, 0, 0, 0.5)",
                                                      cursor: "pointer",

                                                      boxShadow:
                                                        "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                                                      transform:
                                                        "translateY(-5px)",
                                                    },
                                                    height: "100%",
                                                  }}
                                                >
                                                  <CardContent>
                                                    <Typography
                                                      color="text.primary"
                                                      // variant="h6"
                                                      sx={{
                                                        fontWeight: "500",
                                                        fontSize: ".800rem",
                                                      }}
                                                    >
                                                      {row?.company_name
                                                        .length > 50
                                                        ? row?.company_name?.substring(
                                                            0,
                                                            50
                                                          ) + ".."
                                                        : row?.company_name}
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        mt: 4,
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <Icon
                                                        fontSize="1rem"
                                                        icon="eos-icons:role-binding"
                                                        color="black"
                                                        // style={{
                                                        //   fontSize: "24px",
                                                        // }}
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        {row?.designation.substring(
                                                          0,
                                                          50
                                                        )}
                                                      </Typography>
                                                    </Box>

                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        alignItems: "center",
                                                        mt: 2,
                                                      }}
                                                    >
                                                      <Icon
                                                        fontSize="1rem"
                                                        icon="material-symbols:mindfulness-outline"
                                                        color="brown"
                                                        // style={{
                                                        //   fontSize: "24px",
                                                        // }}
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        {row?.skills.map(
                                                          (element, index) => (
                                                            <span key={index}>
                                                              {element}
                                                              {index !==
                                                                userDetail
                                                                  ?.jobseekerDetails
                                                                  ?.skills
                                                                  .length -
                                                                  1 && ", "}
                                                            </span>
                                                          )
                                                        )}
                                                      </Typography>
                                                    </Box>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: "10px",
                                                        alignItems: "center",
                                                        mt: 2,
                                                      }}
                                                    >
                                                      <Icon
                                                        fontSize="1rem"
                                                        icon="clarity:date-line"
                                                        // style={{
                                                        //   fontSize: "24px",
                                                        // }}
                                                      />
                                                      <Typography
                                                        sx={{
                                                          color: "text.primary",
                                                          fontSize: "0.775rem",
                                                        }}
                                                      >
                                                        Relieving date:{" "}
                                                        {formatDate(
                                                          row.end_date
                                                        )}
                                                      </Typography>
                                                    </Box>
                                                  </CardContent>

                                                  <CardActions
                                                    sx={{
                                                      justifyContent: "end",
                                                    }}
                                                  >
                                                    <Button
                                                      size="small"
                                                      variant="contained"
                                                      color="error"
                                                      onClick={() =>
                                                        handleDeleteExpirince(
                                                          row?.id
                                                        )
                                                      }
                                                    >
                                                      Delete
                                                    </Button>
                                                    <Button
                                                      size="small"
                                                      variant="contained"
                                                      onClick={() => {
                                                        handleSelectExp(row);
                                                        handleDrawerStateChangeOpen(
                                                          "isAddNewExperiance"
                                                        );
                                                      }}
                                                    >
                                                      Edit
                                                    </Button>
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
                          </Card>
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
                              selectedExp={selectedExp}
                            />
                          )}
                        </Grid>
                      )}

                      {activeTab === "resume" && (
                        <ResumeSection
                          userDetail={userDetail}
                          getProfileDetail={getProfileDetail}
                          onHandleChangeLoading={handleChangeLoading}
                          ref={resumeComponentRef}
                        />
                      )}
                      {activeTab === "certification" && (
                        <Card>
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

                          {drawerState.isAddCertification && (
                            <AddCertification
                              isOpen={drawerState.isAddCertification}
                              onClose={handleDrawerStateChangeClose}
                              getProfileDetail={getProfileDetail}
                              onHandleChangeLoading={handleChangeLoading}
                              selectedCertificate={selectedCertificate}
                            />
                          )}
                        </Card>
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
