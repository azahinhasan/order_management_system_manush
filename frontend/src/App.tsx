import "./App.css";
import RoutesHandler from "./pages/routes";
import { SnackbarProvider } from "./context/snack-bar.context";
import { ProductProvider } from "./context/product.context";

function App() {
  return (
    <div id="root">
      <ProductProvider>
        <SnackbarProvider>
          <RoutesHandler />
        </SnackbarProvider>
      </ProductProvider>
    </div>
  );
}

export default App;
