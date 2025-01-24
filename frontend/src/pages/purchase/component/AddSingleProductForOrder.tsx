import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "../../../context/snack-bar.context";
import CustomFields from "../../../components/CustomFields";


interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  unit: string;
}

const AddSingleProductForOrder: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  productId,
  unit,
}) => {
  const { showAlert } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      orderQuantity: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      orderQuantity: Yup.string().required("Quantity is required"),
    }),
    onSubmit: (values) => {

      const orderQuantity = parseInt(values.orderQuantity, 10);
      const storedOrders = localStorage.getItem("orders");
      const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

      const existingIndex = existingOrders.findIndex((item:any) => item.productId === productId);
      if (existingIndex !== -1) {
        showAlert('Product already added','error',)
      } else {
        existingOrders.push({ productId, orderQuantity });
        showAlert('Product added','success',)
        onClose()
      }
      localStorage.setItem("orders", JSON.stringify(existingOrders));

    },
  });

  console.log(formik.values);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <CustomFields
          fullWidth
          label={"Quantity (in "+unit.toLocaleLowerCase()+")"}
          margin="dense"
          fieldType="number"
          {...formik.getFieldProps("orderQuantity")}
          error={formik.touched.orderQuantity && Boolean(formik.errors.orderQuantity)}
          helperText={formik.touched.orderQuantity && formik.errors.orderQuantity}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
        >
          Add{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSingleProductForOrder;
