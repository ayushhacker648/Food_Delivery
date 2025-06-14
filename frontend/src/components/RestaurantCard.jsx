import React from 'react';
import { Clock, Truck, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// ⚠️ Sample restaurant data
const sampleRestaurants = [
  {
    _id: "1",
    name: "Spaghetti House",
    description: "Classic Italian with a modern twist.",
    cuisine: ["Italian"],
    rating: 4.4,
    deliveryTime: { min: 30, max: 40 },
    deliveryFee: 3.2,
    isOpen: true,
    address: { city: "Rome", state: "Italy" }
  },
  {
    _id: "2",
    name: "Dragon Wok",
    description: "Authentic Chinese food with bold flavors.",
    cuisine: ["Chinese"],
    rating: 4.1,
    deliveryTime: { min: 20, max: 30 },
    deliveryFee: 2.5,
    isOpen: true,
    address: { city: "Beijing", state: "China" }
  },
  {
    _id: "3",
    name: "Mumbai Masala",
    description: "Tandoori magic and curry delights.",
    cuisine: ["Indian"],
    rating: 4.8,
    deliveryTime: { min: 25, max: 40 },
    deliveryFee: 2.1,
    isOpen: true,
    address: { city: "West Ravi", state: "Maharashtra" }
  },
];

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`}>
      <div className="glass-card rounded-2xl overflow-hidden group">
        <div className="relative h-48 bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center">
          <div className="text-6xl opacity-50">
            {restaurant.cuisine?.[0] === 'Italian' && '🍝'}
            {restaurant.cuisine?.[0] === 'Chinese' && '🥢'}
            {restaurant.cuisine?.[0] === 'Mexican' && '🌮'}
            {restaurant.cuisine?.[0] === 'Indian' && '🍛'}
            {restaurant.cuisine?.[0] === 'Thai' && '🍜'}
            {!restaurant.cuisine?.[0] && '🍽️'}
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-semibold">{restaurant.rating?.toFixed(1) || '4.5'}</span>
          </div>
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Closed</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors duration-300">{restaurant.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime?.min || 25}-{restaurant.deliveryTime?.max || 35} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>${restaurant.deliveryFee?.toFixed(2) || '2.99'}</span>
            </div>
          </div>
          {restaurant.address && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.address.city}, {restaurant.address.state}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {restaurant.cuisine?.slice(0, 3).map((type) => (
              <span key={type} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{type}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

// ✅ For testing: Render all sample cards here directly
const RestaurantCardList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sampleRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default RestaurantCardList;

