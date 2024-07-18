import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Avatar,
  FormControl,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Alert } from "flowbite-react";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/auth/authSlice";
import { signup } from "../../api/authAPI";
import { getUser } from "../../api/userAPI";
import { AuthContext } from "../../context/AuthContext";
import OAuth from "../../components/OAuth";
import Loader from "../../components/Loader";

const initialFormData = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
};

export default function Registration() {
  const theme = useTheme();
  const [form, setForm] = useState(initialFormData);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery(theme.breakpoints.up("md"));

  const { search } = useLocation();
  const [nationality, setNationality] = useState(false);
  const [error, setError] = useState(false);
  const confpassInput = useRef();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeConfPass = () => {
    setError(confpassInput.current.value !== form.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authAPI = await signup(form);
    if (authAPI && !authAPI.error) {
      const token = authAPI.token;
      localStorage.setItem("token", token);
      const user = await getUser();
      if (user) {
        setAuthUser({
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          token: token,
        });
        navigate("/");
      }
    } else {
      setServerError(authAPI.error);
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        paddingTop: 4,
        overflow: "auto",
        marginBottom: "80px",
      }}
    >
      <Box
        sx={{
          color: theme.palette.primary.dark,
        }}
        className="mr-[4rem] mt-[5rem]"
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 300, color: theme.palette.primary.dark }}
        >
          Register
        </Typography>
      </Box>

      <ValidatorForm
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        style={{
          width: isBigScreen ? "30%" : "60%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextValidator
          label="First name"
          variant="outlined"
          type="text"
          fullWidth
          sx={{ ...inputStyle, margin: "20px auto" }}
          validators={["required", "minStringLength:3"]}
          errorMessages={[
            "This field is required.",
            "Minimum of 3 characters.",
          ]}
          required
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
        <TextValidator
          label="Last name"
          variant="outlined"
          type="text"
          fullWidth
          sx={{ ...inputStyle, marginBottom: "20px" }}
          validators={["required", "minStringLength:3"]}
          errorMessages={[
            "This field is required.",
            "Minimum of 3 characters.",
          ]}
          required
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
        <TextValidator
          label="Username"
          variant="outlined"
          type="text"
          fullWidth
          sx={{ ...inputStyle, marginBottom: "20px" }}
          validators={["required", "minStringLength:3"]}
          errorMessages={[
            "This field is required.",
            "Minimum of 3 characters.",
          ]}
          required
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <TextValidator
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          sx={{ ...inputStyle, marginBottom: "20px" }}
          validators={["required", "isEmail"]}
          errorMessages={["This field is required.", "Email is not valid."]}
          required
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Box
          sx={{
            display: "flex",
            gap: { xs: "20px", sm: 1 },
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            width: "100%",
          }}
          className="my-[2rem]"
        >
          <FormControl
            sx={{ ...inputStyle, width: { xs: "100%", sm: "50%" } }}
            variant="outlined"
            required
          >
            <TextValidator
              id="password"
              sx={{
                ...inputStyle,
                width: "100%",
                "& .MuiFormHelperText-root": {
                  whiteSpace: "pre-line",
                  paddingTop: 1,
                  paddingLeft: 1,
                  margin: 0,
                  lineHeight: "14px",
                },
              }}
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              validators={[
                "required",
                "matchRegexp:^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
              ]}
              errorMessages={[
                "This field is required.",
                "Please provide a password with: \n At least 8 characters. \n One symbol. \n One number. \n One upper letter. \n One lower letter.",
              ]}
              label="Password"
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
            />
          </FormControl>
          <FormControl
            sx={{ ...inputStyle, width: { xs: "100%", sm: "50%" } }}
            variant="outlined"
            required
          >
            <TextValidator
              id="conf-password"
              sx={{ ...inputStyle, width: "100%" }}
              inputRef={confpassInput}
              type={showPassword ? "text" : "password"}
              error={error}
              helperText={error ? "Passwords don't match." : ""}
              onChange={handleChangeConfPass}
              label="Confirm Password"
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
            />
          </FormControl>
        </Box>
        {serverError && (
          <Typography
            color="error"
            sx={{
              pt: 0,
              pb: 4,
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {serverError}
          </Typography>
        )}
        <Box className="my-[2rem]">
          <Box className="flex items-center">
            <input
              id="nationality"
              type="checkbox"
              className="mr-2"
              checked={nationality}
              onChange={(e) => setNationality(e.target.checked)}
            />
            <label htmlFor="nationality" className="text-sm font-medium">
              Are you Ethiopian?
            </label>
          </Box>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Button
            type="submit"
            variant="contained"
            size="medium"
            sx={{
              fontSize: theme.typography.body1,
              fontWeight: 500,
              width: { xs: "50%", sm: "25%" },
              margin: "10px auto",
            }}
            endIcon={<KeyboardArrowRight />}
          >
            SignUp
          </Button>
        </Box>
        {isLoading && <Loader />}
      </ValidatorForm>

      <Box mt={4}>
        <OAuth />
      </Box>

      <Box mt={4}>
        <Typography>
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-500 hover:underline"
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
