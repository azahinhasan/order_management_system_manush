import { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import Slider from "react-slick"; // Import react-slick
import { useProductContext } from "../../context/product.context";
import ProductForOrder from "./component/productForOrder";

// Slick carousel settings
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const colors = ["#b05e58", "#7967c7", "#8f4a66"];

const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const Home = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { promotionData, promotionLoading, promotionError } =
    useProductContext();

  useEffect(() => {
    console.log(promotionData, "promotionData");
    if (!promotionLoading) {
      if (promotionError) {
        console.error("Error loading promotions:", promotionError);
      } else {
        console.log("Promotion Data:", promotionData);
      }
    }
  }, [promotionData, promotionLoading, promotionError]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Carousel for displaying promotions */}
      {promotionLoading ? (
        <CircularProgress />
      ) : promotionError ? (
        null
      ) : (
        <Slider {...settings}>
          {promotionData?.map((promotion) => {
            const randomBorderColor = getRandomColor();
            return (
              <div key={promotion.id} style={{ padding: "10px" }}>
                <Card
                  sx={{
                    maxWidth: 345,
                    minHeight: 190,
                    margin: "0 auto",
                    border: `2px solid ${randomBorderColor}`,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="div"
                      style={{ color: `${randomBorderColor}` }}
                    >
                      {promotion.title}
                    </Typography>
                    <Typography variant="subtitle1">
                      {promotion.secondTitle}
                    </Typography>
                    <hr />
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      {promotion.type === "WEIGHTED" ? (
                        <>
                          Discount: {promotion.discountAmount || "-"} BDT per{" "}
                          {promotion.perQuantity || "-"}{" "}
                          {promotion.unit?.toLowerCase() || "-"}
                        </>
                      ) : promotion.type === "FIXED" ? (
                        <>
                          Discount: {promotion.discountAmount || "-"} BDT
                          (Fixed)
                        </>
                      ) : promotion.type === "PERCENTAGE" ? (
                        <>Discount: {promotion.discountAmount || "-"}% off</>
                      ) : (
                        <>No discount available</>
                      )}
                    </Typography>
                    {promotion.type === "WEIGHTED" && (
                      <>
                        <hr />
                        <Typography variant="body2">
                          Applicable on orders between <br />{" "}
                          {promotion.minimumRange} {promotion.unit.toLowerCase()} -{" "}
                          {promotion.maximumRange||"unlimited"} {promotion.unit.toLowerCase()}
                        </Typography>
                      </>
                    )}
                    <hr />
                    <Typography variant="body2">
                      <b>Until</b> {promotion.endDate.split("T")[0]}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </Slider>
      )}
      <ProductForOrder />
    </div>
  );
};

export default Home;
