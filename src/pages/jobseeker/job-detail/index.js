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
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import GoogleApiWrapper from "../../../utils/GoogleMap/index";

// ** Icon Imports
import Icon from "src/@core/components/icon";

import "react-datepicker/dist/react-datepicker.css";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import { Stack } from "@mui/system";

const useStyles = makeStyles({
  root: {
    "& .MuiDataGrid-root.MuiDataGrid-cell": {
      border: "none",
      borderColor: "transparent",
    },
  },
});
const CandidateJobDetail = () => {
  const router = useRouter();
  const { query } = router;
  console.log("query", query);
  const classes = useStyles();

  return (
    <Grid container spacing={6} className={classes.root}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Job Detail " />
          <Divider sx={{ m: "0 !important" }} />

          <CardContent>
            <Grid container spacing={2}>
              <Grid item sm={12} xs={12} lg={9} mt={0}>
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 500 }}>
                  Product Designer / UI Designer
                </Typography>
                <Typography>8 Vacancy </Typography>
                <Typography sx={{ mt: 4 }}>
                  <Typography sx={{ fontSize: "1.2rem" }}>
                    Job Description
                  </Typography>
                  <Typography sx={{ mt: 2, fontSize: "1rem" }}>
                    As a Product Designer, you will work within a Product
                    Delivery Team fused with UX, engineering, product and data
                    talent. You will help the team design beautiful interfaces
                    that solve business challenges for our clients. We work with
                    a number of Tier 1 banks on building web-based applications
                    for AML, KYC and Sanctions List management workflows. This
                    role is ideal if you are looking to segue your career into
                    the FinTech or Big Data arenas.
                  </Typography>
                </Typography>

                <Typography sx={{ fontSize: "1.2rem", mt: 4 }}>
                  Responsibilities
                </Typography>
                <Typography sx={{ mt: 2, fontSize: "1rem" }}>
                  As a Product Designer, you will work within a Product Delivery
                  Team fused with UX, engineering, product and data talent.
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Have sound knowledge of commercial activities." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Build next-generation web applications with a focus on the client side" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Work on multiple projects at once, and consistently meet draft deadlines" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="have already graduated or are currently in any year of study" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Revise the work of previous designers to create a unified aesthetic for our brand materials" />
                    </ListItem>
                  </List>
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", mt: 4 }}>
                  Qualification
                </Typography>
                <Typography sx={{ fontSize: "1rem", mt: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="B.C.A / M.C.A under National University course complete." />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="3 or more years of professional design experience" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="have already graduated or are currently in any year of study" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Advanced degree or equivalent experience in graphic and web design" />
                    </ListItem>
                  </List>
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", mt: 4 }}>
                  Skill & Experience
                </Typography>
                <Typography sx={{ fontSize: "1rem", mt: 2 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Understanding of key Design Principal" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Proficiency With HTML, CSS, Bootstrap" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Wordpress: 1 year (Required)" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="Experience designing and developing responsive design websites" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <FiberManualRecordIcon />
                      </ListItemIcon>
                      <ListItemText primary="web designing: 1 year (Preferred)" />
                    </ListItem>
                  </List>

                  <Stack direction="row" spacing={3}>
                    <Chip label="React JS" color="primary" variant="outlined" />
                    <Chip label="Node JS" color="primary" variant="outlined" />
                  </Stack>
                </Typography>

                <Box
                  className="form-map form-item"
                  sx={{ height: "221px", position: "relative", mt: 5 }}
                >
                  <GoogleApiWrapper />
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} lg={3} mt={0}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  Job Overview
                </Typography>
                <List>
                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        {/* <FolderIcon /> */}
                        <Icon fontSize="1.25rem" icon="mdi:user" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Job Title"
                      secondary="Product Designer"
                    />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon fontSize="1.25rem" icon="mdi:star-outline" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Experience" secondary="0-3 Years" />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon fontSize="1.25rem" icon="mdi:location" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Location" secondary="New york" />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon fontSize="1.25rem" icon="nimbus:money" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Offered Salary"
                      secondary="$35k - $45k"
                    />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon
                          fontSize="1.25rem"
                          icon="icon-park-outline:degree-hat"
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Qualification"
                      secondary="Bachelor Degree"
                    />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon fontSize="1.25rem" icon="mdi:company" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Industry" secondary="Private" />
                  </ListItem>

                  <ListItem sx={{ p: 0, mt: 6 }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon fontSize="1.25rem" icon="ri:time-line" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Date Posted"
                      secondary="Posted 2 hrs ago"
                    />
                  </ListItem>
                </List>

                <Button variant="outlined" fullWidth sx={{ my: 5 }}>
                  Save Job
                </Button>
                <Button variant="contained" fullWidth>
                  Applay Job
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
CandidateJobDetail.acl = {
  action: "read",
  subject: "jsJobDetail",
};

export default CandidateJobDetail;
