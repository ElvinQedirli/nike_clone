import { createContext, useState } from "react";
import { useEffect } from "react";

/* ------------------------------- SweetAlert ------------------------------- */
import Swal from "sweetalert2";
/* ------------------------------- SweetAlert ------------------------------- */

export const Context = createContext();

export const MainContext = ({ children }) => {
  // const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartSum, setCartSum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((product) => product.id !== productId));
  };

  useEffect(() => {
    //Calc Quantity
    const calcQuantity = () => {
      const totalQuantity = cart.reduce((acc, curr) => acc + curr.quantity, 0);
      if (totalQuantity > 9) {
        setCartSum("9+");
      } else {
        setCartSum(totalQuantity);
      }
    };
    calcQuantity();

    // Calculate Total Price
    const sumPrice = () => {
      if (cart.length === 0) {
        setTotalPrice(0);
        return;
      }
      let productPrices = cart.map(
        (item) => item.quantity * parseFloat(item.price)
      );
      let sum = productPrices.reduce((acc, curr) => acc + curr, 0);
      setTotalPrice(sum);
    };
    sumPrice();
  }, [cart]);

  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart"));
    if (localCart !== null) {
      setCart(localCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  //Add To Cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity < 10) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        Swal.fire(
          "Hata",
          "Üzgünüz, maksimum miktara ulaştın. Lütfen bir ürünü kaldır ve tekrar dene."
        );
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  //Remove Cart from Cart
  const removeFromCart = (id) => {
    Swal.fire({
      title: "Ürünü kaldırmak istediğinizden emin misiniz??",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Sil",
      denyButtonText: `Silme`,
      cancelButtonText: "Vazgeç",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        Swal.fire("Silindi!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Silinemedi", "", "warning");
      }
    });
  };

  //Change Quantity
  const changeQuantity = (product, number) => {
    if (product) {
      const updatedCart = cart.map((item) => {
        if (item.id === product.id) {
          return { ...item, quantity: number };
        } else {
          return item;
        }
      });
      setCart(updatedCart);
    }
  };

  // Calculate Total Price
  const sumPrice = () => {
    if (cart.length === 0) {
      setTotalPrice(0);
      return;
    }
    let productPrices = cart.map(
      (item) => item.quantity * parseFloat(item.price)
    );
    let sum = productPrices.reduce((acc, curr) => acc + curr, 0);
    setTotalPrice(sum);
  };

  const globalStates = {
    //States
    cart,
    cartSum,
    setCartSum,
    totalPrice,
    setTotalPrice,
    sumPrice,
    favorites,       
    addToFavorites,        
    removeFromFavorites, 
    //Functions
    addToCart,
    removeFromCart,
    changeQuantity,
  };

  return <Context.Provider value={globalStates}>{children}</Context.Provider>;
};
