// ** React Imports
import { useCallback, useContext, useState, forwardRef } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import { useTheme } from '@mui/material/styles'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}
const Dashboard = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }
  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })
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
          <CardHeader title='Dashboard' />
          <Divider sx={{ m: '0 !important' }} />

          <CardContent>
            <Grid container spacing={6}>
              {/* <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='author'>Author</MenuItem>
                  <MenuItem value='editor'>Editor</MenuItem>
                  <MenuItem value='maintainer'>Maintainer</MenuItem>
                  <MenuItem value='subscriber'>Subscriber</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Plan'
                  SelectProps={{
                    value: plan,
                    displayEmpty: true,
                    onChange: e => handlePlanChange(e)
                  }}
                >
                  <MenuItem value=''>Select Plan</MenuItem>
                  <MenuItem value='basic'>Basic</MenuItem>
                  <MenuItem value='company'>Company</MenuItem>
                  <MenuItem value='enterprise'>Enterprise</MenuItem>
                  <MenuItem value='team'>Team</MenuItem>
                </CustomTextField>
              </Grid> */}
              <Grid item sm={4} xs={12} lg={12} mt={0}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <DatePickerWrapper>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      dateFormat='dd/MM/yyy'
                      endDate={endDateRange}
                      selected={startDateRange}
                      startDate={startDateRange}
                      maxDate={new Date()}
                      shouldCloseOnSelect={false}
                      id='date-range-picker-months'
                      onChange={handleOnChangeRange}
                      popperPlacement={popperPlacement}
                      customInput={<CustomInput label='Select Date' end={endDateRange} start={startDateRange} />}
                    />
                  </DatePickerWrapper>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <Box p={4}>
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={[]}
              columns={columns}
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
  )
}
Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
