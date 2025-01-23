import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Switch,
  TablePagination,
  Button,
  Box,
} from "@mui/material";
import { useSnackbar } from "../../context/snack-bar.context";
import { productListApi, editProductApi } from "../../common/api";
import ProductDialog from "./components/ProductDialog";

const ProductList = () => {
  const { showAlert } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["productList"],
    queryFn: () => productListApi(page + 1, rowsPerPage),
  });

  const statusUpdate = useMutation<
    unknown,
    unknown,
    { id: number; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => editProductApi({ isActive }, id),
    onSuccess: () => {
      showAlert("Product status updated successfully", "success");
      refetch();
    },
    onError: () => {
      showAlert("Failed to update product status", "error");
    },
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);

  if (isLoading) return <CircularProgress />;
  if (error) {
    showAlert(error.message, "error");
    return <Typography color="error">Failed to load products</Typography>;
  }
  console.log(data);
  return (
    <div>
      <CardContent style={{marginTop: "20px"}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Product List
          </Typography>
          <Button
            size="small"
            disabled={isLoading}
            variant="outlined"
            color="primary"
            onClick={() => {
              setSelectedProduct(null);
              setOpenDialog(true);
            }}
          >
            + Add
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
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.currentPrice}</TableCell>
                  <TableCell>
                    {product.availableQuantity} {product.unit.toLowerCase()}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.isActive}
                      onChange={() =>
                        statusUpdate.mutate({
                          id: product.id,
                          isActive: !product.isActive,
                        })
                      }
                    />
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
                      Edit
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
      <ProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductList;
