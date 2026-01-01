import React from 'react'
import { useContext } from 'react'
import { backendUrl, ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Verify = () => {
    const {navigate, setCartItems, loggedin} = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get("success")
    const orderId = searchParams.get("order_id")


    const verifyPayment = async() => {
        try {
            if (!loggedin) {
                return null
            }

            const response = await axios.post(backendUrl + "/order/verifystripepayment", {orderId, success})
            if (response.data.success) {
                setCartItems({})
                navigate("/orders")
                toast.success(response.data.msg)
            } else {
                navigate('/cart')
                toast.error(response.data.msg)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        verifyPayment();
    },[loggedin])



  return (
    <div>
      
    </div>
  )
}

export default Verify
