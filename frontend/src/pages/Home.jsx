import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Star, Clock, Truck, ArrowRight, ChefHat } from "lucide-react";

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(
          `${baseUrl}/restaurants?sortBy=rating`
        );
        setFeaturedRestaurants(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  const cuisineTypes = [
    { name: "Italian", emoji: "🍝", color: "from-red-500 to-orange-500" },
    { name: "Chinese", emoji: "🥢", color: "from-yellow-500 to-red-500" },
    { name: "Mexican", emoji: "🌮", color: "from-green-500 to-yellow-500" },
    { name: "Indian", emoji: "🍛", color: "from-orange-500 to-red-500" },
    { name: "Thai", emoji: "🍜", color: "from-green-500 to-blue-500" },
    { name: "American", emoji: "🍔", color: "from-blue-500 to-purple-500" },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-amber-500/10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-shadow">
                <span className="gradient-text">Delicious Food</span>
                <br />
                <span className="text-gray-800">Delivered Fast</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the finest local restaurants and cuisines, delivered
                fresh to your doorstep in minutes.
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 text-lg"
                />
                <Link
                  to={`/restaurants${
                    searchQuery ? `?search=${searchQuery}` : ""
                  }`}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                >
                  <button className="btn-primary">Search</button>
                </Link>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/restaurants" className="btn-primary text-lg px-8 py-4">
                Explore Restaurants
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                <ChefHat className="mr-2 h-5 w-5" />
                Join as Partner
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Food Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {["🍕", "🍔", "🍜", "🍣", "🌮", "🍰"][i]}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cuisine Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Explore Cuisines
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover flavors from around the world, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cuisineTypes.map((cuisine, index) => (
              <motion.div
                key={cuisine.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="floating-card"
              >
                <Link
                  to={`/restaurants?cuisine=${cuisine.name}`}
                  className={`block p-6 glass-card rounded-2xl text-center group hover:bg-gradient-to-br ${cuisine.color} hover:text-white transition-all duration-300`}
                >
                  <div className="text-4xl mb-3">{cuisine.emoji}</div>
                  <h3 className="font-semibold text-lg group-hover:text-white transition-colors duration-300">
                    {cuisine.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Featured Restaurants
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top-rated restaurants in your area, handpicked for quality and
              taste
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card rounded-2xl p-6 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="floating-card"
                >
                  <Link to={`/restaurant/${restaurant._id}`}>
                    <div className="glass-card rounded-2xl overflow-hidden group">
                      <div className="relative h-48 bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
                        <div className="text-6xl opacity-50">
                          {restaurant.cuisine?.[0] === "Italian" && "🍝"}
                          {restaurant.cuisine?.[0] === "Chinese" && "🥢"}
                          {restaurant.cuisine?.[0] === "Mexican" && "🌮"}
                          {restaurant.cuisine?.[0] === "Indian" && "🍛"}
                          {restaurant.cuisine?.[0] === "Thai" && "🍜"}
                          {!restaurant.cuisine?.[0] && "🍽️"}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold">
                            {restaurant.rating?.toFixed(1) || "4.5"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {restaurant.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {restaurant.deliveryTime?.min || 25}-
                              {restaurant.deliveryTime?.max || 35} min
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4" />
                            <span>₹{restaurant.deliveryFee || 49}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {restaurant.cuisine?.slice(0, 2).map((type) => (
                            <span
                              key={type}
                              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/restaurants"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              View All Restaurants
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Why Choose Foodie?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering the best food experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Fast Delivery",
                description:
                  "Get your favorite food delivered in 30 minutes or less",
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: "🍯",
                title: "Fresh & Quality",
                description:
                  "We partner with the best restaurants to ensure top quality",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: "💝",
                title: "Best Deals",
                description:
                  "Enjoy exclusive discounts and offers on your favorite meals",
                color: "from-pink-500 to-red-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="floating-card"
              >
                <div className="glass-card rounded-2xl p-8 text-center group hover:bg-gradient-to-br hover:from-orange-500 hover:to-amber-500 hover:text-white transition-all duration-300">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
