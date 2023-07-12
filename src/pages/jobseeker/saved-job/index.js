// ** React Imports
import {
  useCallback,
  useContext,
  useState,
  forwardRef,
  useEffect,
} from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import CustomTextField from "src/@core/components/mui/text-field";
import CardStatsHorizontalWithDetails from "src/@core/components/card-statistics/card-stats-horizontal-with-details";
// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Actions Imports
import { fetchData, deleteUser } from "src/store/apps/user";

// ** Third Party Components
import axios from "axios";

// ** Custom Table Components Imports
import TableHeader from "src/views/apps/user/list/TableHeader";
// import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { makeStyles } from "@mui/styles";

import {
  handleResumeSearch,
  resumeCandidates,
  resumeSearchByFilter,
} from "src/store/apps/recruiter/resume-search";
import _ from "lodash";
import {
  Button,
  CardActions,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  TablePagination,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  handleMachedJobList,
  jobSearchSeeker,
} from "src/store/apps/jobseeker/job-search";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { addSaveJob, saveJobList } from "src/api-services/seeker/jobsdetails";
import useNotification from "src/hooks/useNotification";
import moment from "moment";

const userStatusObj = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};
const renderClient = (row) => {
  // if (row.avatar.length) {
  //   return (
  //     <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  //   );
  // } else {
  return (
    <CustomAvatar
      skin="light"
      // color={row.avatarColor}
      sx={{
        mr: 2.5,
        width: 38,
        height: 38,
        fontWeight: 500,
        fontSize: (theme) => theme.typography.body1.fontSize,
      }}
    >
      {getInitials(row.full_name ? row.full_name[0] : "NA")}
    </CustomAvatar>
  );
  // }
};
const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-root.MuiDataGrid-cell": {
      border: "none",
      borderColor: "transparent",
    },
  },
});

