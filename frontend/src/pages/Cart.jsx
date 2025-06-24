import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import axios from "axios";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const deliveryFee = 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const paymentData = {
        amount: total,
        currency: "INR",
        paymentMethod: "card",
        customerInfo: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        orderData: {
          items: cartItems.map((item) => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
          subtotal,
          deliveryFee,
          tax,
          total,
          itemCount: cartItems.length,
        },
      };

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseUrl}/payment/process`, paymentData);

      if (response.data.success) {
        alert(`Payment successful! Transaction ID: ${response.data.payment.transactionId}`);
        clearCart();
        navigate("/orders");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-xl text-gray-500 mb-8">
            Add some delicious items to get started!
          </p>
          <Link
            to="/restaurants"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Your Cart
          </h1>
          <p className="text-xl text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 p-4 bg-white/70 rounded-xl border border-white/20"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center">
                      <div className="text-2xl opacity-50">🍽️</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="text-orange-600 font-bold">₹{item.price} each</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 hover:text-red-700 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>

                <Link
                  to="/restaurants"
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">
                    Free delivery on orders over ₹500
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Details</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <div>• Secure payment processing</div>
                  <div>• Multiple payment options</div>
                  <div>• Instant order confirmation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;