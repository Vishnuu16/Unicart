import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Inputfield = ({ type, placeholder, name, handlechange, address }) => (
  <input
    type={type}
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-nonetext-gray-500 focus:border-primary transition"
    placeholder={placeholder}
    name={name}
    onChange={handlechange}
    value={address[name]}
    required
  />
);
const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });
  const handlechange = (e) => {
    const { name, value } = e.target;

    setAddress((preaddress) => ({
      ...preaddress,
      [name]: value,
    }));
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", {address,userId:user._id });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reversemd:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleOnSubmit} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="firstname"
                type="text"
                placeholder="FirstName"
              />
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="lastname"
                type="text"
                placeholder="LastName"
              />
            </div>
            <Inputfield
              handlechange={handlechange}
              address={address}
              name="email"
              type="email"
              placeholder="Email"
            />
            <Inputfield
              handlechange={handlechange}
              address={address}
              name="street"
              type="text"
              placeholder="Street"
            />
            <div className="grid grid-cols-2 gap-4">
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="city"
                type="text"
                placeholder="City"
              />
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="zipcode"
                type="number"
                placeholder="ZipCode"
              />
              <Inputfield
                handlechange={handlechange}
                address={address}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <Inputfield
              handlechange={handlechange}
              address={address}
              name="phone"
              type="number"
              placeholder="Phone"
            />
            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
              Save Address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="addnaddress"
        />
      </div>
    </div>
  );
};

export default AddAddress;
