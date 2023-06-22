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
const userStatusObj = {
  active: "success",
  hired: "info",
  disabled: "error",
};
const Applications = () => {
  // ** Hooks
  const ability = useContext(AbilityContext);
  const dispatch = useDispatch();
  const { recruiterApplicantsList, isLoading } = useSelector(
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
      field: "location",
      headerName: "Location",
      renderCell: ({ row }) => `${row.city}, ${row.state}`,
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
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,

      field: "total_applications",
      headerName: "Total Applicants",
      // renderCell: ({ row }) => <RowOptions id={row.id} />,
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
  const getApplicants = () => {
    const params = {
      page: paginationModel?.page,
      size: paginationModel?.pageSize,
    };
    dispatch(getApplicantsList(params));
  };
  useEffect(() => {
    getApplicants();
  }, []);
  useEffect(() => {
    getApplicants();
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
          <CardHeader title="Dashboard" />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent></CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <Box p={4}>
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={recruiterApplicantsList}
              loading={isLoading}
              columns={applicationsListcolumns}
              disableRowSelectionOnClick
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
