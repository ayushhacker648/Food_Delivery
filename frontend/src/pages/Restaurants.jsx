import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { Search, Filter, Star, Clock, Truck, MapPin, ChefHat, Plus, Minus, ShoppingCart, Check } from 'lucide-react';

const Restaurants = () => {
  const [viewMode, setViewMode] = useState("all");
const [searchQuery, setSearchQuery] = useState("");
const [showFilters, setShowFilters] = useState(false);
const [selectedCuisine, setSelectedCuisine] = useState("");
const [sortBy, setSortBy] = useState("");
const [loading, setLoading] = useState(true);
const [restaurants, setRestaurants] = useState([]);
const [quantities, setQuantities] = useState({});
const [addedToCart, setAddedToCart] = useState({});
const [restaurantMenus, setRestaurantMenus] = useState({});
const { addToCart } = useCart(); 

  const cuisineTypes = [
    { name: 'Italian', emoji: '🍝', color: 'from-red-500 to-orange-500' },
    { name: 'Chinese', emoji: '🥢', color: 'from-yellow-500 to-red-500' },
    { name: 'Mexican', emoji: '🌮', color: 'from-green-500 to-yellow-500' },
    { name: 'Indian', emoji: '🍛', color: 'from-orange-500 to-red-500' },
    { name: 'Thai', emoji: '🍜', color: 'from-green-500 to-blue-500' },
    { name: 'American', emoji: '🍔', color: 'from-blue-500 to-purple-500' },
    { name: 'Japanese', emoji: '🍣', color: 'from-pink-500 to-purple-500' }
  ];

  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, selectedCuisine, sortBy]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (sortBy) params.append('sortBy', sortBy);

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
     const response = await axios.get(`${baseUrl}/restaurants?${params}`);

      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantMenu = async (restaurantId) => {
    if (restaurantMenus[restaurantId]) return; // Already fetched
    
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await axios.get(`${baseUrl}/restaurants/${restaurantId}/menu`);

      setRestaurantMenus(prev => ({
        ...prev,
        [restaurantId]: response.data.slice(0, 4) // Show only first 4 items
      }));
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const updateQuantity = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item._id] || 1;
    addToCart(item, quantity);
    setQuantities(prev => ({ ...prev, [item._id]: 0 }));
    
    // Show success feedback
    setAddedToCart(prev => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [item._id]: false }));
    }, 2000);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setSortBy('');
  };

  const groupRestaurantsByCuisine = () => {
    const grouped = {};
    cuisineTypes.forEach(cuisine => {
      grouped[cuisine.name] = restaurants.filter(restaurant => 
        restaurant.cuisine && restaurant.cuisine.includes(cuisine.name)
      );
    });
    return grouped;
  };

  const getCuisineInfo = (cuisineName) => {
    return cuisineTypes.find(c => c.name === cuisineName) || 
           { name: cuisineName, emoji: '🍽️', color: 'from-gray-500 to-gray-600' };
  };

  const RestaurantCard = ({ restaurant, showMenu = false }) => {
    const [menuVisible, setMenuVisible] = useState(true); // Always show menu
    const menu = restaurantMenus[restaurant._id] || [];

    // Auto-fetch menu when component mounts
    useEffect(() => {
      if (showMenu) {
        fetchRestaurantMenu(restaurant._id);
      }
    }, [restaurant._id, showMenu]);

    return (
      <div className="glass-card rounded-2xl overflow-hidden group">
        <Link to={`/restaurant/${restaurant._id}`}>
          <div className="relative h-48 bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
            <div className="text-6xl opacity-50">
              {restaurant.cuisine?.[0] === 'Italian' && '🍝'}
              {restaurant.cuisine?.[0] === 'Chinese' && '🥢'}
              {restaurant.cuisine?.[0] === 'Mexican' && '🌮'}
              {restaurant.cuisine?.[0] === 'Indian' && '🍛'}
              {restaurant.cuisine?.[0] === 'Thai' && '🍜'}
              {restaurant.cuisine?.[0] === 'Japanese' && '🍣'}
              {restaurant.cuisine?.[0] === 'American' && '🍔'}
              {!restaurant.cuisine?.[0] && '🍽️'}
            </div>
            
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold">
                {restaurant.rating?.toFixed(1) || '4.5'}
              </span>
            </div>

            {!restaurant.isOpen && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Closed</span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-6">
          <Link to={`/restaurant/${restaurant._id}`}>
            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors duration-300">
              {restaurant.name}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {restaurant.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {restaurant.deliveryTime?.min || 25}-{restaurant.deliveryTime?.max || 35} min
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>₹{restaurant.deliveryFee || 49}</span>
            </div>
          </div>

          {restaurant.address && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.address.city}, {restaurant.address.state}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisine?.slice(0, 3).map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>

          {showMenu && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">Menu Items</h4>
              
              {menu.length > 0 ? (
                <div className="space-y-3">
                  {menu.map((item) => (
                    <div key={item._id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.name}</h5>
                          <p className="text-xs text-gray-600 line-clamp-1 mb-1">{item.description}</p>
                          <span className="text-orange-600 font-semibold text-sm">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item._id, -1);
                            }}
                            className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-semibold text-sm min-w-[1.5rem] text-center">
                            {quantities[item._id] || 0}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item._id, 1);
                            }}
                            className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(item);
                          }}
                          disabled={!quantities[item._id]}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                            addedToCart[item._id]
                              ? 'bg-green-500 text-white'
                              : quantities[item._id]
                              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {addedToCart[item._id] ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Loading menu...</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
  <div className="pt-16 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Discover Restaurants
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find the perfect meal from our curated selection of restaurants in Chandigarh
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="glass-card rounded-2xl p-2 flex">
          <button
            onClick={() => setViewMode('all')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              viewMode === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            All Restaurants
          </button>
          <button
            onClick={() => setViewMode('cuisine')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              viewMode === 'cuisine'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            By Cuisine
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      {viewMode === 'all' && (
        <div className="mb-8">
          <div className="glass-card rounded-2xl p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              {(selectedCuisine || sortBy) && (
                <button
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map((cuisine) => (
                      <option key={cuisine.name} value={cuisine.name}>
                        {cuisine.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="">Default</option>
                    <option value="rating">Highest Rated</option>
                    <option value="deliveryTime">Fastest Delivery</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Restaurants Found */}
      {viewMode === 'all' && restaurants.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-primary">
            Clear Filters
          </button>
        </div>
      )}

      {/* Restaurant Cards */}
      {viewMode === 'all' && !loading && restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="floating-card">
              <RestaurantCard restaurant={restaurant} showMenu={true} />
            </div>
          ))}
        </div>
      )}

      {/* Cuisine View */}
      {viewMode === 'cuisine' && (
        <div className="space-y-12">
          {Object.entries(groupRestaurantsByCuisine()).map(([cuisineName, cuisineRestaurants]) => {
            if (cuisineRestaurants.length === 0) return null;
            const cuisineInfo = getCuisineInfo(cuisineName);

            return (
              <div key={cuisineName} className="space-y-6">
                <div className={`glass-card rounded-2xl p-8 bg-gradient-to-r ${cuisineInfo.color} text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">{cuisineInfo.emoji}</div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{cuisineName} Cuisine</h2>
                      <p className="text-white/90 text-lg">
                        {cuisineRestaurants.length} restaurant
                        {cuisineRestaurants.length !== 1 ? 's' : ''} available in Chandigarh
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cuisineRestaurants.map((restaurant) => (
                    <div key={restaurant._id} className="floating-card">
                      <RestaurantCard restaurant={restaurant} showMenu={true} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  </div>

)};

export default Restaurants;