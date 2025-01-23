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
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/snack-bar.context";
import CustomFields from "../../common/components/CustomFields";
import { loginApi } from "../../common/api";



const Home = () => {

  return(
    <div>Home</div>
  )
}

export default Home;