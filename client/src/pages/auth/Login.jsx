import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Box,
  IconButton,
  InputAdornment,
  FormControl,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/auth/authSlice";
import Loader from "../../components/Loader";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import OAuth from "../../components/OAuth";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const theme = useTheme();
  const [form, setForm] = useState(initialFormData);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";
  const userInfo = useSelector((state) => state.auth.currentUser);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setServerError("Please fill out all fields.");
      return;
    }

    try {
      const authAPI = await login(form).unwrap();
      const { token, role, id, firstName, username, profileImg } = authAPI.data;

      localStorage.setItem("token", token);

      dispatch(
        setCredentials({
          id,
          firstName,
          username,
          email: form.email,
          role,
          token,
          profileImg,
        })
      );

      // Redirect based on role
      navigate(getRedirectPath(role) || redirect);
    } catch (error) {
      console.error("Login Error:", error);
      setServerError(error.message || "Failed to login. Please try again.");
    }
  };

  const getRedirectPath = (role) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "manager":
        return "/manager/dashboard";
      case "traveler":
        return "/traveler/dashboard";
      case "guide":
        return "/guide/dashboard";
      default:
        return "/";
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.light,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.light,
      },
    },
    color: theme.palette.primary.light,
  };

  const googleSuccess = async (response) => {
    try {
      const res = await dispatch(
        setCredentials({
          token: response.tokenId,
          profile: response.profileObj,
        })
      ).unwrap();
      console.log("Log in success:", res);
      navigate(getRedirectPath(res.role) || redirect);
    } catch (err) {
      setServerError("Google login failed");
    }
  };

  const googleFailure = (response) => {
    setServerError("Google login failed");
    console.error("Google login failed:", response);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        paddingTop: 4,
      }}
    >
      <Box sx={{ color: theme.palette.primary.dark }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 500, color: theme.palette.primary.dark }}
        >
          Log In
        </Typography>
      </Box>
      <ValidatorForm
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
        style={{
          width: isBigScreen ? "30%" : "60%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextValidator
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          sx={{ ...inputStyle, margin: "20px auto" }}
          required
          fullWidth
          value={form.email}
          onChange={handleChange}
          errorMessages={["The Email field is required."]}
        />
        <FormControl
          sx={{ ...inputStyle, width: "100%" }}
          variant="outlined"
          required
        >
          <TextValidator
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            sx={{ ...inputStyle, width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: theme.palette.primary.main }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            label="Password"
            validators={["required"]}
            errorMessages={["Password is required"]}
          />
        </FormControl>
        {serverError && (
          <div className="pt-1 pb-4 text-sm text-red-800 font-semibold text-center">
            <Typography color="error">{serverError}</Typography>
          </div>
        )}
        <Button
          type="submit"
          variant="contained"
          size="medium"
          sx={{
            fontSize: theme.typography.body1.fontSize,
            fontWeight: 500,
            margin: "5px auto",
          }}
          endIcon={<KeyboardArrowRight />}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        {isLoading && <Loader />}
      </ValidatorForm>
      <div className="mt-4">
        <OAuth onSuccess={googleSuccess} onFailure={googleFailure} />
      </div>
      <div className="mt-4">
        <p className="text-blue-500">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-500 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </Container>
  );
}
