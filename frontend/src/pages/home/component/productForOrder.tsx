import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Button,
  Box,
} from "@mui/material";
import { useSnackbar } from "../../../context/snack-bar.context";
import { productListApi } from "../../../common/api";
import AddSingleProductForOrder from "../../purchase/component/AddSingleProductForOrder";
import { useNavigate } from "react-router-dom";

const ProductForOrder = () => {
  const { showAlert } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["productForOrder"],
    queryFn: () => productListApi(page + 1, rowsPerPage),
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularProgress />;
  if (error) {
    showAlert(error.message, "error");
    return <Typography color="error">Failed to load products</Typography>;
  }
  return (
    <div>
      <CardContent style={{ marginTop: "20px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Avaiable Products
          </Typography>
          <Button
            size="small"
            disabled={isLoading}
            variant="outlined"
            color="primary"
            onClick={() => navigate("/confirm-purchase")}
          >
            Cart
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price(per unit)</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.currentPrice} / {product.perUnit} {product.unit}</TableCell>
                  <TableCell>
                    {product.availableQuantity} {product.unit.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpenDialog(true);
                      }}
                    >
                      Add to cart
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[3, 20, 30]}
          component="div"
          count={data.totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 3))
          }
        />
      </CardContent>
      <AddSingleProductForOrder
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductForOrder;
