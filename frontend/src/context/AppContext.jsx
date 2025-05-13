import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

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
      if(cartData[itemId]===0){
        delete cartData[itemId]
      }
    } 
    toast.success("Removed From Cart")
    setCartItem(cartData)
  };

  const GetCArtCount =()=>{
    let totalcount = 0;
    for(const item in cartItem){
      totalcount+=cartItem[item]
    }
return totalcount
  }

  const GetCartAmoutnt = () => {
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
    setProducts(dummyProducts);
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  const value = {
    user,
    setUser,
    GetCArtCount,
    isSeller,
    GetCartAmoutnt,
    setIsSeller,
    navigate,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    searchQuery,
    setSearchQuery,
    cartItem,
    updateCartItem,
     
    removeFromCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
