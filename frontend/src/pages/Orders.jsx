import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Star,
} from "lucide-react";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-purple-100 text-purple-800",
    "picked-up": "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: Clock,
    confirmed: CheckCircle,
    preparing: Package,
    ready: Package,
    "picked-up": Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${baseUrl}/orders?customer=${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const getStatusIcon = (status) => {
    const IconComponent = statusIcons[status] || Package;
    return <IconComponent className="h-5 w-5" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please sign in</h2>
          <p className="text-gray-500">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">My Orders</h1>
          <p className="text-xl text-gray-600">Track your orders and view order history</p>
        </div>

        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "confirmed",
              "preparing",
              "ready",
              "picked-up",
              "delivered",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg"
                }`}
              >
                {status === "all"
                  ? "All Orders"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {selectedStatus === "all"
                ? "You haven't placed any orders yet."
                : `No orders with status "${selectedStatus}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="glass-card rounded-2xl p-6 floating-card"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                {order.restaurant && (
                  <div className="mb-4 p-4 bg-white/50 rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">
                      {order.restaurant.name}
                    </h4>
                    {order.restaurant.address && (
                      <p className="text-gray-600 text-sm">
                        {order.restaurant.address.street},{" "}
                        {order.restaurant.address.city}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center">
                          <div className="text-lg opacity-50">🍽️</div>
                        </div>
                        <div>
                          <h5 className="font-medium">
                            {item.menuItem?.name || "Item"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Delivery Fee</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                    <h5 className="font-medium text-blue-800 mb-1">
                      Delivery Address
                    </h5>
                    <p className="text-blue-700 text-sm">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {order.status === "delivered" && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors duration-200">
                      <Star className="h-4 w-4" />
                      <span>Rate Order</span>
                    </button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                    Reorder
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                    Get Help
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;