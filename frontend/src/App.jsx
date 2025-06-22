import React from 'react'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProducts from './pages/seller/AddProducts'
import ProductList from './pages/seller/ProductList'
import Order from './pages/seller/Order'
import Loading from './components/Loading'
import Contact from './pages/Contact'

const App = () => {
  console.log("VITE_BACKENDURL:", import.meta.env.VITE_BACKENDURL);

  const isSellerPath =useLocation().pathname.includes('seller')
  const {showUserLogin,isSeller} = useAppContext()
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerPath ?"": <NavBar/> }
      {showUserLogin ? <Login/> :null}
      <div className={`${isSellerPath ? "" :"px-6  md:px-16  lg:px-24  xl:px-32"} `}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/products' element={<AllProducts/>}/>
          <Route path='/products/:category' element={<ProductCategory/>}/>
          <Route path='/products/:category/:id' element={<ProductDetails/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/add-address' element={<AddAddress/>}/>
          <Route path='/my-orders' element={<MyOrders/>}/>
          <Route path='/loader' element={<Loading/>}/>
          <Route path='/contact' element={<Contact/>}/>
          
          <Route path='/seller' element={isSeller ? <SellerLayout/> :<SellerLogin/>}>
            <Route index element={isSeller ? <AddProducts/> : null}/>
            <Route path='product-list' element={<ProductList/>}/>
            <Route path='orders' element={<Order/>}/>
          </Route>

        </Routes>
      </div>
    {!isSellerPath && <Footer/>}
      <Toaster/>
     
      
       
    </div>
  )
}

export default App