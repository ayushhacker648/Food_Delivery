// // backend/seedRestaurants.js
// const mongoose = require('mongoose');
// const Restaurant = require('./Restaurant');
//  // adjust path if needed

// const MONGO_URI = 'mongodb://127.0.0.1:27017/your-db-name'; // <-- change this!

// mongoose.connect(MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.error(err));

// const restaurants = [
//   {
//     name: "Pasta Bella",
//     description: "Delicious handmade pasta in traditional Italian style.",
//     cuisine: ["Italian"],
//     rating: 4.6,
//     deliveryTime: { min: 30, max: 45 },
//     deliveryFee: 2.99,
//     isOpen: true,
//     address: { city: "Rome", state: "Lazio" }
//   },
//   {
//     name: "Dragon Express",
//     description: "Fast and flavorful Chinese takeout.",
//     cuisine: ["Chinese"],
//     rating: 4.2,
//     deliveryTime: { min: 20, max: 35 },
//     deliveryFee: 1.99,
//     isOpen: true,
//     address: { city: "Shanghai", state: "China" }
//   },
//   {
//     name: "Taco Amigos",
//     description: "Fresh and spicy Mexican street food.",
//     cuisine: ["Mexican"],
//     rating: 4.7,
//     deliveryTime: { min: 25, max: 35 },
//     deliveryFee: 2.49,
//     isOpen: true,
//     address: { city: "Mexico City", state: "CDMX" }
//   },
//   {
//     name: "Curry Kingdom",
//     description: "Authentic Indian curries and biryanis.",
//     cuisine: ["Indian"],
//     rating: 4.8,
//     deliveryTime: { min: 30, max: 40 },
//     deliveryFee: 2.00,
//     isOpen: true,
//     address: { city: "Delhi", state: "India" }
//   },
//   {
//     name: "Bangkok Bowl",
//     description: "Savor the taste of Thailand in every bite.",
//     cuisine: ["Thai"],
//     rating: 4.5,
//     deliveryTime: { min: 20, max: 30 },
//     deliveryFee: 2.25,
//     isOpen: true,
//     address: { city: "Bangkok", state: "Thailand" }
//   }
// ];

// async function seedDB() {
//   try {
//     await Restaurant.deleteMany();
//     await Restaurant.insertMany(restaurants);
//     console.log('✅ Sample restaurants inserted!');
//     process.exit();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }

// seedDB();
