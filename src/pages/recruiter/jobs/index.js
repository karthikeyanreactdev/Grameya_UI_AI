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
import AddUserDrawer from "./components/ManageJobDrawer";
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
import Swal from "sweetalert2";
import useNotification from "src/hooks/useNotification";
import { updateJobById } from "src/api-services/recruiter/jobs";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import SideBarShareJob from "./components/ShareJob";

const userStatusObj = {
  active: "success",
  hired: "info",
  disabled: "error",
};
const ManageJob = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const [sendNotification] = useNotification();

  const { direction } = theme;

  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  const [id, setId] = useState("");
  const [eid, setEid] = useState("");
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const router = useRouter();

  const handleApplications = async (row) => {
    router.push(
      {
        pathname: "/recruiter/applied-candiates",
        query: { cid: row?.id },
      },
      "/recruiter/applied-candiates"
    );
  };
  const handleNavigateJobPreview = (id) => {
    router.push(`${"/recruiter/job-preview"}?id=${id}`);
  };
  console.log(paginationModel);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45));
  const jobListColumns = [
    {
      flex: 0.1,
      minWidth: 250,
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
            handleNavigateJobPreview(row?.id);
          }}
        >
          {row.job_title}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "total_applications",
      headerName: "Applicants",
      renderCell: ({ row }) => {
        return (
          // <Tooltip title="Click here to view applicants list">
          //   {" "}
          <CustomChip
            rounded
            skin="light"
            size="small"
            title={
              row.total_applications > 0
                ? "Click here to view applicants list"
                : "No Applicants"
            }
            onClick={() => {
              if (row.total_applications > 0) {
                handleApplications(row);
              }
            }}
            label={row.total_applications}
            color={row.total_applications > 0 ? "success" : "warning"}
            sx={{
              textTransform: "capitalize",
              cursor: row.total_applications > 0 ? "pointer" : "not-allowed",
            }}
          />
          // </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 170,
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

      field: "city",
      headerName: "Location",
      // renderCell: ({ row }) => `${row.city}`,
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
            onClick={() => {
              Swal.fire({
                title: `Do you want to Change the Job status to ${
                  row.status === "active" ? "In Active" : "Active"
                }?`,
                icon: "warning",
                showDenyButton: true,
                // showCancelButton: true,
                // confirmButtonText: "Yes",
                // denyButtonText: "No",

                confirmButtonText: "Yes",
                cancelButtonText: "No",
                customClass: {
                  actions: "my-actions",

                  confirmButton: "order-2 mr-2",
                  denyButton: "order-3",
                },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    result = await updateJobById({
                      job_id: row?.id,
                      status: row.status === "active" ? "disabled" : "active",
                    });
                    getJobs();
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
                  }
                }
              });
            }}
            color={userStatusObj[row.status]}
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      // field: "Action",
      headerName: "Action",
      renderCell: ({ row }) => {
        return (
          <>
            <Tooltip title="View job">
              <IconButton
                onClick={() => {
                  handleNavigateJobPreview(row?.id);
                }}
                color="primary"
                sx={{ fontSize: "18px" }}
              >
                {" "}
                <Icon icon="tabler:eye" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit job">
              <IconButton
                onClick={() => {
                  // setId(row.id);
                  setEid(row?.id);
                  toggleAddUserDrawer();
                }}
                color="primary"
                sx={{ fontSize: "18px" }}
              >
                {" "}
                <Icon icon="tabler:pencil" color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share job">
              <IconButton
                onClick={() => {
                  // setId(row.id);
                  setEid(row?.id);
                  // toggleAddUserDrawer();
                  toggleShareDrawer();
                }}
                color="primary"
                sx={{ fontSize: "18px" }}
              >
                {" "}
                <Icon icon="tabler:share-2" color="primary" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const { recruiterJobList, isLoading, pageCount } = useSelector(
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
  const toggleShareDrawer = () => {
    if (shareOpen) {
      setId("");
    }
    setShareOpen(!shareOpen);
  };

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
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);
  console.log(pageCount);
  const getJobs = () => {
    const params = {
      page: paginationModel?.page + 1,
      size: paginationModel?.pageSize,
    };
    dispatch(getJobList(params));
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
      {!addUserOpen && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Manage Jobs" />
            <Divider sx={{ m: "0 !important" }} />

            <CardContent></CardContent>
            {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
            <Box
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
              /> */}

                <Button
                  onClick={() => {
                    toggleAddUserDrawer();
                    setId("");
                  }}
                  variant="contained"
                  color="primary"
                  sx={{ "& svg": { mr: 2 } }}
                >
                  {/* <Icon fontSize='1.125rem' icon='tabler:plus' /> */}
                  Create a Job
                </Button>
              </Box>
            </Box>
            <Box p={4}>
              <DataGrid
                sx={{
                  "& .MuiDataGrid-row": {
                    cursor: "pointer",
                  },
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
                autoHeight
                rowHeight={62}
                rows={recruiterJobList}
                columns={jobListColumns}
                loading={isLoading}
                onRowClick={(it) => console.log(it)}
                // {...recruiterJobList}
                // initialState={{
                //   // ...data.initialState,
                //   pagination: { paginationModel: { pageSize: 5 } },
                // }}
                // getRowId={(row) => row.job_id}
                // autoPageSize
                rowCount={rowCountState}
                paginationMode="server"
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            </Box>
          </Card>
        </Grid>
      )}

      {addUserOpen && (
        <Grid item xs={12}>
          <Card>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <CardHeader title={id !== "" ? "Edit a Job" : "Create a Job"} />
              <Button
                size="small"
                variant="outlined"
                onClick={toggleAddUserDrawer}
                sx={{ mx: 4, py: 0, my: 4 }}
                // sx={{
                //   p: "0.438rem",
                //   borderRadius: 1,
                //   color: "text.primary",
                //   backgroundColor: "action.selected",
                //   "&:hover": {
                //     backgroundColor: (theme) =>
                //       `rgba(${theme.palette.customColors.main}, 0.16)`,
                //   },
                // }}
              >
                {/* <Icon icon="tabler:x" fontSize="1.125rem" /> */}
                Back
              </Button>
            </Box>
            <Divider sx={{ m: "0 !important" }} />

            <Box p={4}>
              <AddUserDrawer
                open={addUserOpen}
                toggle={toggleAddUserDrawer}
                id={eid}
              />
            </Box>
          </Card>
        </Grid>
      )}
      <SideBarShareJob open={shareOpen} toggle={toggleShareDrawer} id={eid} />
    </Grid>
  );
};
ManageJob.acl = {
  action: "read",
  subject: "jobs",
};

export default ManageJob;
