import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import {
  Star,
  Clock,
  Truck,
  MapPin,
  Plus,
  Minus,
  ShoppingCart,
  Check,
} from "lucide-react";

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  const categories = ["all", "appetizer", "main", "dessert", "beverage", "special"];

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const [restaurantRes, menuRes] = await Promise.all([
        axios.get(`${baseUrl}/restaurants/${id}`),
        axios.get(`${baseUrl}/restaurants/${id}/menu`),
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const updateQuantity = (itemId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart(item, quantity);
    setQuantities((prev) => ({ ...prev, [item._id]: 0 }));
    setAddedToCart((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [item._id]: false }));
    }, 2000);
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      appetizer: "🥗",
      main: "🍽️",
      dessert: "🍰",
      beverage: "🥤",
      special: "⭐",
    };
    return emojis[category] || "🍴";
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-8 w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Restaurant not found</h2>
          <Link to="/restaurants" className="btn-primary">
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                {restaurant.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{restaurant.description}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-100 p-2 rounded-xl">
                    <Star className="h-5 w-5 text-yellow-600 fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold">{restaurant.rating?.toFixed(1) || "4.5"} Rating</div>
                    <div className="text-sm text-gray-500">{restaurant.reviewCount || 150}+ reviews</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-xl">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{restaurant.deliveryTime?.min || 25}-{restaurant.deliveryTime?.max || 35} min</div>
                    <div className="text-sm text-gray-500">Delivery time</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 p-2 rounded-xl">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">₹{restaurant.deliveryFee || 49}</div>
                    <div className="text-sm text-gray-500">Delivery fee</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.cuisine?.map((type) => (
                  <span key={type} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-medium">
                    {type}
                  </span>
                ))}
              </div>

              {restaurant.address && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}</span>
                </div>
              )}
            </div>

            <div className="lg:ml-8 mt-6 lg:mt-0">
              <div className="w-64 h-64 bg-gradient-to-br from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center">
                <div className="text-8xl opacity-50">
                  {restaurant.cuisine?.[0] === "Italian" && "🍝"}
                  {restaurant.cuisine?.[0] === "Chinese" && "🥢"}
                  {restaurant.cuisine?.[0] === "Mexican" && "🌮"}
                  {restaurant.cuisine?.[0] === "Indian" && "🍛"}
                  {restaurant.cuisine?.[0] === "Thai" && "🍜"}
                  {restaurant.cuisine?.[0] === "Japanese" && "🍣"}
                  {restaurant.cuisine?.[0] === "American" && "🍔"}
                  {!restaurant.cuisine?.[0] && "🍽️"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-lg"
                }`}
              >
                {category === "all" ? "All Items" : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-12">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">{getCategoryEmoji(category)}</div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => (
                  <div key={item._id} className="glass-card rounded-2xl p-6 floating-card group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">{item.description}</p>

                        {item.ingredients?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.ingredients.slice(0, 3).map((ing) => (
                              <span key={ing} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{ing}</span>
                            ))}
                            {item.ingredients.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{item.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {item.dietary?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.dietary.map((diet) => (
                              <span key={diet} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{diet}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-2 mb-3">
                          <div className="text-2xl font-bold text-orange-600">₹{item.price}</div>
                          {item.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">
                                {item.rating.toFixed(1)} ({item.reviewCount})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center ml-4">
                        <div className="text-3xl opacity-50">{getCategoryEmoji(item.category)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-lg min-w-[2rem] text-center">
                          {quantities[item._id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!quantities[item._id]}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          addedToCart[item._id]
                            ? "bg-green-500 text-white"
                            : quantities[item._id]
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg transform hover:-translate-y-1"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {addedToCart[item._id] ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No menu items available</h3>
            <p className="text-gray-500">This restaurant hasn't added their menu yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