const CandidateSavedJob = () => {
  const router = useRouter();
  // ** Hooks
  const ability = useContext(AbilityContext);
  const theme = useTheme();
  const classes = useStyles();
  const [sendNotification] = useNotification();

  const dispatch = useDispatch();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [plan, setPlan] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45));
  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const handleNavigateJobDetail = (id) => {
    router.push(`${"/jobseeker/job-detail"}?id=${id}`);
  };

  // const handleLocationChange = useCallback((e) => {
  //   setLocation(e.target.value);
  // }, []);

  const handlePlanChange = useCallback((e) => {
    setPlan(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatus(e.target.value);
  }, []);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
  };
  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, "MM/dd/yyyy");
    const endDate =
      props.end !== null ? ` - ${format(props.end, "MM/dd/yyyy")}` : null;
    const value = `${startDate}${endDate !== null ? endDate : ""}`;

    return (
      <CustomTextField
        inputRef={ref}
        label={props.label || ""}
        {...props}
        value={value}
      />
    );
  });

  const [jobRole, setjobRole] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [jobType, setJobType] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [savedId, setSavedId] = useState("");
  const { machedJobList } = useSelector((state) => state.jobSearch);
  const [jobList, setJobList] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  const handleSearch = async () => {
    if (keyword === "") {
      return;
    }
    const params = {
      page: page,
      size: rowsPerPage,
      search_keyword: keyword,
      experience_from: "0",
      experience_to: experience,
      job_type: jobType,
      notice_period: noticePeriod,
      salary_from: salaryFrom,
      salary_to: salaryTo,
      job_location: location,
    };
    dispatch(jobSearchSeeker(params));
  };

  const [isLoading, setIsLoading] = useState(false);

  const viewJob = async () => {
    // setJobList([]);
    // setPageCount([]);
    setSavedId("");

    try {
      setIsLoading(true);
      const params = {
        page: page,
        size: rowsPerPage,
      };

      const result = await saveJobList();
      // toggle();
      console.log("result", result);
      console.log(result?.data?.data);
      setJobList(result?.data?.data?.data);
      setPageCount(result?.data?.data?.total);
      // setJobDetails(result?.data?.data);
      // sendNotification({
      //   message: result?.data?.message,
      //   variant: "success",
      // });
    } catch (e) {
      // sendNotification({
      //   message: e,
      //   variant: "error",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    viewJob();
  }, [rowsPerPage, page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleAddSavedJob = async (id) => {
    // const index = _.findIndex(jobList, ["job_id", id]);
    // // var result1 = _.slice(jobList, result, 1);
    // const newdata = jobList.splice(index, 1);

    // return;
    setSavedId(id);
    try {
      setIsBookmarkLoading(true);
      const param = {
        job_id: id,
      };

      const result = await addSaveJob(param);
      // toggle();
      console.log(result?.data?.data);
      // setJobDetails(result?.data?.data);
      // viewJob();
      var copy = JSON.parse(JSON.stringify(machedJobList));
      copy.map((elem) => {
        elem.is_saved = elem.id == id ? !elem.is_saved : elem.is_saved;
        return elem;
      });
      console.log(copy);
      viewJob();
      // const index2 = jobList.findIndex((obj) => obj.job_id === id);
      // const newData = [
      //   ...jobList.slice(0, index2),
      //   ...jobList.slice(index2 + 1),
      // ];
      // console.log(newData);
      // // setJobList(newData);
      // // setPageCount(pageCount - 1);
      // // dispatch(handleMachedJobList(copy));
      // // let data = _.find(machedJobList, { id: id });
      // // data.is_saved = true;
      // // console.log(data);
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
      setIsBookmarkLoading(false);
    }
  };
  return (
    <Grid container spacing={6} className={classes.root}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Saved Job" />
          <Divider sx={{ m: "0 !important" }} />

          {isLoading && savedId !== "" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 16,
                mt: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {jobList.length > 0 && (
            <Box p={4}>
              <Grid container spacing={2}>
                {jobList?.map((row) => {
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <Card
                        raised={false}
                        sx={{
                          mb: 2,
                          border: "1px solid rgba(0, 0, 0, 0.5)",
                          // boxShadow: "0 0 2px 2px #187de4",
                          "&:hover": {
                            // boxShadow: "0px 5px 5px 5px rgba(0, 0, 0, 0.5)",
                            // cursor: "pointer",

                            boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                            transform: "translateY(-5px)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{ pb: 0, pt: 0 }}
                          //onClick={() => handleNavigateJobDetail(row?.id)}
                        >
                          <Grid
                            container
                            spacing={2}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid item xs={11} sm={11} md={11} lg={11}>
                              <Typography
                                sx={{ mb: 1 }}
                                color="text.primary"
                                variant="h6"
                                gutterBottom
                              >
                                {row.job_title?.substring(0, 75)}
                              </Typography>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  my: 3,
                                  mr: 2,
                                }}
                              >
                                <LoadingButton
                                  loading={
                                    isBookmarkLoading && row.job_id === savedId
                                  }
                                  color={row?.is_saved ? "success" : "primary"}
                                  title="Save Job"
                                  onClick={() => handleAddSavedJob(row?.job_id)}
                                >
                                  {row?.is_saved ? (
                                    <Icon
                                      fontSize="1.5rem"
                                      icon="mdi:favorite-check"
                                    />
                                  ) : (
                                    <Icon
                                      fontSize="1.5rem"
                                      icon="mdi:favorite-add-outline"
                                      sx={{ bacground: "red" }}
                                      // color="error"
                                    />
                                  )}
                                </LoadingButton>
                              </Box>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1rem"
                                    icon="tabler:building"
                                    color="brown"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "text.primary",
                                      fontSize: "0.775rem",
                                    }}
                                  >
                                    {row.company_name?.substring(0, 30)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:not(:last-of-type)": { mb: 3 },
                                  "& svg": { color: "text.secondary" },
                                }}
                              >
                                <Box sx={{ display: "flex", mr: 2 }}>
                                  <Icon
                                    fontSize="1rem"
                                    icon="tabler:map-pin"
                                    color="red"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    columnGap: 2,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "text.primary",

                                      fontSize: "0.775rem",
                                    }}
                                  >
                                    {row.city}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              {row?.skills?.slice(0, 2).map((option, index) => (
                                <Chip
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  // color="black"
                                  sx={{
                                    mx: 1,
                                    fontSize: "0.675rem",
                                  }}
                                  // sx={{ color: "#" }}
                                  label={
                                    option?.name === null ||
                                    option?.name === undefined
                                      ? option.length > 15
                                        ? option?.substring(0, 15) + "..."
                                        : option
                                      : option?.name
                                  }
                                />
                              ))}
                              <Tooltip title={row?.skills?.join(",")}>
                                <Chip
                                  variant="outlined"
                                  color="primary"
                                  // color="black"
                                  size="small"
                                  sx={{
                                    mx: 1,
                                    // my: 1,
                                    fontSize: "0.675rem",
                                  }}
                                  // sx={{ color: "#" }}
                                  label={"more.."}
                                />
                              </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                              <Tooltip title="Experiance">
                                <Box
                                  sx={{
                                    display: "flex",
                                    "&:not(:last-of-type)": { mb: 3 },
                                    "& svg": { color: "text.primary" },
                                  }}
                                >
                                  <Box sx={{ display: "flex", mr: 2 }}>
                                    <Icon
                                      fontSize="1rem"
                                      icon="tabler:brand-google-analytics"
                                      color="darkgreen"
                                    />
                                  </Box>

                                  <Box
                                    sx={{
                                      columnGap: 2,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "text.primary",

                                        fontSize: "0.775rem",
                                      }}
                                    >
                                      {row.experience_from +
                                        "-" +
                                        row.experience_to}{" "}
                                      Years
                                    </Typography>
                                  </Box>
                                </Box>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                              {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {`₹${row.salary_from + "-" + row.salary_to} LPA`}
                      </Typography> */}
                              <Tooltip title={"Salary"}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    "&:not(:last-of-type)": { mb: 3 },
                                    "& svg": { color: "text.primary" },
                                  }}
                                >
                                  {/* <Box
                                  sx={{
                                    display: "flex",
                                    mr: 2,
                                    color: "warning",
                                  }}
                                >
                                  
                                </Box> */}

                                  <Box
                                    sx={{
                                      columnGap: 2,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "text.primary",

                                        fontSize: "0.775rem",
                                      }}
                                    >
                                      {`₹${
                                        row.salary_from + "-" + row.salary_to
                                      } LPA`}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                              <Tooltip title={"Notice Period"}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    "&:not(:last-of-type)": { mb: 3 },
                                    "& svg": { color: "text.primary" },
                                  }}
                                >
                                  <Box sx={{ display: "flex", mr: 2 }}>
                                    <Icon
                                      fontSize="1rem"
                                      icon="medical-icon:i-waiting-area"
                                      color="palered"
                                    />
                                  </Box>

                                  <Box
                                    sx={{
                                      columnGap: 2,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "text.primary",

                                        fontSize: "0.775rem",
                                      }}
                                    >
                                      {row?.notice_period}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                              <Typography
                                sx={{
                                  color: "text.primary",

                                  fontSize: "0.675rem",
                                }}
                              >
                                {"Posted : "}
                                {moment
                                  .utc(row?.created)
                                  .local()
                                  .startOf("seconds")
                                  .fromNow()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions sx={{ pb: 3, pl: 0, mt: 1 }}>
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
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  handleNavigateJobDetail(row?.job_id)
                                }
                              >
                                {row?.is_applied ? "Applied" : "View & Apply"}
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                  // return (
                  //   <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                  //     <Card
                  //       raised={false}
                  //       sx={{
                  //         mb: 2,
                  //         border: "1px solid rgba(0, 0, 0, 0.5)",
                  //         height: "100%",
                  //         // boxShadow: "0 0 2px 2px #187de4",
                  //         "&:hover": {
                  //           // boxShadow: "0px 5px 5px 5px rgba(0, 0, 0, 0.5)",
                  //           cursor: "pointer",

                  //           boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px 0px",
                  //           transform: "translateY(-5px)",
                  //         },
                  //       }}
                  //     >
                  //       <CardContent sx={{ pb: 0 }}>
                  //         <Grid
                  //           container
                  //           spacing={2}
                  //           sx={{
                  //             display: "flex",
                  //             alignItems: "center",
                  //             justifyContent: "space-between",
                  //           }}
                  //         >
                  //           <Grid item xs={11} sm={11} md={11} lg={11}>
                  //             <Typography
                  //               sx={{ mb: 4 }}
                  //               color="text.primary"
                  //               variant="h5"
                  //               gutterBottom
                  //             >
                  //               {row.job_title?.substring(0, 75)}
                  //             </Typography>
                  //           </Grid>
                  //           <Grid item xs={1} sm={1} md={1} lg={1}>
                  //             <LoadingButton
                  //               loading={isBookmarkLoading && row.id == savedId}
                  //               color={row?.is_saved ? "success" : "primary"}
                  //               title="Save Job"
                  //               onClick={() => handleAddSavedJob(row?.job_id)}
                  //             >
                  //               {row?.is_saved ? (
                  //                 <Icon
                  //                   fontSize="1.5rem"
                  //                   icon="mdi:favorite-check"
                  //                 />
                  //               ) : (
                  //                 <Icon
                  //                   fontSize="1.5rem"
                  //                   icon="mdi:favorite-add-outline"
                  //                   sx={{ bacground: "red" }}
                  //                   // color="error"
                  //                 />
                  //               )}
                  //             </LoadingButton>
                  //           </Grid>
                  //         </Grid>
                  //         <Grid
                  //           container
                  //           spacing={2}
                  //           sx={{ display: "flex", alignItems: "center" }}
                  //         >
                  //           <Grid item xs={12} sm={12} md={6} lg={6}>
                  //             <Box
                  //               sx={{
                  //                 display: "flex",
                  //                 "&:not(:last-of-type)": { mb: 3 },
                  //                 "& svg": { color: "text.secondary" },
                  //               }}
                  //             >
                  //               <Box sx={{ display: "flex", mr: 2 }}>
                  //                 <Icon
                  //                    fontSize="1rem"
                  //                   icon="tabler:building"
                  //                   color="brown"
                  //                 />
                  //               </Box>

                  //               <Box
                  //                 sx={{
                  //                   columnGap: 2,
                  //                   display: "flex",
                  //                   flexWrap: "wrap",
                  //                   alignItems: "center",
                  //                 }}
                  //               >
                  //                 <Typography sx={{ color: "text.primary" }}>
                  //                   {row.company_name?.substring(0, 30)}
                  //                 </Typography>
                  //               </Box>
                  //             </Box>
                  //             <Box
                  //               sx={{
                  //                 display: "flex",
                  //                 "&:not(:last-of-type)": { mb: 3 },
                  //                 "& svg": { color: "text.secondary" },
                  //               }}
                  //             >
                  //               <Box sx={{ display: "flex", mr: 2 }}>
                  //                 <Icon
                  //                    fontSize="1rem"
                  //                   icon="tabler:map-pin"
                  //                   color="red"
                  //                 />
                  //               </Box>

                  //               <Box
                  //                 sx={{
                  //                   columnGap: 2,
                  //                   display: "flex",
                  //                   flexWrap: "wrap",
                  //                   alignItems: "center",
                  //                 }}
                  //               >
                  //                 <Typography sx={{ color: "text.primary" }}>
                  //                   {row.city}, {row.state}
                  //                 </Typography>
                  //               </Box>
                  //             </Box>
                  //           </Grid>
                  //           <Grid item xs={12} sm={4} md={3} lg={3}>
                  //             <Box
                  //               sx={{
                  //                 display: "flex",
                  //                 "&:not(:last-of-type)": { mb: 3 },
                  //                 "& svg": { color: "text.primary" },
                  //               }}
                  //             >
                  //               <Box sx={{ display: "flex", mr: 2 }}>
                  //                 <Icon
                  //                    fontSize="1rem"
                  //                   icon="tabler:brand-google-analytics"
                  //                   color="darkgreen"
                  //                 />
                  //               </Box>

                  //               <Box
                  //                 sx={{
                  //                   columnGap: 2,
                  //                   display: "flex",
                  //                   flexWrap: "wrap",
                  //                   alignItems: "center",
                  //                 }}
                  //               >
                  //                 <Typography sx={{ color: "text.primary" }}>
                  //                   {row.experience_from +
                  //                     "-" +
                  //                     row.experience_to}{" "}
                  //                   Years
                  //                 </Typography>
                  //               </Box>
                  //             </Box>
                  //           </Grid>
                  //           <Grid item xs={12} sm={4} md={3} lg={3}>
                  //             {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  //       {`₹${row.salary_from + "-" + row.salary_to} LPA`}
                  //     </Typography> */}
                  //             <Box
                  //               sx={{
                  //                 display: "flex",
                  //                 "&:not(:last-of-type)": { mb: 3 },
                  //                 "& svg": { color: "text.primary" },
                  //               }}
                  //             >
                  //               <Box
                  //                 sx={{
                  //                   display: "flex",
                  //                   mr: 2,
                  //                   color: "warning",
                  //                 }}
                  //               >
                  //                 ₹
                  //               </Box>

                  //               <Box
                  //                 sx={{
                  //                   columnGap: 2,
                  //                   display: "flex",
                  //                   flexWrap: "wrap",
                  //                   alignItems: "center",
                  //                 }}
                  //               >
                  //                 <Typography sx={{ color: "text.primary" }}>
                  //                   {`${
                  //                     row.salary_from + "-" + row.salary_to
                  //                   } LPA`}
                  //                 </Typography>
                  //               </Box>
                  //             </Box>
                  //           </Grid>
                  //           <Grid item xs={12} sm={4} md={3} lg={3}>
                  //             <CustomChip
                  //               rounded
                  //               skin="light"
                  //               size="small"
                  //               label={row.job_type}
                  //               color={userStatusObj[row.status]}
                  //               sx={{ textTransform: "capitalize" }}
                  //             />
                  //           </Grid>
                  //         </Grid>
                  //       </CardContent>
                  //       <CardActions sx={{ pb: 3, pl: 0 }}>
                  //         <Grid container spacing={2}>
                  //           <Grid item xs={12} lg={6}>
                  //             <Typography
                  //               // component="div"
                  //               color="text.secondary"
                  //               sx={{ fontSize: 16 }}
                  //             ></Typography>
                  //           </Grid>
                  //           <Grid
                  //             item
                  //             xs={12}
                  //             sm={12}
                  //             lg={6}
                  //             sx={{
                  //               display: "flex",
                  //               justifyContent: "flex-end",
                  //             }}
                  //           >
                  //             <Button
                  //               size="small"
                  //               variant="contained"
                  //               onClick={() =>
                  //                 handleNavigateJobDetail(row?.job_id)
                  //               }
                  //             >
                  //               View Job
                  //             </Button>
                  //           </Grid>
                  //         </Grid>
                  //       </CardActions>
                  //     </Card>
                  //   </Grid>
                  // );
                })}
              </Grid>
              {jobList.length > 0 && (
                <TablePagination
                  component="div"
                  count={pageCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )}
            </Box>
          )}
          {!isLoading && jobList.length === 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 16,
                mt: 16,
              }}
            >
              <Typography>No Match Found</Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
CandidateSavedJob.acl = {
  action: "read",
  subject: "jsSavedJob",
};

export default CandidateSavedJob;
