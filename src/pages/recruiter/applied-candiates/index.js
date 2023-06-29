// ** React Imports
import { useContext, useEffect, useState } from "react";

// ** Context Imports
import { AbilityContext } from "src/layouts/components/acl/Can";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { getJobList } from "src/store/apps/recruiter/manageJob";
import CustomAvatar from "src/@core/components/mui/avatar";
import { getInitials } from "src/@core/utils/get-initials";
import OptionsMenu from "src/@core/components/option-menu";
import { useTheme } from "@mui/material/styles";

import {
  getApplicantsList,
  getAppliedCandidatesList,
} from "src/store/apps/recruiter/applications";
import { useDispatch, useSelector } from "react-redux";
import CustomChip from "src/@core/components/mui/chip";
import moment from "moment/moment";
import Swal from "sweetalert2";
import { getCandidateList } from "src/store/apps/recruiter/candidates";
import { Button, Chip, Select, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import SideBarJob from "./manageStatus";
import { useRouter } from "next/router";
import { getAppliedCandidateList } from "src/store/apps/recruiter/applicants";
import useNotification from "src/hooks/useNotification";
import { addShortList } from "src/api-services/recruiter/candidate";
import { LoadingButton } from "@mui/lab";

// import "sweetalert2/src/sweetalert2.scss";
const userStatusObj = {
  submitted: "success",
  // hired: "info",
  inactive_seeker: "warning",
  call_resheduled: "warning",
  call_not_picked: "warning",
  interview_canceled: "error",
};

const statusObj = {
  submitted: "Applied",
  call_not_picked: "Call not picked",
  inactive_seeker: "Inactive/Not Intrested",
  interview_schedulded: "Interview Scheduled",
  interview_canceled: "Interview Canceled",
  remove: "Remove",
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
const Candidates = (props) => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const [sendNotification] = useNotification();

  const apiRef = useGridApiRef();
  const { appliedCandidateList, isLoading, pageCount } = useSelector(
    (state) => state.applicants
  );
  console.log("appliedCandidateList", appliedCandidateList);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [isShortListLoading, setIsShortListLoading] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [id, setId] = useState("");
  const [RowData, setRowData] = useState([]);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const applicationsListcolumns = [
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
      minWidth: 100,
      sortable: true,
      field: "current_location",
      headerName: "Location",
      // renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 200,
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
      field: "total_years_of_experience",
      headerName: "Experience",
      renderCell: ({ row }) => `${row.total_years_of_experience} years`,
    },
    {
      flex: 0.1,
      minWidth: 200,
      sortable: true,

      field: "applied_on",
      headerName: "Applied On",
      // renderHeader: (params) => (
      //   <strong>
      //     {"Company Name "}
      //     <span role="img" aria-label="enjoy">
      //       🏢
      //     </span>
      //   </strong>
      // ),
      renderCell: ({ row }) =>
        `${moment(row.applied_on).format("DD/MM/YYYY  hh:mm A")}`,
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
              label={statusObj[row.status]}
              color={userStatusObj[row.status]}
              // onClick={async () => {
              //   setId(row.id);
              //   setRowData(row);
              //   setAddUserOpen(true);
              // }}
              sx={{
                // mr: 2,
                height: 24,
                minWidth: 24,
                wordWrap: "break-word",
                // "& .MuiChip-label": { px: 1.5, textTransform: "capitalize" },
              }}
            />

            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              fullWidth
              size="small"
              defaultValue={row.status}
              // value={formik.values.noticePeriod}

              onChange={(e) => {
                // formik.setFieldValue("noticePeriod", e.target.value)
                // const rowIds = apiRef.current.getAllRowIds();
                // const rowId = randomArrayItem(rowIds);

                apiRef.current.updateRows([
                  { id: row.id, status: e.target.value },
                ]);
                // row.status = e.target.value;
                console.log(row);
              }}
            >
              <MenuItem value={"immediate"}>Immediate</MenuItem>
              <MenuItem value={"15 Days"}>15 Days</MenuItem>
              <MenuItem value={"30 Days"}>30 Days</MenuItem>
              <MenuItem value={"45 Days"}>45 Days</MenuItem>
              <MenuItem value={"60 Days"}>60 Days</MenuItem>
              <MenuItem value={"90 Days"}>90 Days</MenuItem>
            </Select> */}
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 300,
      sortable: false,
      // field: "Action",
      headerName: "Action",
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {/* <Button onClick={() => {}}>View</Button> */}
              <Tooltip title="View Candidate">
                <LoadingButton
                  // isLoading={isViewLoading}
                  onClick={() => {}}
                  sx={{ fontSize: "18px" }}
                >
                  {" "}
                  <Icon icon="tabler:eye" color="primary" />
                </LoadingButton>
              </Tooltip>
              <Tooltip title="Shortlist Candidate">
                <LoadingButton
                  // isLoading={isShortListLoading}
                  onClick={() => handleAddShortList(row.id)}
                  sx={{ fontSize: "18px" }}
                >
                  {" "}
                  <Icon icon="tabler:user-check" color="primary" />
                </LoadingButton>
              </Tooltip>
            </Box>
          </Box>
        );
      },
    },

    // {
    //   flex: 0.1,
    //   minWidth: 300,
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
    //         <Tooltip title="View Candidate">
    //           <IconButton onClick={() => {}}>
    //             {" "}
    //             <Icon icon="tabler:eye" color="primary" />
    //           </IconButton>
    //         </Tooltip>
    //         {/* <Tooltip title="Manage Candidate">
    //           <OptionsMenu
    //             iconButtonProps={{ size: "small" }}
    //             menuProps={{ sx: { "& .MuiMenuItem-root svg": { mr: 2 } } }}
    //             options={[
    //               {
    //                 text: "Download",
    //                 icon: <Icon icon="tabler:download" fontSize="1.25rem" />,
    //               },
    //               {
    //                 text: "Edit",
    //                 href: `/apps/invoice/edit/${row.id}`,
    //                 icon: <Icon icon="tabler:pencil" fontSize="1.25rem" />,
    //               },
    //               {
    //                 text: "Duplicate",
    //                 icon: <Icon icon="tabler:copy" fontSize="1.25rem" />,
    //               },
    //             ]}
    //           />
    //         </Tooltip> */}
    //       </Box>
    //     );
    //   },
    // },
  ];
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);
  const getCandidates = () => {
    if (router?.query?.cid) {
      const params = {
        job_id: router?.query?.cid,

        page: paginationModel?.page + 1,
        size: paginationModel?.pageSize,
      };
      dispatch(getAppliedCandidateList(params));
    }
  };
  useEffect(() => {
    getCandidates();
  }, []);
  useEffect(() => {
    if (!addUserOpen) {
      getCandidates();
    }
  }, [
    paginationModel?.page,
    paginationModel?.pageSize,
    rowCountState,
    addUserOpen,
    router?.query?.cid,
  ]);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageCount?.total !== undefined ? pageCount?.total : prevRowCountState
    );
  }, [pageCount?.total, setRowCountState]);
  console.log(router);
  const handleAddShortList = async (id) => {
    Swal.fire({
      title: "Do you want to shortlist this candidate?",
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      // denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          const params = {
            seeker_ids: [id],
          };
          setIsShortListLoading(true);
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
        // Swal.fire("Saved!", "", "success");
      }
    });
  };
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Applied Candidates" />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent></CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
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
              rows={appliedCandidateList}
              loading={isLoading}
              onRowClick={(it) => console.log(it)}
              columns={applicationsListcolumns}
              disableRowSelectionOnClick
              rowCount={rowCountState}
              paginationMode="server"
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box>
        </Card>
        <SideBarJob
          open={addUserOpen}
          toggle={toggleAddUserDrawer}
          id={id}
          RowData={RowData}
        />
      </Grid>
    </Grid>
  );
};
Candidates.acl = {
  action: "read",
  subject: "appliedCandidates",
};

export default Candidates;
