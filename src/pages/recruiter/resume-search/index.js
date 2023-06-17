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
import AddUserDrawer from "src/views/apps/user/list/AddUserDrawer";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import DatePicker from "react-datepicker";
import { useTheme } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import {
  handleResumeSearch,
  resumeCandidates,
  resumeSearchByFilter,
} from "src/store/apps/recruiter/resume-search";
import {
  Button,
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
const Dashboard = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const theme = useTheme();
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
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "job_title",
      headerName: "Job Title",
      renderCell: ({ row }) => {
        const { full_name, email } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {renderClient(row)}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography
                noWrap
                // component={Link}
                // href="/apps/user/view/account"
                sx={{
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {full_name}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{ color: "text.disabled" }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "email",
      headerName: "Email",
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "phone",
      headerName: "Mobile",
      renderCell: ({ row }) => {
        `${row.country_code}` + "-" + `${row.phone}`;
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      // field: "Action",
      headerName: "Action",
      renderCell: ({ row }) => {
        return <Button onClick={() => {}}>View Candidate</Button>;
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
          <CardHeader title="Resume Search " />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent>
            <Grid item sm={4} xs={12} lg={12} mt={0}>
              <TextField
                sx={{ my: 2 }}
                label={"Search"}
                required
                fullWidth
                name="Search"
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
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
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

              <Grid item sm={4} xs={12}>
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
              <Grid item sm={4} xs={12}>
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
              rowHeight={62}
              rows={resumeSearchList}
              loading={isLoading}
              columns={searchListColumns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};
Dashboard.acl = {
  action: "read",
  subject: "search",
};

export default Dashboard;
