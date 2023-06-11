// ** React Imports
import { useState } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Components
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Hooks
import { useSettings } from "src/@core/hooks/useSettings";

// ** Demo Imports
import FooterIllustrationsV2 from "src/views/pages/auth/FooterIllustrationsV2";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { validateEmail, validatePassword } from "src/utils/commonUtils";
import { useDispatch } from "react-redux";
import { authRegister } from "src/store/apps/auth";
import useNotification from "src/hooks/useNotification";

// ** Styled Components
const RegisterIllustration = styled("img")(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550,
  },
  [theme.breakpoints.down("lg")]: {
    maxHeight: 500,
  },
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 750,
  },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: `${theme.palette.primary.main} !important`,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  "& .MuiFormControlLabel-label": {
    color: theme.palette.text.secondary,
  },
}));

const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState({
    user_type: "",
    name: "",
    company_name: "",
    email: "",
    country_code: "",
    phone: "",
    password: "",
  });
  const [termsCheck, setTermsCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendNotification] = useNotification();
  console.log("formValue", formValue);
  console.log("termsCheck", termsCheck);

  // ** Hooks
  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  // ** Vars
  const { skin } = settings;
  const imageSource =
    skin === "bordered"
      ? "auth-v2-register-illustration-bordered"
      : "auth-v2-register-illustration";

  const handleInputChange = (e) => {
    const newFormValue = { ...formValue };
    newFormValue[e.target.name] = e.target.value;
    setFormValue(newFormValue);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handlePhoneChange = (value, country) => {
    const newFormValue = { ...formValue };
    newFormValue["country_code"] = country.dialCode;
    newFormValue["phone"] = value.replace(country.dialCode, "");
    setFormValue(newFormValue);
  };

  const handleFormSubmit = async () => {
    setSubmitted(true);
    if (
      !formValue.user_type ||
      !formValue.name ||
      !formValue.email ||
      !formValue.country_code ||
      !formValue.phone ||
      !formValue.password
    ) {
      return;
    }
    if (formValue.user_type === "recruiter") {
      if (!formValue.company_name) {
        return;
      }
    }
    if (!validateEmail(formValue.email)) {
      return;
    }

    if (!validatePassword(formValue.password)) {
      return;
    }
    if (!termsCheck) {
      return;
    }

    const requestData = {
      user_type: formValue.user_type,
      name: formValue.name,
      company_name: formValue.company_name,
      email: formValue.email,
      country_code: formValue.country_code,
      phone: formValue.phone,
      password: formValue.password,
    };

    const response = await dispatch(
      authRegister({
        formValue: requestData,
      })
    );
    console.log("response", response);
    if (response.payload?.data) {
      sendNotification({
        message: response.payload?.data?.message,
        variant: "success",
      });
    } else {
      sendNotification({
        message: response.payload?.message,
        variant: "error",
      });
    }
  };

  return (
    <Box className="content-right" sx={{ backgroundColor: "background.paper" }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            position: "relative",
            alignItems: "center",
            borderRadius: "20px",
            justifyContent: "center",
            backgroundColor: "customColors.bodyBg",
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <RegisterIllustration
            alt="register-illustration"
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400 }}>
            <img
              height={50}
              width={250}
              alt="add-role"
              src="/images/glogo.png"
            />
            <Box sx={{ my: 6 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Adventure starts here 🚀
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Make your app management easy and fun!
              </Typography>
            </Box>
            <form>
              <FormControl fullWidth>
                <InputLabel id="user_type-select-label">Type</InputLabel>
                <Select
                  labelId="user_type-select-label"
                  id="user_type-select"
                  value={formValue?.user_type}
                  label="Type"
                  name="user_type"
                  onChange={handleInputChange}
                >
                  <MenuItem value="job_seeker">Seeker</MenuItem>
                  <MenuItem value="recruiter">Recruiter</MenuItem>
                </Select>
                {submitted && !formValue.user_type && (
                  <>
                    <FormHelperText error={true}>
                      Type is required
                    </FormHelperText>
                  </>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mt: 4 }}>
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  name="email"
                  onChange={handleInputChange}
                />
                {submitted && !formValue.email && (
                  <>
                    <FormHelperText error={true}>
                      Email is required
                    </FormHelperText>
                  </>
                )}
                {submitted &&
                  formValue.email &&
                  !validateEmail(formValue.email) && (
                    <>
                      <FormHelperText error={true}>
                        Invalid email
                      </FormHelperText>
                    </>
                  )}
              </FormControl>

              <FormControl fullWidth sx={{ mt: 4 }}>
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  name="name"
                  onChange={handleInputChange}
                />
                {submitted && !formValue.name && (
                  <>
                    <FormHelperText error={true}>
                      Name is required
                    </FormHelperText>
                  </>
                )}
              </FormControl>

              {formValue.user_type === "recruiter" && (
                <>
                  <FormControl fullWidth sx={{ mt: 4 }}>
                    <TextField
                      id="outlined-basic"
                      label="Company Name"
                      variant="outlined"
                      name="company_name"
                      onChange={handleInputChange}
                    />
                    {submitted && !formValue.company_name && (
                      <>
                        <FormHelperText error={true}>
                          Company Name is required
                        </FormHelperText>
                      </>
                    )}
                  </FormControl>
                </>
              )}

              <FormControl fullWidth sx={{ mt: 4 }}>
                <PhoneInput
                  inputClass="phone-custom-class"
                  country={"in"}
                  // value={this.state.phone}
                  onChange={(value, country) => {
                    handlePhoneChange(value, country);
                  }}
                  sx={{ with: "100%" }}
                />
                {submitted && !formValue.phone && (
                  <>
                    <FormHelperText error={true}>
                      Phone is required
                    </FormHelperText>
                  </>
                )}
              </FormControl>

              <FormControl sx={{ mt: 4 }} fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="password"
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {submitted && !formValue.password && (
                  <>
                    <FormHelperText error={true}>
                      Password is required
                    </FormHelperText>
                  </>
                )}

                {submitted &&
                  formValue.password &&
                  !validatePassword(formValue.password) && (
                    <>
                      <FormHelperText error={true}>
                        Password should have minimum 8 characters, maximum 16
                        characters, at least one uppercase letter, one lowercase
                        letter, one number and one special character
                      </FormHelperText>
                    </>
                  )}
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsCheck}
                    onChange={(e) => setTermsCheck(e.target.checked)}
                  />
                }
                sx={{
                  mb: 4,
                  mt: 1.5,
                  "& .MuiFormControlLabel-label": {
                    fontSize: theme.typography.body2.fontSize,
                  },
                }}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ color: "text.secondary" }}>
                      I agree to
                    </Typography>
                    <Typography
                      component={LinkStyled}
                      href="/"
                      onClick={(e) => e.preventDefault()}
                      sx={{ ml: 1 }}
                    >
                      privacy policy & terms
                    </Typography>
                  </Box>
                }
              />
              {submitted && !termsCheck && (
                <>
                  <FormHelperText error={true} sx={{ mb: 4 }}>
                    Please check terms and check
                  </FormHelperText>
                </>
              )}
              <Button
                fullWidth
                onClick={handleFormSubmit}
                variant="contained"
                sx={{ mb: 4 }}
              >
                Sign up
              </Button>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary", mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography component={LinkStyled} href="/login">
                  Sign in instead
                </Typography>
              </Box>
              <Divider
                sx={{
                  color: "text.disabled",
                  "& .MuiDivider-wrapper": { px: 6 },
                  fontSize: theme.typography.body2.fontSize,
                  my: (theme) => `${theme.spacing(6)} !important`,
                }}
              >
                or
              </Divider>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#497ce2" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:facebook" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#1da1f2" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:twitter" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  onClick={(e) => e.preventDefault()}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "light" ? "#272727" : "grey.300",
                  }}
                >
                  <Icon icon="mdi:github" />
                </IconButton>
                <IconButton
                  href="/"
                  component={Link}
                  sx={{ color: "#db4437" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon icon="mdi:google" />
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};
Register.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
Register.guestGuard = true;

export default Register;
