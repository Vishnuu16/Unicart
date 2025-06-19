import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    currency,
    cartItem,
    setCartItem,
    updateCartItem,
    GetCartAmount,
    navigate,
    removeFromCart,
    GetCArtCount,
    axios,
    user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [showAddress, setShowAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const prepareCart = () => {
    const temp = [];
    for (const key in cartItem) {
      const product = products.find((item) => item._id === key);
      if (product) {
        product.quantity = cartItem[key];
        temp.push(product);
      }
    }
    setCartArray(temp);
  };

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/address/get?userId=${user._id}`);
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && cartItem) prepareCart();
  }, [products, cartItem]);

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  const verifyPayment = async (paymentData, orderDbId) => {
    try {
      const response = await axios.post("/api/order/verify", {
        ...paymentData,
        orderDbId, // ✅ Send only the MongoDB order ID
      });

      if (response.data.success) {
        toast.success("Payment Verified Successfully");
        setCartItem({});
        navigate("/my-orders");
      } else {
        toast.error("Payment Verification Failed");
      }
    } catch (error) {
      toast.error("Error verifying payment");
      console.error("Verification Error:", error);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      return toast.error("Please select an address.");
    }

    const orderData = {
      userId: user._id,
      items: cartArray.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      address: selectedAddress._id,
    };

    try {
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", orderData);
        if (data.success) {
          toast.success(data.message);
          setCartItem({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        try {
          const { data } = await axios.post("/api/order/razorpay", orderData);
          console.log("Razorpay Order Response:", data);

          if (data.success && data.orderId && data.razorpayKey) {
            const options = {
              key: data.razorpayKey,
              amount: data.amount,
              currency: data.currency,
              name: "UniCart",
              description: "Order Payment",
              order_id: data.orderId,
              handler: function (response) {
                console.log("Payment Success:", response);
                verifyPayment(response, data.orderDbId);
              },
              prefill: {
                name: user?.name || "Customer",
                email: user?.email || "customer@example.com",
                contact: user?.phone || "9999999999",
              },
              theme: {
                color: "#3399cc",
              },
            };
           
            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", function (response) {
              toast.error("Payment failed");
              console.error("Payment Failed", response.error);
            });
          } else {
            toast.error(data.message || "Failed to create Razorpay order");
          }
        } catch (error) {
          console.error("Razorpay Error", error);
          toast.error("Something went wrong with Razorpay");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!products.length || !cartItem) return null;

  const cartAmount = GetCartAmount();
  const tax = (cartAmount * 2) / 100;
  const total = cartAmount + tax;

  return (
    <div className="flex flex-col md:flex-row mt-16">
      {/* Cart Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{GetCArtCount()}</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-sm md:text-base items-center text-gray-600 py-3 border-t"
          >
            <div className="flex gap-4 items-center">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-24 h-24 object-cover border rounded cursor-pointer"
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">
                  Weight: {product.weight || "N/A"}
                </p>
                <div className="flex items-center mt-1">
                  <p>Qty:</p>
                  <select
                    className="ml-2 outline-none"
                    value={cartItem[product._id]}
                    onChange={(e) =>
                      updateCartItem(product._id, Number(e.target.value))
                    }
                  >
                    {Array.from(
                      { length: Math.max(9, cartItem[product._id]) },
                      (_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="mx-auto"
            >
              <img src={assets.remove_icon} alt="remove" className="w-6 h-6" />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group flex items-center gap-2 mt-6 text-primary"
        >
          <img
            src={assets.arrow_right_icon_colored}
            className="group-hover:-translate-x-1 transition"
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100 p-5 mt-12 md:mt-0 border border-gray-300 rounded">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative mt-2">
            <p className="text-gray-600">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="absolute top-0 right-0 text-primary text-sm hover:underline"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute z-10 top-10 left-0 bg-white border w-full text-sm shadow-md">
                {addresses.map((addr, idx) => (
                  <p
                    key={idx}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddress(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addr.street}, {addr.city}, {addr.state}, {addr.country}
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="p-2 text-center text-primary cursor-pointer hover:bg-gray-100"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            className="w-full mt-2 border px-3 py-2 outline-none bg-white"
            onChange={(e) => setPaymentOption(e.target.value)}
            value={paymentOption}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr />

        <div className="text-gray-600 mt-4 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {cartAmount.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between font-medium text-base mt-3">
            <span>Total</span>
            <span>
              {currency}
              {total.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full mt-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dull transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
