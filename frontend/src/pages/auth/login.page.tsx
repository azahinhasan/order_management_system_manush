import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useSnackbar } from "../../context/snack-bar.context";
import CustomFields from "../../components/CustomFields";
import { loginApi } from "../../common/api";

// Example login function that can be used with TanStack Query


const Login = () => {
  const { showAlert } = useSnackbar();

  const { mutate,isPending} = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (res.status===200) {
        Cookies.set("refreshTokenId", res.data.refreshTokenId);
        Cookies.set("tokenId", res.data.tokenId);
        Cookies.set("role", res.data.user.roleInfo.role);

        window.location.reload();
      } else {
        showAlert(res.message, "error");
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      showAlert(error.message || "Failed to login", "error");
    },
  });

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .required("Email or phone is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      mutate({ identifier: values.identifier, password: values.password });
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: "-80px auto",
      }}
    >
      <Card sx={{ maxWidth: 400, padding: 2 }}>
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            textAlign={"center"}
          >
            Login
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <CustomFields
              label="Email or Phone"
              fullWidth
              {...formik.getFieldProps("identifier")}
              error={formik.touched.identifier && Boolean(formik.errors.identifier)}
              helperText={formik.errors.identifier}
            />
            <CustomFields
              fullWidth
              label="Password"
              fieldType="password"
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.errors.password}
              margin="normal"
            />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
