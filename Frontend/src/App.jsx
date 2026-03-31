import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentButton from "./paymentbutton";

const App = () => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/product/get-item")
      .then((response) => {
        setProduct(response.data.product);
        console.log(response.data.product);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, []);

  return (
    <div>
      <h1>Product Details</h1>

      {product ? (
        <div>
          <img src={product.image} alt={product.title} width="200" />
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>
            Price: {product.price?.amount} {product.price?.currency}
          </p>
          <p>Category: {product.category}</p>
          <PaymentButton/>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
