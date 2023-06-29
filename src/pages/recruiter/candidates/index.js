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

import { getApplicantsList } from "src/store/apps/recruiter/applications";
import { useDispatch, useSelector } from "react-redux";
import CustomChip from "src/@core/components/mui/chip";
import moment from "moment/moment";
import Swal from "sweetalert2";
import { getCandidateList } from "src/store/apps/recruiter/candidates";
import { Button, Chip, Select, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import SideBarJob from "./manageStatus";
import { LoadingButton } from "@mui/lab";
// import "sweetalert2/src/sweetalert2.scss";
const userStatusObj = {
  interview_schedulded: "success",
  shortlisted: "success",
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
const Candidates = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const theme = useTheme();

  const apiRef = useGridApiRef();
  const { shortListedCandidatesList, isLoading, pageCount } = useSelector(
    (state) => state.candidates
  );
  console.log("shortListedCandidatesList", shortListedCandidatesList);
  const [addUserOpen, setAddUserOpen] = useState(false);
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
              onClick={async () => {
                setId(row.id);
                setRowData(row);
                setAddUserOpen(true);
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

    {
      flex: 0.1,
      minWidth: 100,
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
            <Tooltip title="View Candidate">
              <LoadingButton
                // isLoading={isShortListLoading}

                sx={{ fontSize: "18px" }}
              >
                {" "}
                <Icon icon="tabler:eye" color="primary" />
              </LoadingButton>
            </Tooltip>
            {/* <Tooltip title="Manage Candidate">
              <OptionsMenu
                iconButtonProps={{ size: "small" }}
                menuProps={{ sx: { "& .MuiMenuItem-root svg": { mr: 2 } } }}
                options={[
                  {
                    text: "Download",
                    icon: <Icon icon="tabler:download" fontSize="1.25rem" />,
                  },
                  {
                    text: "Edit",
                    href: `/apps/invoice/edit/${row.id}`,
                    icon: <Icon icon="tabler:pencil" fontSize="1.25rem" />,
                  },
                  {
                    text: "Duplicate",
                    icon: <Icon icon="tabler:copy" fontSize="1.25rem" />,
                  },
                ]}
              />
            </Tooltip> */}
          </Box>
        );
      },
    },
  ];
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);
  const getCandidates = () => {
    const params = {
      page: paginationModel?.page + 1,
      size: paginationModel?.pageSize,
    };
    dispatch(getCandidateList(params));
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
  ]);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageCount?.total !== undefined ? pageCount?.total : prevRowCountState
    );
  }, [pageCount?.total, setRowCountState]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Manage Candidates" />
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
              rowSelection={true}
              rows={shortListedCandidatesList}
              loading={isLoading}
              columns={applicationsListcolumns}
              disableRowSelectionOnClick
              rowCount={rowCountState}
              paginationMode="server"
              onRowClick={(it) => console.log(it)}
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
  subject: "candidates",
};

export default Candidates;
