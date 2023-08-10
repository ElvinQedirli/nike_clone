// Router
import { Link, useParams } from "react-router-dom";

//Axios
import axios from "axios";

//Context
import { useContext } from 'react'
import { Context } from '../utils/Context'

//ReactHooks
import { useEffect, useState } from "react";

//Location
import { useLocation } from "react-router-dom";

//Section
import TrendProduct from "../components/TrendProduct";

const Favorite = () => {
  //Add to Cart
  const { addToCart } = useContext(Context)

  const { productID } = useParams();

 const [products, setProducts] = useState([]);

useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/favorites`); 
        if (res.status === 200) {
          setProducts(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  //Router
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  return (
    <>
      <section className="favorite">
        <div className="container">
          <div className="row">
            <div className="top">
              <div className="left">
                <h4>Favoriler</h4>
              </div>
              <button className="favoriteBtn">Düzenle</button>
            </div>
            <div className="bottom">
              {products.map((product) => (
                <div className="card" key={product.id}>
                  <Link to={`/product-details/${product.id}`}>
                    <div className="cardImg">
                      <img
                        src={`http://localhost:5000/${product.productImage}`}
                        alt={product.name}
                      />
                    </div>
                    <div className="cardInfo">
                      <div className="productInfo">
                        <p className="productName">{product.name}</p>
                        <span className="price">₺ {product.price}</span>
                      </div>
                      <p className="ProductType">{product.type}</p>
                    </div>
                  </Link>
                  <div className="cardBtn">
                    <Link
                      to="/cart"
                      className="favoriteBtn"
                      onClick={() => addToCart(product)}
                    >
                      Sepete Ekle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <TrendProduct />
    </>
  );
};

export default Favorite;
