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
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
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
import useNotification from "src/hooks/useNotification";
import { useRouter } from "next/router";

import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { addShortList } from "src/api-services/recruiter/candidate";
import Swal from "sweetalert2";
import SideBarEmail from "./Components/EmailDrawer";

const userStatusObj = {
  interview_schedulded: "success",
  shortlisted: "success",
  false: "success",
  true: "warning",
  // hired: "info",
  inactive_seeker: "warning",
  call_resheduled: "warning",
  call_not_picked: "warning",
  interview_canceled: "error",
};

const statusObj = {
  shortlisted: "Shortlisted",
  call_resheduled: "Call Resheduled",
  call_not_picked: "Call not picked",
  inactive_seeker: "Inactive/Not Intrested",
  interview_schedulded: "Interview Scheduled",
  interview_canceled: "Interview Canceled",
  remove: "Remove",
};
const ExcelDownload = ({ excelData, fileName }) => {
  const fileType =
    "application/und.openxmI.formats -officedocument .spreadsheetal.sheet; charset-UTF-8 ";
  const fileExtension = ".xlsx";
  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }}>
      <Tooltip>
        {/* <Button onClick={() => exportToExcel()}>Download Excel</Button> */}
        <Button
          // sx={{ p: 1, mr: 2 }}
          variant={"outlined"}
          color={"primary"}
          size="small"
          sx={{ "& svg": { mr: 2 } }}
          onClick={() => exportToExcel()}
          title="Download as Excel"
        >
          <Icon icon="vscode-icons:file-type-excel2" fontSize="1.125rem" />
          {"Download Excel"}
        </Button>
      </Tooltip>
    </Box>
  );
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
  const [sendNotification] = useNotification();

  const { direction } = theme;
  const popperPlacement = direction === "ltr" ? "bottom-start" : "bottom-end";
  // const [location, setLocation] = useState("");
  const [plan, setPlan] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [isShortListLoading, setIsShortListLoading] = useState(false);
  const [isShortListLoadingId, setIsShortListLoadingId] = useState("");
  const [isViewLoading, setIsViewLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  // const [selectedIds, setIds] = useState([])
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedIds, setIds] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45));
  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

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
  const [experience, setExperiance] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [jobType, setJobType] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");

  const { resumeSearchList, isLoading, pageCount } = useSelector(
    (state) => state.resumeSearch
  );
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);

  console.log("resumeSearch", resumeSearchList);
  const handleSearch = async () => {
    if (keyword === "") {
      return;
    }
    const params = {
      page: paginationModel?.page + 1,
      size: paginationModel?.pageSize,
      search_keyword: keyword,
      experience_from: "0",
      experience_to: experience,
      job_type: jobType,
      notice_period: noticePeriod,
      salary_from: salaryFrom,
      salary_to: salaryTo,
      job_location: location,
    };

    dispatch(resumeCandidates(params));
  };

  useEffect(() => {
    // handleSearch();
  }, []);
  useEffect(() => {
    handleSearch();
  }, [paginationModel?.page, paginationModel?.pageSize, rowCountState]);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageCount?.total !== undefined ? pageCount?.total : prevRowCountState
    );
  }, [pageCount?.total, setRowCountState]);

  const handleAddShortList = async (id) => {
    console.log(id);
    Swal.fire({
      title: "Do you want to save?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const params = {
            seeker_ids: id,
          };
          setIsShortListLoading(true);
          setIsShortListLoadingId(id);

          const response = await addShortList(params);
          sendNotification({
            message: response?.data?.message,
            variant: "success",
          });
        } catch (e) {
          sendNotification({
            message: e,
            variant: "error",
          });
        } finally {
          setIsShortListLoading(false);
        }
      }
    });
  };
  const searchListColumns2 = [
    {
      flex: 0.1,
      minWidth: 300,
      // sortable: true,
      field: "full_name",
      headerName: "Candidate Name",
      renderCell: ({ row }) => {
        const { full_name, designation } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center", width: "200px" }}>
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
                {designation}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: true,
      field: "notice_period",
      headerName: "Notice Period",
      // renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: true,
      field: "total_years_of_experience",
      headerName: "Experience",
      renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "current_location",
      headerName: "Location",
      // renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 300,
      sortable: true,

      field: "preferred_job_location",
      headerName: "Prefered Location",
      renderCell: ({ row }) => `${row.preferred_job_location}`,

      // renderCell: ({ row }) =>
      //   row?.preferred_job_location?.map((e) => {
      //     return (
      //       <Chip
      //         size="small"
      //         label={e}
      //         color={"info"}
      //         sx={{
      //           mr: 2,
      //           height: 24,
      //           minWidth: 24,
      //           "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
      //         }}
      //       />
      //     );
      //   }),
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: true,
      field: "skills",
      headerName: "Skills",
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          <Tooltip title={row.skills.join(",")}>
            <Chip
              size="small"
              label={row?.skills[0] || "N/A"}
              color={"primary"}
              variant="outlined"
              sx={{
                mr: 2,
                height: 24,
                minWidth: 24,
                wordWrap: "break-word",
                "& .MuiChip-label": {
                  px: 1.5,
                  textTransform: "capitalize",
                },
              }}
            />
          </Tooltip>
        </Box>
      ),
    },
    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   // field: "Action",
    //   headerName: "Action",
    //   renderCell: ({ row }) => {
    //     return (
    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexDirection: "row",
    //         }}
    //       >
    //         {/* <Button onClick={() => {}}>View</Button> */}
    //         <Tooltip title="View Candidate">
    //           <LoadingButton
    //             // isLoading={isViewLoading}
    //             onClick={() => {
    //               handleViewCandidate(row);
    //             }}
    //             sx={{ fontSize: "18px" }}
    //           >
    //             {" "}
    //             <Icon icon="tabler:eye" color="primary" />
    //           </LoadingButton>
    //         </Tooltip>
    //         <Tooltip title="Shortlist Candidate">
    //           <LoadingButton
    //             // loading={isShortListLoading && isShortListLoadingId}
    //             onClick={() => handleAddShortList(row.id)}
    //             sx={{ fontSize: "18px" }}
    //           >
    //             {" "}
    //             <Icon icon="tabler:user-check" color="primary" />
    //           </LoadingButton>
    //         </Tooltip>
    //       </Box>
    //     );
    //   },
    // },
  ];

  const searchListColumns = [
    {
      flex: 0.1,
      minWidth: 300,
      // sortable: true,
      field: "full_name",
      headerName: "Candidate Name",
      renderCell: ({ row }) => {
        const { full_name, designation } = row;

        return (
          <Box
            sx={{ display: "flex", alignItems: "center", width: "200px" }}
            onClick={() => {
              handleViewCandidate(row);
            }}
          >
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
                {designation}
              </Typography>
            </Box>
          </Box>
        );
      },
    },

    {
      flex: 0.1,
      minWidth: 200,
      sortable: false,
      // field: "Action",
      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: 1,
            }}
          >
            <Chip
              size="small"
              label={row?.is_shortlisted_candidate ? "Shortlisted" : "New"}
              color={userStatusObj[row.is_shortlisted_candidate]}
              onClick={async () => {
                // setId(row.id);
                // setRowData(row);
                // setAddUserOpen(true);
              }}
              sx={{
                // mr: 2,
                height: 24,
                minWidth: 24,
                wordWrap: "break-word",
                // "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
              }}
            />
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: true,
      field: "total_years_of_experience",
      headerName: "Experience",
      renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "current_location",
      headerName: "Location",
      // renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 150,
      sortable: true,

      field: "preferred_job_location",
      headerName: "Pref Location",
      renderCell: ({ row }) => `${row.preferred_job_location}`,

      // renderCell: ({ row }) =>
      //   row?.preferred_job_location?.map((e) => {
      //     return (
      //       <Chip
      //         size="small"
      //         label={e}
      //         color={"info"}
      //         sx={{
      //           mr: 2,
      //           height: 24,
      //           minWidth: 24,
      //           "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
      //         }}
      //       />
      //     );
      //   }),
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: true,
      field: "expected_salary",
      headerName: "Salary",
      renderCell: ({ row }) =>
        `${row.current_salary} CTC - ${row.expected_salary} ECTC `,
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: true,
      field: "notice_period",
      headerName: "Notice Period",
      // renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 800,
      // maxWidth: 1500,
      sortable: true,
      field: "skills",
      headerName: "Skills",
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            wordWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {row?.skills?.map((e) => {
            return (
              <Chip
                size="small"
                label={e}
                color={"primary"}
                variant="outlined"
                sx={{
                  mr: 2,
                  height: 24,
                  minWidth: 24,
                  wordWrap: "break-word",
                  "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
                }}
              />
            );
          })}
        </Box>
        // <Box
        //   sx={{
        //     display: "flex",
        //     alignItems: "center",
        //     wordWrap: "break-word",
        //     whiteSpace: "normal",
        //   }}
        // >
        //   <Tooltip title={row.skills.join(",")}>
        //     <Chip
        //       size="small"
        //       label={row?.skills[0] || "N/A"}
        //       color={"primary"}
        //       variant="outlined"
        //       sx={{
        //         mr: 2,
        //         height: 24,
        //         minWidth: 24,
        //         wordWrap: "break-word",
        //         "& .MuiChip-label": {
        //           px: 1.5,
        //           textTransform: "capitalize",
        //         },
        //       }}
        //     />
        //   </Tooltip>
        // </Box>
      ),
    },
    // {
    //   flex: 0.1,
    //   minWidth: 150,
    //   sortable: false,
    //   // field: "Action",
    //   headerName: "Action",
    //   renderCell: ({ row }) => {
    //     return (
    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexDirection: "row",
    //         }}
    //       >
    //         {/* <Button onClick={() => {}}>View</Button> */}
    //         <Tooltip title="View Candidate">
    //           <LoadingButton
    //             // isLoading={isViewLoading}
    //             onClick={() => {
    //               handleViewCandidate(row);
    //             }}
    //             sx={{ fontSize: "18px" }}
    //           >
    //             {" "}
    //             <Icon icon="tabler:eye" color="primary" />
    //           </LoadingButton>
    //         </Tooltip>
    //         <Tooltip title="Shortlist Candidate">
    //           <LoadingButton
    //             // loading={isShortListLoading && isShortListLoadingId}
    //             onClick={() => handleAddShortList(row.id)}
    //             sx={{ fontSize: "18px" }}
    //           >
    //             {" "}
    //             <Icon icon="tabler:user-check" color="primary" />
    //           </LoadingButton>
    //         </Tooltip>
    //       </Box>
    //     );
    //   },
    // },
  ];
  const router = useRouter();

  const handleViewCandidate = (row) => {
    console.log(row);
    router.push(`${`/recruiter/seeker-profile/`}?id=${row?.id}`);
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Resume Search " />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent>
            <Grid container spacing={2}>
              <Grid item sm={6} xs={12} lg={8} mt={0}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Search keywords"}
                  required
                  fullWidth
                  size="small"
                  name="Search"
                  placeholder="Search skills, resume headline..etc"
                  value={keyword
                    ?.trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => setKeyword(e.target.value || "")}
                  onKeyDown={(ev) => {
                    console.log(`Pressed keyCode ${ev.key}`);
                    if (ev.key === "Enter") {
                      // Do code here
                      ev.preventDefault();
                      // if (searchKeyword.length >= 3) {
                      handleSearch();
                      // }
                    }
                  }}
                />
              </Grid>
              <Grid item sm={3} xs={12} lg={4} mt={0}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Job Location"}
                  fullWidth
                  size="small"
                  name="Job Location"
                  placeholder="Chennai, Delhi, Mumbai..."
                  value={location
                    ?.trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => setLocation(e.target.value || "")}
                  onKeyDown={(ev) => {
                    console.log(`Pressed keyCode ${ev.key}`);
                    if (ev.key === "Enter" && keyword !== "") {
                      // Do code here
                      ev.preventDefault();
                      // if (searchKeyword.length >= 3) {
                      handleSearch();
                      // }
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item sm={4} xs={12} lg={6}>
                <Grid container spacing={2}>
                  <Grid item sm={6} xs={12} lg={6}>
                    <TextField
                      sx={{ my: 2 }}
                      label={"Salary From"}
                      fullWidth
                      size="small"
                      name="salaryFrom"
                      placeholder="Salary From (in LPA)"
                      value={salaryFrom
                        ?.trimStart()
                        .replace(/\s\s+/g, "")
                        .replace(/\p{Emoji_Presentation}/gu, "")}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                      onKeyDown={(ev) => {
                        console.log(`Pressed keyCode ${ev.key}`);
                        if (ev.key === "Enter" && keyword !== "") {
                          // Do code here
                          ev.preventDefault();
                          // if (searchKeyword.length >= 3) {
                          handleSearch();
                          // }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12} lg={6}>
                    <TextField
                      sx={{ my: 2 }}
                      label={"Salary To"}
                      fullWidth
                      size="small"
                      name="salaryTo"
                      placeholder="Salary To (in LPA)"
                      value={salaryTo
                        ?.trimStart()
                        .replace(/\s\s+/g, "")
                        .replace(/\p{Emoji_Presentation}/gu, "")}
                      onChange={(e) => setSalaryTo(e.target.value)}
                      onKeyDown={(ev) => {
                        console.log(`Pressed keyCode ${ev.key}`);
                        if (ev.key === "Enter" && keyword !== "") {
                          // Do code here
                          ev.preventDefault();
                          // if (searchKeyword.length >= 3) {
                          handleSearch();
                          // }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item sm={4} xs={12} lg={3}>
                <TextField
                  sx={{ my: 2 }}
                  label={"Experience (in years)"}
                  fullWidth
                  size="small"
                  name="Experience"
                  placeholder="Experience (in years)"
                  value={experience
                    ?.trimStart()
                    .replace(/\s\s+/g, "")
                    .replace(/\p{Emoji_Presentation}/gu, "")}
                  onChange={(e) => setExperiance(e.target.value || "")}
                  onKeyDown={(ev) => {
                    console.log(`Pressed keyCode ${ev.key}`);
                    if (ev.key === "Enter" && keyword !== "") {
                      // Do code here
                      ev.preventDefault();
                      // if (searchKeyword.length >= 3) {
                      handleSearch();
                      // }
                    }
                  }}
                />
              </Grid>
              <Grid item sm={4} xs={12} lg={3}>
                <FormControl fullWidth sx={{ my: 2 }} size="small">
                  <InputLabel id="demo-simple-select-label ">
                    Notice Period
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value || "")}
                    label="Notice Period"
                  >
                    <MenuItem value={""}>All</MenuItem>
                    <MenuItem value={"immediate"}>Immediate</MenuItem>
                    <MenuItem value={"15 Days"}>15 Days</MenuItem>
                    <MenuItem value={"30 Days"}>30 Days</MenuItem>
                    <MenuItem value={"45 Days"}>45 Days</MenuItem>
                    <MenuItem value={"60 Days"}>60 Days</MenuItem>
                    <MenuItem value={"90 Days"}>90 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid
              item
              sm={12}
              xs={12}
              lg={12}
              mt={2}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <LoadingButton
                disabled={keyword === ""}
                loading={isLoading}
                variant="contained"
                onClick={() => handleSearch()}
              >
                Search
              </LoadingButton>
            </Grid>
            {/* <Grid item sm={4} xs={12} lg={12} mt={0}>
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
            </Grid> */}
          </CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          {resumeSearchList?.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mr: 4 }}>
              <ExcelDownload
                excelData={resumeSearchList}
                fileName={"Grameya_Resume_Data_" + Date.now().toString()}
              />

              {selectedIds.length > 0 && (
                <Button
                  variant={"outlined"}
                  color={"primary"}
                  size="small"
                  sx={{ "& svg": { mr: 2 } }}
                  onClick={() => setAddUserOpen(true)}
                >
                  <Icon icon="fxemoji:email" fontSize="1.125rem" />
                  {"Send Email"}
                </Button>
              )}
              {selectedIds.length > 0 && (
                <LoadingButton
                  loading={isShortListLoading}
                  variant={"outlined"}
                  color={"primary"}
                  size="small"
                  sx={{ "& svg": { mr: 2 }, ml: 2 }}
                  onClick={() => handleAddShortList(selectedIds)}
                >
                  <Icon icon="mdi:user-check-outline" fontSize="1.125rem" />
                  {"Shortlist"}
                </LoadingButton>
              )}
            </Box>
          )}
          <Box p={4}>
            <DataGrid
              autoHeight
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
              rowHeight={62}
              rows={resumeSearchList}
              onRowClick={(row) => handleViewCandidate(row?.row)}
              loading={isLoading}
              columns={searchListColumns}
              rowCount={rowCountState}
              paginationMode="server"
              checkboxSelection
              // maxSelected={1}
              onRowSelectionModelChange={(ids) => {
                // const selectedIDs = new Set(ids);
                // console.log("Ids", selectedIDs);
                setIds(ids);
                //                 const selectedRowData = resumeSearchList.filter((row) =>
                //                   selectedIDs.has(row.id.toString())
                //                 );
                //                 console.log(selectedRowData);
                //                 const tempEmail=[];
                //                 selectedRowData.map((e)=> {
                // tempEmail.push()
                //                 })
                //                 setSelectedEmails(selectedRowData);
              }}
              // disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Card>
      </Grid>

      <SideBarEmail
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
        selectedId={selectedIds}
      />
    </Grid>
  );
};
Dashboard.acl = {
  action: "read",
  subject: "search",
};

export default Dashboard;
