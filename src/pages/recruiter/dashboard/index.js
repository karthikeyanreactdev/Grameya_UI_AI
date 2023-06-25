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
import { DataGrid } from "@mui/x-data-grid";
import { getJobList } from "src/store/apps/recruiter/manageJob";
import { getApplicantsList } from "src/store/apps/recruiter/applications";
import { useDispatch, useSelector } from "react-redux";
import CustomChip from "src/@core/components/mui/chip";
import moment from "moment/moment";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Tooltip } from "@mui/material";

const userStatusObj = {
  active: "success",
  hired: "info",
  disabled: "error",
};

const useStyles = makeStyles({
  root: {
    // "& .MuiDataGrid-columnHeaders ": {
    //   backgroundColor: (theme) => theme.palette.primary.main,
    // },
  },
});
const Applications = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();

  const dispatch = useDispatch();
  // const navigate = useNavigate;
  const { recruiterApplicantsList, isLoading, pageCount } = useSelector(
    (state) => state.applications
  );
  console.log("recruiterApplicantsList", recruiterApplicantsList);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const applicationsListcolumns = [
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
      headerName: "Comapny Name",
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: "location",
      headerName: "Location",
      renderCell: ({ row }) => `${row.city}, ${row.state}`,
    },
    {
      flex: 0.1,
      minWidth: 300,
      sortable: true,

      field: "total_applications",
      headerName: "Total Applicants (Click on to view details)",
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
      minWidth: 100,
      sortable: true,

      field: "posted_on",
      headerName: "Posted On",
      // renderHeader: (params) => (
      //   <strong>
      //     {"Company Name "}
      //     <span role="img" aria-label="enjoy">
      //       🏢
      //     </span>
      //   </strong>
      // ),
      renderCell: ({ row }) => `${moment(row.posted_on).format("DD/MM/YYYY")}`,
    },

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
  const [rowCountState, setRowCountState] = useState(pageCount?.total || 0);
  const getApplicants = () => {
    const params = {
      page: paginationModel?.page + 1,
      size: paginationModel?.pageSize,
    };
    dispatch(getApplicantsList(params));
  };
  useEffect(() => {
    getApplicants();
  }, []);
  useEffect(() => {
    getApplicants();
  }, [paginationModel?.page, paginationModel?.pageSize, rowCountState]);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      pageCount?.total !== undefined ? pageCount?.total : prevRowCountState
    );
  }, [pageCount?.total, setRowCountState]);

  const handleApplications = async (row) => {
    router.push(
      {
        pathname: "/recruiter/applied-candiates",
        query: { cid: row?.id },
      },
      "/recruiter/applied-candiates"
    );
  };
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
          <CardHeader title="Dashboard" />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent></CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <Box p={4}>
            <DataGrid
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
                "& .MuiDataGrid-columnHeaders.MuiDataGrid-withBorderColor": {
                  borderColor: `${theme.palette.primary.main}`,
                },

                "& .MuiDataGrid-columnSeparator ": {
                  color: "#fff",
                },
                "& .MuiDataGrid-virtualScroller": {
                  // border: `1px solid ${theme.palette.primary.main}`,
                  border: `.25px solid grey`,
                },
              }}
              autoHeight
              rowHeight={62}
              rows={recruiterApplicantsList}
              loading={isLoading}
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
      </Grid>
    </Grid>
  );
};
Applications.acl = {
  action: "read",
  subject: "dashboard",
};

export default Applications;
