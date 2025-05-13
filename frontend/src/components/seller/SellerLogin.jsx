import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsSeller(true);
  };
  return (
    !isSeller && (
      <form
        onSubmit={handleOnSubmit}
        className="min-h-screen flex items-center text-sm text-gray-600"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">seller</span>Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              className="border boder-gray-200  rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <div className="w-full">
            <p>PassWord</p>
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              type="password"
              placeholder="password"
              className="border boder-gray-200  rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <button
            className="bg-primary text-white w-full py-2 cursor-pointer
            rounded-md"
          >
            Login
          </button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;
