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
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
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
// import AddUserDrawer from "./components/ManageJobDrawer";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { getJobList } from "src/store/apps/recruiter/manageJob";
import {
  getJobCategory,
  getJobType,
  getNoticePeriod,
  getSkills,
} from "src/store/apps/misc/index";
import { getAppliedJobs } from "src/store/apps/jobseeker/applications";
import moment from "moment";
import { useRouter } from "next/router";
import {
  addSaveJob,
  recommendedJobDetail,
} from "src/api-services/seeker/jobsdetails";
import { LoadingButton } from "@mui/lab";
import { CardActions, Chip, Tooltip } from "@mui/material";
import useNotification from "src/hooks/useNotification";

const userStatusObj = {
  interview_schedulded: "success",
  shortlisted: "success",
  // hired: "info",
  submitted: "primary",

  inactive_seeker: "warning",
  call_resheduled: "warning",
  call_not_picked: "warning",
  interview_canceled: "error",
};
const statusObj = {
  shortlisted: "Shortlisted",
  submitted: "Submitted",
  call_resheduled: "Call Resheduled",
  call_not_picked: "Call not picked",
  inactive_seeker: "Inactive/Not Intrested",
  interview_schedulded: "Interview Scheduled",
  interview_canceled: "Interview Canceled",
  remove: "Remove",
};
const ManageAppliedJob = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { direction } = theme;

  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [id, setId] = useState("");
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  console.log(paginationModel);
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45));
  const [recommendedJobList, setRecommendedJobList] = useState([]);
  const [isBookmarkLoading, setIsLoading] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [sendNotification] = useNotification();

  const handleNavigateJobDetail = (id) => {
    router.push(`${"/jobseeker/job-detail"}?id=${id}`);
  };
  const jobListColumns = [
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "job_title",
      headerName: "Job Title",
      renderCell: ({ row }) => (
        <Typography
          // variant="caption"
          sx={{ cursor: "pointer", fontSize: "0.8125rem" }}
          onClick={() => {
            // if (row.total_applications > 0) {
            //   handleApplications(row);
            // }
            handleNavigateJobDetail(row?.job_id);
          }}
        >
          {row.job_title}
        </Typography>
      ),
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "company_name",
      headerName: "Company Name",
      // renderHeader: (params) => (
      //   <strong>
      //     {"Company Name "}
      //     <span role="img" aria-label="enjoy">
      //       🏢
      //     </span>
      //   </strong>
      // ),
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "applied_on",
      headerName: "Applied On",

      renderCell: ({ row }) => `${moment(row.applied_on).format("DD/MM/YYYY")}`,
    },
    {
      flex: 0.1,
      minWidth: 200,
      sortable: true,

      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => {
        return (
          <CustomChip
            rounded
            skin="light"
            size="small"
            label={statusObj[row.status]}
            color={userStatusObj[row.status]}
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "city",
      headerName: "Location",
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "experience",
      headerName: "Experience",
      renderCell: ({ row }) =>
        `${row.experience_from}-${row.experience_to} years`,
    },

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   // field: "Action",
    //   headerName: "Action",
    //   renderCell: ({ row }) => {
    //     return (
    //       <Button
    //         onClick={() => {
    //           setId(row.id);
    //           toggleAddUserDrawer();
    //         }}
    //       >
    //         Edit
    //       </Button>
    //     );
    //   },
    // },
  ];

  const { appliedJobs, isLoading, pageCount } = useSelector(
    (state) => state?.appliedJobs
  );
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);

  console.log("ddd", appliedJobs);
  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const handleRoleChange = useCallback((e) => {
    setRole(e.target.value);
  }, []);

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

  const getJobs = () => {
    const params = {
      page: paginationModel?.page + 1,
      size: paginationModel?.pageSize,
    };
    dispatch(getAppliedJobs(params));
  };

  const getRecommendedJob = async () => {
    try {
      const paramData = {
        page: 1,
        size: 10,
      };
      const response = await recommendedJobDetail(paramData);
      console.log("response", response);
      if (response?.data?.data?.data) {
        setRecommendedJobList(response.data.data.data);
      }
    } catch (e) {
      console.log("e", e);
    } finally {
      // handleChangeLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
    getRecommendedJob();
    // dispatch(getJobCategory({}));
    // dispatch(getJobType({}));
    dispatch(getSkills({}));
    // dispatch(getNoticePeriod({}));
  }, []);

  useEffect(() => {
    console.log("ca");
    getJobs();
  }, [paginationModel?.page, paginationModel?.pageSize, rowCountState]);
  useEffect(() => {
    if (addUserOpen === false) {
      getJobs();
    }
  }, [addUserOpen]);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageCount?.total !== undefined ? pageCount?.total : prevRowCountState
    );
  }, [pageCount?.total, setRowCountState]);

  const handleAddSavedJob = async (id) => {
    try {
      setSavedId(id);
      setIsLoading(true);
      const param = {
        job_id: id,
      };

      const result = await addSaveJob(param);
      sendNotification({
        message: result?.data?.message,
        variant: "success",
      });
      getRecommendedJob();
    } catch (e) {
      sendNotification({
        message: e,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setSavedId("");
    }
  };

  return (
    <Grid container spacing={6}>
      {/* <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Employer Dashboard' />
          <CardContent>
            <Typography sx={{ mb: 4 }}>Employer Dashboard</Typography>
            <Typography sx={{ color: 'primary.main' }}>This card is visible to 'user' and 'admin' both</Typography>
          </CardContent>
        </Card>
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Dashboard" />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent></CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          {/* <Box
            sx={{
              pb: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                rowGap: 2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {/* <CustomTextField
                value={value}
                sx={{ mr: 4 }}
                placeholder="Search Jobs"
                onChange={(e) => handleFilter(e.target.value)}
              /> 

              <Button
                onClick={() => {
                  toggleAddUserDrawer();
                  setId("");
                }}
                variant="contained"
                color="primary"
                sx={{ "& svg": { mr: 2 } }}
              >
                {/* <Icon fontSize='1.125rem' icon='tabler:plus' /> 
                Create a Job
              </Button>
            </Box>
          </Box> */}
          <Box p={4}>
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={appliedJobs}
              columns={jobListColumns}
              loading={isLoading}
              sx={{
                "& .MuiDataGrid-columnHeaders ": {
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  "& .MuiButtonBase-root.MuiIconButton-root ": {
                    color: "#fff",
                  },
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                },
                "& .MuiDataGrid-columnSeparator ": {
                  color: "#fff",
                },
                "& .MuiDataGrid-columnHeaders.MuiDataGrid-withBorderColor": {
                  borderColor: `${theme.palette.primary.main}`,
                },

                "& .MuiDataGrid-virtualScroller": {
                  // border: `1px solid ${theme.palette.primary.main}`,
                  border: `.25px solid grey`,
                },
              }}
              // getRowId={(row) => row.job_id}
              rowCount={rowCountState}
              paginationMode="server"
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
          <Divider sx={{ m: "0 !important" }} />
          <CardHeader title="Recommended Job" />

          {recommendedJobList.length > 0 && (
            <Box p={4}>
              <Grid container spacing={2}>
                {recommendedJobList?.map((row) => {
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
                            cursor: "pointer",

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
                                    isBookmarkLoading && row.id == savedId
                                  }
                                  color={row?.is_saved ? "success" : "primary"}
                                  title="Save Job"
                                  onClick={() => handleAddSavedJob(row?.id)}
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
                                  // color="black"
                                  size="small"
                                  sx={{ mx: 1, fontSize: "0.675rem" }}
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
                                  sx={{ mx: 1, fontSize: "0.675rem" }}
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
                                onClick={() => handleNavigateJobDetail(row?.id)}
                              >
                                {row?.is_applied ? "Applied" : "View & Apply"}
                              </Button>
                            </Grid>
                          </Grid>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              {/* {machedJobList.length > 0 && (
                <TablePagination
                  component="div"
                  count={pageCount?.totalPages}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              )} */}
            </Box>
          )}
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} id={id} /> */}
    </Grid>
  );
};
ManageAppliedJob.acl = {
  action: "read",
  subject: "jsdashboard",
};

export default ManageAppliedJob;
