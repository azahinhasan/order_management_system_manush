import "./App.css";
import RoutesHandler from "./pages/routes";
import { SnackbarProvider } from "./context/snack-bar.context";
import { ProductProvider } from "./context/product.context";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
