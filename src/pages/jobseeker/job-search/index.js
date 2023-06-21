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
import {
  Button,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";

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
const CandidateJobSearch = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const theme = useTheme();
  const classes = useStyles();

  const dispatch = useDispatch();
  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [location, setLocation] = useState("");
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

  const handleLocationChange = useCallback((e) => {
    setLocation(e.target.value);
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
  const searchListColumns = [
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,
    //   field: "full_name",
    //   headerName: "First Name",
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,
    //   field: "last_name",
    //   headerName: "Last Name",
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,
    //   field: "job_title",
    //   headerName: "Job Title",
    //   renderCell: ({ row }) => {
    //     const { full_name, email } = row;

    //     return (
    //       <Box sx={{ display: "flex", alignItems: "center" }}>
    //         {renderClient(row)}
    //         <Box
    //           sx={{
    //             display: "flex",
    //             alignItems: "flex-start",
    //             flexDirection: "column",
    //           }}
    //         >
    //           <Typography
    //             noWrap
    //             // component={Link}
    //             // href="/apps/user/view/account"
    //             sx={{
    //               fontWeight: 500,
    //               textDecoration: "none",
    //               color: "text.secondary",
    //               "&:hover": { color: "primary.main" },
    //             }}
    //           >
    //             {full_name}
    //           </Typography>
    //           <Typography
    //             noWrap
    //             variant="body2"
    //             sx={{ color: "text.disabled" }}
    //           >
    //             {email}
    //           </Typography>
    //         </Box>
    //       </Box>
    //     );
    //   },
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,
    //   field: "company_name",
    //   headerName: "Company Name",
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,
    //   field: "phone",
    //   headerName: "Mobile",
    //   renderCell: ({ row }) => {
    //     `${row.country_code}` + "-" + `${row.phone}`;
    //   },
    //},
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      // field: "Action",
      headerName: "Mached Jobs",
      renderCell: ({ row }) => {
        // return <Button onClick={() => {}}>View Candidate</Button>;
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={12} lg={12} xl={12}>
              <Card>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                      <Typography
                        // sx={{ fontSize: 14 }}
                        color="text.primary"
                        variant="h5"
                        gutterBottom
                      >
                        {row.job_title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          "&:not(:last-of-type)": { mb: 3 },
                          "& svg": { color: "text.secondary" },
                        }}
                      >
                        <Box sx={{ display: "flex", mr: 2 }}>
                          <Icon fontSize="1.25rem" icon="tabler:building" />
                        </Box>

                        <Box
                          sx={{
                            columnGap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary" }}>
                            {row.company_name?.substring(0, 35)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          "&:not(:last-of-type)": { mb: 3 },
                          "& svg": { color: "text.secondary" },
                        }}
                      >
                        <Box sx={{ display: "flex", mr: 2 }}>
                          <Icon fontSize="1.25rem" icon="tabler:map-pin" />
                        </Box>

                        <Box
                          sx={{
                            columnGap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary" }}>
                            {row.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={3}>
                      <Box
                        sx={{
                          display: "flex",
                          "&:not(:last-of-type)": { mb: 3 },
                          "& svg": { color: "text.secondary" },
                        }}
                      >
                        <Box sx={{ display: "flex", mr: 2 }}>
                          <Icon
                            fontSize="1.25rem"
                            icon="tabler:brand-google-analytics"
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
                          <Typography sx={{ color: "text.secondary" }}>
                            {row.experience_from + "-" + row.experience_to}{" "}
                            Years
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={3}>
                      {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {`₹${row.salary_from + "-" + row.salary_to} LPA`}
                      </Typography> */}
                      <Box
                        sx={{
                          display: "flex",
                          "&:not(:last-of-type)": { mb: 3 },
                          "& svg": { color: "text.secondary" },
                        }}
                      >
                        <Box sx={{ display: "flex", mr: 2 }}>₹</Box>

                        <Box
                          sx={{
                            columnGap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary" }}>
                            {`${row.salary_from + "-" + row.salary_to} LPA`}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={3}>
                      <CustomChip
                        rounded
                        skin="light"
                        size="small"
                        label={row.job_type}
                        color={userStatusObj[row.status]}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Grid>
                  </Grid>
                  {/* <Grid container spacing={2}>
                    <Grid item xs={12} sx={3} lg={2}>
                      <Button size="">
                        {row.experience_from + "-" + row.experience_to}
                      </Button>
                    </Grid>
                  </Grid> */}
                  {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography> */}
                </CardContent>
                <CardActions>
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
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button size="">Apply</Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
      },
    },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,

    //   field: "posted_on",
    //   headerName: "Posted On",
    //   // renderHeader: (params) => (
    //   //   <strong>
    //   //     {"Company Name "}
    //   //     <span role="img" aria-label="enjoy">
    //   //       🏢
    //   //     </span>
    //   //   </strong>
    //   // ),
    //   renderCell: ({ row }) => `${moment(row.posted_on).format("DD/MM/YYYY")}`,
    // },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,

    //   field: "total_applications",
    //   headerName: "Total Applicants",
    //   // renderCell: ({ row }) => <RowOptions id={row.id} />,
    // },

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: true,

    //   field: "status",
    //   headerName: "Status",
    //   renderCell: ({ row }) => {
    //     return (
    //       <CustomChip
    //         rounded
    //         skin="light"
    //         size="small"
    //         label={row.status}
    //         color={userStatusObj[row.status]}
    //         sx={{ textTransform: "capitalize" }}
    //       />
    //     );
    //   },
    // },
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
  const [jobRole, setjobRole] = useState("");
  const [experience, setExperiance] = useState("");
  const [jobType, setJobType] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [skills, setSkills] = useState([]);
  const { resumeSearchList, isLoading } = useSelector(
    (state) => state.resumeSearch
  );
  console.log("resumeSearch", resumeSearchList);
  const handleSearch = async () => {
    const params = {
      page: paginationModel?.page,
      size: paginationModel?.pageSize,
      job_role: "Node js Developer",
      experience: "4-5 years",
      job_type: "permanant",
      notice_period: "30 days",
      skills: "",
    };
    dispatch(resumeCandidates(params));
  };

  useEffect(() => {
    handleSearch();
  }, []);
  useEffect(() => {
    handleSearch();
  }, [paginationModel?.page, paginationModel?.pageSize]);
  return (
    <Grid container spacing={6} className={classes.root}>
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
          <CardHeader title="Job Search " />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12} lg={6} mt={0}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Search"}
                  required
                  fullWidth
                  size="small"
                  name="Search"
                  placeholder="Search skills, resume headline..etc"
                  // error={formik.touched.email && Boolean(formik.errors.email)}
                  // value={formik.values.email
                  //   ?.trimStart()
                  //   .replace(/\s\s+/g, "")
                  //   .replace(/\p{Emoji_Presentation}/gu, "")}
                  // // onChange={(e) => formik.handleChange(e)}
                  // helperText={
                  //   formik.touched.email &&
                  //   formik.errors.email &&
                  //   formik.errors.email
                  // }
                />
              </Grid>
              <Grid item sm={3} xs={12} lg={3} mt={0}>
                <FormControl fullWidth sx={{ my: 2 }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    Job Location
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={formik.values.location}
                    label="Job Location "
                    // error={
                    //   formik.touched.location && Boolean(formik.errors.location)
                    // }
                    // helperText={
                    //   formik.touched.location &&
                    //   formik.errors.location &&
                    //   formik.errors.location
                    // }
                    // onChange={(e) =>
                    //   formik.setFieldValue("location", e.target.value)
                    // }
                  >
                    <MenuItem value={"Chennai"}>Chennai</MenuItem>
                    <MenuItem value={"Delhi"}>Delhi</MenuItem>
                    <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                    <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12} lg={3} mt={0}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Experiance (in years)"}
                  required
                  fullWidth
                  size="small"
                  name="Experiance"
                  placeholder="Experiance (in years)"
                  // error={formik.touched.email && Boolean(formik.errors.email)}
                  // value={formik.values.email
                  //   ?.trimStart()
                  //   .replace(/\s\s+/g, "")
                  //   .replace(/\p{Emoji_Presentation}/gu, "")}
                  // // onChange={(e) => formik.handleChange(e)}
                  // helperText={
                  //   formik.touched.email &&
                  //   formik.errors.email &&
                  //   formik.errors.email
                  // }
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12} lg={6}>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12} lg={6}>
                    <TextField
                      sx={{ my: 2 }}
                      label={"Salary from"}
                      required
                      fullWidth
                      size="small"
                      name="salaryFrom"
                      placeholder="Salary from (in LPA)"
                      // error={formik.touched.email && Boolean(formik.errors.email)}
                      // value={formik.values.email
                      //   ?.trimStart()
                      //   .replace(/\s\s+/g, "")
                      //   .replace(/\p{Emoji_Presentation}/gu, "")}
                      // // onChange={(e) => formik.handleChange(e)}
                      // helperText={
                      //   formik.touched.email &&
                      //   formik.errors.email &&
                      //   formik.errors.email
                      // }
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} lg={6}>
                    <TextField
                      sx={{ my: 2 }}
                      label={"Salary To"}
                      required
                      fullWidth
                      size="small"
                      name="salaryTo"
                      placeholder="Salary To (in LPA)"
                      // error={formik.touched.email && Boolean(formik.errors.email)}
                      // value={formik.values.email
                      //   ?.trimStart()
                      //   .replace(/\s\s+/g, "")
                      //   .replace(/\p{Emoji_Presentation}/gu, "")}
                      // // onChange={(e) => formik.handleChange(e)}
                      // helperText={
                      //   formik.touched.email &&
                      //   formik.errors.email &&
                      //   formik.errors.email
                      // }
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item sm={4} xs={12} lg={3}>
                <FormControl fullWidth sx={{ my: 2 }} size="small">
                  <InputLabel id="demo-simple-select-label">
                    Job Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={formik.values.jobType}
                    label="Job Type"
                  >
                    <MenuItem value={0}>Permenant</MenuItem>
                    <MenuItem value={15}>Temporary</MenuItem>
                    <MenuItem value={30}>OnSite</MenuItem>
                    <MenuItem value={90}>WFH</MenuItem>
                    <MenuItem value={90}>Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12} lg={3}>
                <FormControl fullWidth sx={{ my: 2 }} size="small">
                  <InputLabel id="demo-simple-select-label ">
                    Notice Period
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={formik.values.noticePeriod}
                    label="Notice Period"
                  >
                    <MenuItem value={0}>Immediate</MenuItem>
                    <MenuItem value={15}>15 Days</MenuItem>
                    <MenuItem value={30}>30 Days</MenuItem>
                    <MenuItem value={90}>90 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <Box p={4}>
            <DataGrid
              autoHeight
              // rowHeight={62}
              rows={[
                {
                  id: "648dec595428d50008ed1ee5",
                  company_name: "ABC Private Limited",
                  job_title: "Backend Developer",
                  location: "Chennai",
                  experience_from: 5,
                  experience_to: 10,
                  salary_from: 5,
                  salary_to: 10,
                  notice_period: "30 days",
                  job_type: "permanant",
                  short_description: "This is a full time job.",
                  email: "sarolove001@gmail.com",
                  address_line_one: "Kulithalai bus stand",
                  address_line_two: "Kulithalai",
                  city: "Karur",
                  state: "Tamilnadu",
                  postal_code: "639120",
                  latitude: "10.77348284",
                  longitude: "78.8874482492",
                  status: "active",
                  verification_status: "pending",
                  history_of_status: [],
                  created: "2023-06-17T17:24:41.562Z",
                  updated: "2023-06-19T01:12:52.509Z",
                  country: "India",
                  job_category_id: "648d7ce99b577c0b90803671",
                  job_category: "Information Technology (IT)",
                  job_sub_category_id: "648d806c8ab51d180bbdad20",
                  job_sub_category: "Software Developer/Engineer",
                  skills_ids: [
                    "648db7560bde93631a5d4cd3",
                    "648db7560bde93631a5d4cd7",
                    "648db7560bde93631a5d4ce8",
                    "648db7560bde93631a5d4d07",
                    "648fab947e4a153bc8910ba6",
                  ],
                  skills: [
                    "React",
                    "Java",
                    "Angular Developer",
                    "Backend development",
                    "JavaScript",
                  ],
                },
                {
                  id: "648faab24ed50f392ab83272",
                  company_name: "Instrive Softlabs Private Ltd",
                  job_title: "Node.js Developer",
                  location: "Chennai",
                  experience_from: 5,
                  experience_to: 10,
                  salary_from: 5,
                  salary_to: 10,
                  notice_period: "30 days",
                  job_type: "permanant",
                  short_description: "This is a full time job.",
                  email: "sarolove001@gmail.com",
                  address_line_one: "Kulithalai bus stand",
                  address_line_two: "Kulithalai",
                  city: "Karur",
                  state: "Tamilnadu",
                  country: "India",
                  postal_code: "639120",
                  latitude: "10.77348284",
                  longitude: "78.8874482492",
                  status: "active",
                  verification_status: "pending",
                  history_of_status: [],
                  created: "2023-06-19T01:09:06.422Z",
                  updated: "2023-06-21T01:29:27.431Z",
                  job_category_id: "648d7ce99b577c0b90803671",
                  job_category: "Information Technology (IT)",
                  job_sub_category_id: "648d806c8ab51d180bbdad20",
                  job_sub_category: "Software Developer/Engineer",
                  skills_ids: [
                    "648db7560bde93631a5d4cd3",
                    "648db7560bde93631a5d4cd7",
                    "648db7560bde93631a5d4ce8",
                    "648db7560bde93631a5d4d07",
                  ],
                  skills: [
                    "Backend development",
                    "Java",
                    "JavaScript",
                    "React",
                  ],
                },
              ]}
              // sx={{
              //   "& .MuiDataGrid-root.MuiDataGrid-cell": {
              //     border: "none",
              //     borderColor: "transparent",
              // }}
              sx={{
                "& .MuiDataGrid-root.MuiDataGrid-cell": {
                  borderColor: "transparent",
                  borderBottom: "0px soild !important",
                },
              }}
              loading={isLoading}
              rowHeight={window.innerHeight > 1024 ? 200 : 300}
              columns={searchListColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  );
};
CandidateJobSearch.acl = {
  action: "read",
  subject: "jssearch",
};

export default CandidateJobSearch;
