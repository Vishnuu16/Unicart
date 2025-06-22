import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import axios from "axios";

export const AppContext = createContext();

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_BACKENDURL;

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      console.log({ data });

      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItem(cartData);
    toast.success("Added To Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId] = quantity;
    setCartItem(cartData);
    toast.success("Cart Updated");
  };
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed From Cart");
    setCartItem(cartData);
  };

  const GetCArtCount = () => {
    let totalcount = 0;
    for (const item in cartItem) {
      totalcount += cartItem[item];
    }
    return totalcount;
  };

  const GetCartAmount = () => {
    let totalamount = 0;
    for (const itemId in cartItem) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItem[itemId] > 0) {
        totalamount += itemInfo.offerPrice * cartItem[itemId];
      }
    }
    return Math.floor(totalamount * 100) / 100;
  };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItem(data.user.cartItem);
      }
    } catch (error) {
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser();
    fetchProduct();
    fetchSeller();
  }, []);
  // update database cart item
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          userId: user?._id,
          cartItem: cartItem,
        });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItem]);

  const value = {
    user,
    setUser,
    GetCArtCount,
    isSeller,
    GetCartAmount,
    setIsSeller,
    navigate,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    axios,
    searchQuery,
    setCartItem,
    setSearchQuery,
    cartItem,
    updateCartItem,
    fetchProduct,
    removeFromCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
