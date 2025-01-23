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
  Switch,
  TablePagination,
} from "@mui/material";
import { useSnackbar } from "../../context/snack-bar.context";
import { productListApi } from "../../common/api";

const ProductList = () => {
  const { showAlert } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["productList"],
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
  console.log(data);
  return (
    <div>
      <CardContent>
        <Typography variant="h5" gutterBottom textAlign="center">
          Product List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price(per unit)</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products
                .map((product:any) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.currentPrice}</TableCell>
                    <TableCell>
                      {product.availableQuantity} {product.unit.toLowerCase()}
                    </TableCell>
                    <TableCell>
                      <Switch checked={product.isActive} onChange={() => {}} />
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
    </div>
  );
};

export default ProductList;
