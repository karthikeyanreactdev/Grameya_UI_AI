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

const userStatusObj = {
  active: "success",
  hired: "info",
  disabled: "error",
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45));
  const jobListColumns = [
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "job_title",
      headerName: "Job Title",
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

      field: "location",
      headerName: "Location",
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "experiance",
      headerName: "Experiance",
      renderCell: ({ row }) =>
        `${row.experience_from}-${row.experience_to} years`,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => {
        return (
          <CustomChip
            rounded
            skin="light"
            size="small"
            label={row.status}
            color={userStatusObj[row.status]}
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
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

  const { recruiterJobList, isLoading } = useSelector(
    (state) => state?.manageJob
  );
  console.log("ddd", recruiterJobList);
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
      page: paginationModel?.page,
      size: paginationModel?.pageSize,
    };
    dispatch(getAppliedJobs(params));
  };
  useEffect(() => {
    getJobs();
    // dispatch(getJobCategory({}));
    // dispatch(getJobType({}));
    dispatch(getSkills({}));
    // dispatch(getNoticePeriod({}));
  }, []);
  useEffect(() => {
    console.log("ca");
    getJobs();
  }, [paginationModel?.page, paginationModel?.pageSize]);
  useEffect(() => {
    if (addUserOpen === false) {
      getJobs();
    }
  }, [addUserOpen]);
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
          <CardHeader title="Applied Jobs" />
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
              rows={recruiterJobList}
              columns={jobListColumns}
              loading={isLoading}
              // getRowId={(row) => row.job_id}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} id={id} /> */}
    </Grid>
  );
};
ManageAppliedJob.acl = {
  action: "read",
  subject: "jsajobs",
};

export default ManageAppliedJob;
