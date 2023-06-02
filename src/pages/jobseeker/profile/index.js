// ** React Imports
import { useContext, useState } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'
import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  Box,
  MenuItem,
  Button,
  Divider,
  IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import { LoadingButton } from '@mui/lab'
import { useFormik } from 'formik'
import Slider from '@mui/material/Slider'
// ** Third Party Imports
import subDays from 'date-fns/subDays'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'
import * as yup from 'yup'
import { useTheme } from '@mui/material/styles'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { yupResolver } from '@hookform/resolvers/yup'
import MuiTabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import TabPanel from '@mui/lab/TabPanel'
import useMediaQuery from '@mui/material/useMediaQuery'
import TabContext from '@mui/lab/TabContext'
// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import UserProfileHeader from './UserProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import CustomInput from './PickersCustomInput'

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const ACLPage = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const store = useSelector(state => state.user)
  const [salary, setSalary] = useState([0, 10])
  const [activeTab, setActiveTab] = useState('info')
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const [currentCTC, setCurrentCTC] = useState(0)
  const [expectedCTC, setExpectedCTC] = useState(0)
  const [experiance, setExperiance] = useState(1)
  const [minDate, setMinDate] = useState(new Date())
  const [maxDate, setMaxDate] = useState(new Date())
  const [categoryList, setCategoryList] = useState([
    { id: 1, jobCategory: 'IT' },
    { id: 2, jobCategory: 'BPO' },
    { id: 3, jobCategory: 'Banking' },
    { id: 4, jobCategory: 'HR' }
  ])
  const [subCategoryList, setSubCategoryList] = useState([
    { id: 101, pid: 1, category: 'React' },
    { id: 102, pid: 2, category: 'CRE' }
  ])
  const handleChange = (event, newValue) => {
    console.log(newValue)
    setSalary(newValue)
  }
  const handleChangeExp = (event, newValue) => {
    console.log(newValue)
    setExperiance(newValue)
  }
  const formik = useFormik({
    initialValues: {
      fullname: '',
      designation: '',
      email: '',
      mobile: '',
      alternateMobile: '',
      currentLocation: '',
      aboutMe: '',
      jobTitle: '',
      jobCategory: null,
      jobSubCategory: null,
      skills: [],
      experiance: '',
      jobType: '',
      noticePeriod: '',
      shortDescription: '',
      location: '',
      addressLineOne: '',
      addressLineTwo: '',
      city: '',
      state: '',
      postalCode: ''
    },
    //  validationSchema: SignUpValidationSchema,
    onSubmit: async values => {
      const params = {
        first_name: values.firstName,
        last_name: values.lastName,
        designation: values.designation,
        email: values.email,
        country_code: values.code,
        phone: values.phone,
        company_name: values.corporateName,
        country_of_incorporation: values.registration,
        tax_id: values.taxId,
        website: values.url,
        address: values.address,
        address_line_one: values.addressLineOne,
        address_line_two: values.addressLineTwo,
        country: values.country,
        state: values.state,
        city: values.city,
        postal_code: values.postalCode,
        latitude: values.latitude,
        longitude: values.longitude,
        password: values.password,
        primary_industry: values.primaryIndustry,
        user_type: 'individual',
        source: 'dashboard',
        role: 'PARTNER_ADMIN'
      }
    }
  })
  const [workExperiance, setWorkExperiance] = useState([
    { companyName: '', designation: '', skills: [], doj: null, dol: null }
  ])
  const handleFormChange = (index, event) => {
    let data = [...workExperiance]
    console.log(event)
    data[index][event.target.name] = event.target.value
    setWorkExperiance(data)
  }

  const submit = e => {
    e.preventDefault()
    console.log(workExperiance)
  }

  const addFields = () => {
    let object = {
      companyName: '',
      designation: '',
      skills: [],
      doj: null,
      dol: null
    }

    setWorkExperiance([...workExperiance, object])
  }

  const removeFields = index => {
    let data = [...workExperiance]
    data.splice(index, 1)
    setWorkExperiance(data)
  }
  const handleTabChange = (event, value) => {
    // setIsLoading(true)
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleTabChange}
                  aria-label='customized tabs example'
                >
                  <Tab
                    value='info'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize='1.125rem' icon='tabler:user-check' />
                        {!hideText && 'Basic Info'}
                      </Box>
                    }
                  />
                  <Tab
                    value='education'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize='1.125rem' icon='tabler:books' />
                        {!hideText && 'Education'}
                      </Box>
                    }
                  />
                  <Tab
                    value='work'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize='1.125rem' icon='tabler:layout-grid' />
                        {!hideText && 'Work Experiance'}
                      </Box>
                    }
                  />
                </TabList>
              </Grid>
              <Grid item xs={12}>
                {false ? (
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {activeTab === 'info' && (
                      <Grid item md={12} xs={12}>
                        <Card>
                          {/* <CardHeader title='Basic Info' /> */}
                          <CardContent sx={{ display: 'flex', justifyContent: 'center', mx: 32, mt: 4 }}>
                            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                              <Grid container spacing={0}>
                                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                                  <TextField
                                    sx={{ mb: 2 }}
                                    label={'Resume Headline'}
                                    // required
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    name='aboutMe'
                                    error={formik.touched.aboutMe && Boolean(formik.errors.aboutMe)}
                                    value={formik.values.aboutMe
                                      .trimStart()
                                      .replace(/\s\s+/g, '')
                                      .replace(/\p{Emoji_Presentation}/gu, '')}
                                    onChange={e => formik.handleChange(e)}
                                    helperText={
                                      formik.touched.aboutMe && formik.errors.aboutMe && formik.errors.aboutMe
                                    }
                                  />
                                </Grid>
                                <Grid container spacing={2} py={2}>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Full Name'}
                                      required
                                      fullWidth
                                      name='fullname'
                                      error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                      value={formik.values.fullname
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={e => formik.handleChange(e)}
                                      helperText={
                                        formik.touched.fullname && formik.errors.fullname && formik.errors.fullname
                                      }
                                    />
                                  </Grid>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Designation'}
                                      required
                                      fullWidth
                                      name='designation'
                                      error={formik.touched.designation && Boolean(formik.errors.designation)}
                                      value={formik.values.designation
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={e => formik.handleChange(e)}
                                      helperText={
                                        formik.touched.designation &&
                                        formik.errors.designation &&
                                        formik.errors.designation
                                      }
                                    />
                                  </Grid>
                                </Grid>
                                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                                  <TextField
                                    sx={{ mb: 2 }}
                                    label={'Email'}
                                    required
                                    fullWidth
                                    name='email'
                                    type='email'
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    value={formik.values.email
                                      .trimStart()
                                      .replace(/\s\s+/g, '')
                                      .replace(/\p{Emoji_Presentation}/gu, '')}
                                    onChange={e => formik.handleChange(e)}
                                    helperText={formik.touched.email && formik.errors.email && formik.errors.email}
                                  />
                                </Grid>
                                <Grid container spacing={2} py={2}>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Mobile Number'}
                                      required
                                      fullWidth
                                      name='mobile'
                                      error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                      value={formik.values.mobile
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={e => formik.handleChange(e)}
                                      helperText={formik.touched.mobile && formik.errors.mobile && formik.errors.mobile}
                                    />
                                  </Grid>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Alternate Mobile Number'}
                                      fullWidth
                                      name='alternateMobile'
                                      error={formik.touched.alternateMobile && Boolean(formik.errors.alternateMobile)}
                                      value={formik.values.alternateMobile
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={e => formik.handleChange(e)}
                                      helperText={
                                        formik.touched.alternateMobile &&
                                        formik.errors.alternateMobile &&
                                        formik.errors.alternateMobile
                                      }
                                    />
                                  </Grid>
                                </Grid>
                                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                                  <Autocomplete
                                    required
                                    sx={{ my: 2 }}
                                    label={'Skills'}
                                    name={'skills'}
                                    fullWidth
                                    value={formik.values.skills}
                                    multiple
                                    onChange={(event, item) => {
                                      formik.setFieldValue('skills', item)
                                    }}
                                    options={categoryList}
                                    getOptionLabel={option => option.jobCategory}
                                    limitTags={5}
                                    freeSolo={false}
                                    filterSelectedOptions
                                    disableClearable
                                    renderInput={params => (
                                      <TextField
                                        required
                                        {...params}
                                        label={'Skills'}
                                        placeholder='Select Skills'
                                        error={formik.touched.skills && Boolean(formik.errors.skills)}
                                        helperText={
                                          formik.touched.skills && formik.errors.skills && formik.errors.skills
                                        }
                                        variant={'outlined'}
                                        InputProps={{
                                          ...params.InputProps
                                        }}
                                        value={formik?.values?.skills}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid container spacing={2} py={2}>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <FormControl fullWidth sx={{ my: 2 }}>
                                      <InputLabel id='demo-simple-select-label'>Current Location *</InputLabel>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={formik.values.currentLocation}
                                        label='Current Location *'
                                        onChange={e => formik.setFieldValue('location', e.target.value)}
                                      >
                                        <MenuItem value={0}>Chennai</MenuItem>
                                        <MenuItem value={15}>Delhi</MenuItem>
                                        <MenuItem value={30}>Mumbai</MenuItem>
                                        <MenuItem value={90}>Bangalore</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item lg={6} xl={6} xs={12} md={12} sm={12}>
                                    <FormControl fullWidth sx={{ my: 2 }}>
                                      <InputLabel id='demo-simple-select-label'>Prefered Job Location *</InputLabel>
                                      <Select
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                        value={formik.values.location}
                                        label='Prefered Job Location *'
                                        onChange={e => formik.setFieldValue('location', e.target.value)}
                                      >
                                        <MenuItem value={0}>Chennai</MenuItem>
                                        <MenuItem value={15}>Delhi</MenuItem>
                                        <MenuItem value={30}>Mumbai</MenuItem>
                                        <MenuItem value={90}>Bangalore</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                                  <TextField
                                    sx={{ my: 2 }}
                                    label={'Total Experiance (in Years) '}
                                    type='number'
                                    fullWidth
                                    name='from'
                                    value={experiance}
                                    onChange={e => {
                                      setExperiance(e.target.value)
                                    }}
                                  />
                                </Grid>
                                <Grid item lg={12} xl={12} md={12} xs={12} sm={12}>
                                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Grid container spacing={2}>
                                      <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                                        <TextField
                                          sx={{ my: 2 }}
                                          label={'Current CTC (in LPA)'}
                                          type='number'
                                          fullWidth
                                          name='from'
                                          value={currentCTC}
                                          onChange={e => {
                                            setCurrentCTC(e.target.value)
                                          }}
                                        />
                                      </Grid>
                                      <Grid item lg={6} xl={6} md={6} xs={12} sm={12}>
                                        <TextField
                                          sx={{ my: 2 }}
                                          label={' Expected CTC (in LPA)'}
                                          type='number'
                                          fullWidth
                                          name='to'
                                          value={expectedCTC}
                                          onChange={e => {
                                            setExpectedCTC(e.target.value)
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Grid>

                                <Grid item lg={12} xl={12} xs={12} md={6} sm={12}>
                                  <FormControl fullWidth sx={{ my: 2 }}>
                                    <InputLabel id='demo-simple-select-label'>Notice Period *</InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      id='demo-simple-select'
                                      value={formik.values.noticePeriod}
                                      label='Notice Period *'
                                      onChange={e => formik.setFieldValue('noticePeriod', e.target.value)}
                                    >
                                      <MenuItem value={0}>Immediate</MenuItem>
                                      <MenuItem value={15}>15 Days</MenuItem>
                                      <MenuItem value={30}>30 Days</MenuItem>
                                      <MenuItem value={90}>90 Days</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                                  <LoadingButton fullWidth variant='contained'>
                                    Save
                                  </LoadingButton>
                                </Grid>
                              </Grid>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                    {activeTab === 'work' && (
                      <Grid item md={6} xs={12}>
                        <Card>
                          <CardHeader title='Work Experiance' />
                          {/* <CardContent></CardContent> */}
                          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                            {workExperiance?.map((input, index) => {
                              return (
                                <Grid container spacing={2}>
                                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                                    {/* {index !== 0 && <Divider sx={{ m: 0 }} />} */}
                                    <Grid container spacing={2}>
                                      <Grid item lg={10} xl={10} xs={10} md={10} sm={10}>
                                        <Typography sx={{ color: 'text.primary', pl: 3, mt: index == 0 ? 0 : 2 }}>
                                          {index === 0 ? 'Current Company' : `Previous Company ${index}`}
                                        </Typography>
                                      </Grid>
                                      {index !== 0 && (
                                        <Grid
                                          item
                                          lg={2}
                                          xl={2}
                                          xs={2}
                                          md={2}
                                          sm={2}
                                          sx={{ display: 'flex', alignItems: 'end', cursor: 'pointer' }}
                                        >
                                          <Box onClick={() => removeFields(index)}>
                                            <Icon icon='tabler:trash-filled' fontSize='1.125rem' sx={{ mt: 2 }} />
                                          </Box>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Grid>

                                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12} key={index}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Company Name'}
                                      required
                                      fullWidth
                                      name='companyName'
                                      error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                                      value={input.companyName
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={event => handleFormChange(index, event)}
                                      helperText={
                                        formik.touched.companyName &&
                                        formik.errors.companyName &&
                                        formik.errors.companyName
                                      }
                                    />
                                  </Grid>
                                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12} key={index}>
                                    <TextField
                                      sx={{ mb: 2 }}
                                      label={'Designation'}
                                      required
                                      fullWidth
                                      name='designation'
                                      error={formik.touched.designation && Boolean(formik.errors.designation)}
                                      value={input.designation
                                        .trimStart()
                                        .replace(/\s\s+/g, '')
                                        .replace(/\p{Emoji_Presentation}/gu, '')}
                                      onChange={event => handleFormChange(index, event)}
                                      helperText={
                                        formik.touched.designation &&
                                        formik.errors.designation &&
                                        formik.errors.designation
                                      }
                                    />
                                  </Grid>
                                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12}>
                                    <Autocomplete
                                      required
                                      sx={{ my: 2 }}
                                      label={'Skills'}
                                      name='skills'
                                      fullWidth
                                      value={input.skills}
                                      multiple
                                      // onChange={event => handleFormChange(index, event)}
                                      onChange={(event, item) => {
                                        let data = [...workExperiance]
                                        console.log(event)
                                        data[index]['skills'] = item
                                        setWorkExperiance(data)
                                      }}
                                      options={categoryList}
                                      getOptionLabel={option => option.jobCategory}
                                      limitTags={5}
                                      freeSolo={false}
                                      filterSelectedOptions
                                      disableClearable
                                      renderInput={params => (
                                        <TextField
                                          required
                                          {...params}
                                          label={'Skills'}
                                          placeholder='Select Skills'
                                          name='skills'
                                          error={formik.touched.skills && Boolean(formik.errors.skills)}
                                          helperText={
                                            formik.touched.skills && formik.errors.skills && formik.errors.skills
                                          }
                                          variant={'outlined'}
                                          InputProps={{
                                            ...params.InputProps
                                          }}
                                          value={input.skills}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item lg={12} xl={12} xs={12} md={12} sm={12} key={index}>
                                    <Box
                                      sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
                                      className='demo-space-xe'
                                    >
                                      <DatePickerWrapper>
                                        <DatePicker
                                          id='join-date'
                                          selected={minDate}
                                          fullWidth
                                          sx={{ width: 1 }}
                                          //minDate={subDays(new Date(), 5)}
                                          popperPlacement={popperPlacement}
                                          onChange={date => setMinDate(date)}
                                          customInput={<CustomInput label='Date of Joining' />}
                                        />
                                      </DatePickerWrapper>
                                      {index !== 0 && (
                                        <DatePickerWrapper>
                                          <DatePicker
                                            id='leaving-date'
                                            selected={maxDate}
                                            fullWidth
                                            sx={{ width: 1 }}
                                            maxDate={new Date()}
                                            popperPlacement={popperPlacement}
                                            onChange={date => setMaxDate(date)}
                                            customInput={<CustomInput label='Date of Leaving' />}
                                          />
                                        </DatePickerWrapper>
                                      )}
                                    </Box>
                                  </Grid>
                                  <Divider sx={{ m: 2 }} />
                                  {/* <button onClick={() => removeFields(index)}>Remove</button> */}
                                </Grid>
                              )
                            })}
                            <Button variant='outlined' onClick={() => addFields()} sx={{ mt: 2 }}>
                              Add
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    )}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}
ACLPage.acl = {
  action: 'read',
  subject: 'jsprofile'
}

export default ACLPage
