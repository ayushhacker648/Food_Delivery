const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  seedDatabase();
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

const sampleData = {
  users: [
    {
      name: 'Mario Rossi',
      email: 'mario@italianfood.com',
      password: 'password123',
      phone: '+91-98765-43210',
      role: 'restaurant'
    },
    {
      name: 'Chen Wei',
      email: 'chen@chinesedelight.com',
      password: 'password123',
      phone: '+91-98765-43211',
      role: 'restaurant'
    },
    {
      name: 'Carlos Rodriguez',
      email: 'carlos@mexicanfiesta.com',
      password: 'password123',
      phone: '+91-98765-43212',
      role: 'restaurant'
    },
    {
      name: 'Priya Sharma',
      email: 'priya@spicepalace.com',
      password: 'password123',
      phone: '+91-98765-43213',
      role: 'restaurant'
    },
    {
      name: 'Somchai Tanaka',
      email: 'somchai@thaigarden.com',
      password: 'password123',
      phone: '+91-98765-43214',
      role: 'restaurant'
    },
    {
      name: 'John Smith',
      email: 'john@americangrill.com',
      password: 'password123',
      phone: '+91-98765-43215',
      role: 'restaurant'
    }
  ],
  restaurants: [
    {
      name: 'Bella Italia',
      description: 'Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and traditional recipes passed down through generations.',
      cuisine: ['Italian'],
      address: {
        street: 'Sector 17, Plaza',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160017',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2701234',
        email: 'info@bellaitalia.com'
      },
      rating: 4.8,
      reviewCount: 245,
      deliveryTime: { min: 25, max: 35 },
      deliveryFee: 49,
      minimumOrder: 250,
      isOpen: true,
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '21:00' }
      }
    },
    {
      name: 'Golden Dragon',
      description: 'Traditional Chinese restaurant serving authentic Szechuan and Cantonese dishes with the finest ingredients.',
      cuisine: ['Chinese'],
      address: {
        street: 'Sector 22, Market',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160022',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2702345',
        email: 'info@goldendragon.com'
      },
      rating: 4.6,
      reviewCount: 189,
      deliveryTime: { min: 30, max: 45 },
      deliveryFee: 59,
      minimumOrder: 300,
      isOpen: true
    },
    {
      name: 'Casa Mexico',
      description: 'Vibrant Mexican restaurant offering fresh tacos, burritos, and traditional dishes with authentic flavors.',
      cuisine: ['Mexican'],
      address: {
        street: 'Sector 35, Main Market',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160035',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2703456',
        email: 'hola@casamexico.com'
      },
      rating: 4.7,
      reviewCount: 156,
      deliveryTime: { min: 20, max: 30 },
      deliveryFee: 39,
      minimumOrder: 200,
      isOpen: true
    },
    {
      name: 'Spice Palace',
      description: 'Exquisite Indian cuisine featuring aromatic curries, tandoor specialties, and traditional biryanis.',
      cuisine: ['Indian'],
      address: {
        street: 'Sector 8, City Centre',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160008',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2704567',
        email: 'namaste@spicepalace.com'
      },
      rating: 4.9,
      reviewCount: 298,
      deliveryTime: { min: 35, max: 50 },
      deliveryFee: 69,
      minimumOrder: 350,
      isOpen: true
    },
    {
      name: 'Thai Garden',
      description: 'Fresh and flavorful Thai cuisine with authentic pad thai, green curry, and traditional soups.',
      cuisine: ['Thai'],
      address: {
        street: 'Sector 26, Shopping Complex',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160026',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2705678',
        email: 'hello@thaigarden.com'
      },
      rating: 4.5,
      reviewCount: 167,
      deliveryTime: { min: 25, max: 40 },
      deliveryFee: 49,
      minimumOrder: 250,
      isOpen: true
    },
    {
      name: 'American Grill House',
      description: 'Classic American comfort food with juicy burgers, crispy fries, and hearty steaks.',
      cuisine: ['American'],
      address: {
        street: 'Sector 17, Central Plaza',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160017',
        coordinates: { lat: 30.7333, lng: 76.7794 }
      },
      contact: {
        phone: '+91-172-2706789',
        email: 'info@americangrill.com'
      },
      rating: 4.4,
      reviewCount: 203,
      deliveryTime: { min: 20, max: 35 },
      deliveryFee: 39,
      minimumOrder: 180,
      isOpen: true
    }
  ],
  menuItems: [
    // Italian Restaurant Menu
    {
      name: 'Margherita Pizza',
      description: 'Classic wood-fired pizza with fresh mozzarella, basil, and San Marzano tomatoes',
      price: 350,
      category: 'main',
      ingredients: ['Mozzarella', 'Basil', 'Tomatoes', 'Olive Oil'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.8,
      reviewCount: 45
    },
    {
      name: 'Spaghetti Carbonara',
      description: 'Traditional Roman pasta with eggs, pecorino cheese, pancetta, and black pepper',
      price: 420,
      category: 'main',
      ingredients: ['Spaghetti', 'Eggs', 'Pecorino', 'Pancetta'],
      isAvailable: true,
      rating: 4.9,
      reviewCount: 38
    },
    {
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with parmesan, croutons, and our signature Caesar dressing',
      price: 250,
      category: 'appetizer',
      ingredients: ['Romaine', 'Parmesan', 'Croutons', 'Caesar Dressing'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 29
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
      price: 220,
      category: 'dessert',
      ingredients: ['Mascarpone', 'Coffee', 'Ladyfingers', 'Cocoa'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 52
    },
    // Chinese Restaurant Menu
    {
      name: 'Kung Pao Chicken',
      description: 'Spicy Szechuan dish with chicken, peanuts, vegetables, and chili peppers',
      price: 320,
      category: 'main',
      ingredients: ['Chicken', 'Peanuts', 'Bell Peppers', 'Chili'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 34
    },
    {
      name: 'Sweet and Sour Pork',
      description: 'Crispy pork with pineapple, bell peppers in tangy sweet and sour sauce',
      price: 380,
      category: 'main',
      ingredients: ['Pork', 'Pineapple', 'Bell Peppers', 'Sweet & Sour Sauce'],
      isAvailable: true,
      rating: 4.5,
      reviewCount: 28
    },
    {
      name: 'Spring Rolls',
      description: 'Crispy vegetable spring rolls served with sweet chili dipping sauce',
      price: 180,
      category: 'appetizer',
      ingredients: ['Cabbage', 'Carrots', 'Bean Sprouts', 'Wrapper'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.4,
      reviewCount: 41
    },
    {
      name: 'Fried Rice',
      description: 'Wok-fried rice with eggs, vegetables, and your choice of protein',
      price: 280,
      category: 'main',
      ingredients: ['Rice', 'Eggs', 'Mixed Vegetables', 'Soy Sauce'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 33
    },
    // Mexican Restaurant Menu
    {
      name: 'Chicken Tacos',
      description: 'Three soft tacos with grilled chicken, onions, cilantro, and lime',
      price: 300,
      category: 'main',
      ingredients: ['Chicken', 'Tortillas', 'Onions', 'Cilantro', 'Lime'],
      isAvailable: true,
      rating: 4.8,
      reviewCount: 67
    },
    {
      name: 'Beef Burrito',
      description: 'Large flour tortilla filled with seasoned beef, rice, beans, and cheese',
      price: 340,
      category: 'main',
      ingredients: ['Rice', 'Beans', 'Cheese', 'Tortilla'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 45
    },
    {
      name: 'Guacamole & Chips',
      description: 'Fresh avocado dip with lime, cilantro, and jalapeños served with tortilla chips',
      price: 200,
      category: 'appetizer',
      ingredients: ['Avocado', 'Lime', 'Cilantro', 'Jalapeños', 'Chips'],
      dietary: ['vegetarian', 'vegan'],
      isAvailable: true,
      rating: 4.9,
      reviewCount: 78
    },
    {
      name: 'Churros',
      description: 'Crispy fried dough sticks rolled in cinnamon sugar, served with chocolate sauce',
      price: 160,
      category: 'dessert',
      ingredients: ['Flour', 'Cinnamon', 'Sugar', 'Chocolate'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 34
    },
    // Indian Restaurant Menu
    {
      name: 'Chicken Tikka Masala',
      description: 'Tender chicken in creamy tomato-based curry sauce with aromatic spices',
      price: 380,
      category: 'main',
      ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Spices'],
      isAvailable: true,
      rating: 4.9,
      reviewCount: 89
    },
    {
      name: 'Vegetable Biryani',
      description: 'Fragrant basmati rice with mixed vegetables, saffron, and traditional spices',
      price: 320,
      category: 'main',
      ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 56
    },
    {
      name: 'Samosas',
      description: 'Crispy pastries filled with spiced potatoes and peas, served with chutney',
      price: 140,
      category: 'appetizer',
      ingredients: ['Potatoes', 'Peas', 'Pastry', 'Spices'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.8,
      reviewCount: 43
    },
    {
      name: 'Mango Lassi',
      description: 'Refreshing yogurt drink blended with sweet mango and cardamom',
      price: 90,
      category: 'beverage',
      ingredients: ['Yogurt', 'Mango', 'Cardamom', 'Sugar'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 29
    },
    // Thai Restaurant Menu
    {
      name: 'Pad Thai',
      description: 'Stir-fried rice noodles with shrimp, tofu, bean sprouts, and tamarind sauce',
      price: 320,
      category: 'main',
      ingredients: ['Rice Noodles', 'Shrimp', 'Tofu', 'Bean Sprouts', 'Tamarind'],
      isAvailable: true,
      rating: 4.8,
      reviewCount: 72
    },
    {
      name: 'Green Curry',
      description: 'Spicy coconut curry with chicken, Thai basil, and vegetables',
      price: 360,
      category: 'main',
      ingredients: ['Chicken', 'Coconut Milk', 'Green Curry Paste', 'Thai Basil'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 48
    },
    {
      name: 'Tom Yum Soup',
      description: 'Hot and sour soup with shrimp, mushrooms, lemongrass, and lime leaves',
      price: 220,
      category: 'appetizer',
      ingredients: ['Shrimp', 'Mushrooms', 'Lemongrass', 'Lime Leaves'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 35
    },
    {
      name: 'Mango Sticky Rice',
      description: 'Sweet sticky rice topped with fresh mango slices and coconut cream',
      price: 180,
      category: 'dessert',
      ingredients: ['Sticky Rice', 'Mango', 'Coconut Cream', 'Sugar'],
      dietary: ['vegetarian', 'vegan'],
      isAvailable: true,
      rating: 4.9,
      reviewCount: 41
    },
    // American Restaurant Menu
    {
      name: 'Classic Cheeseburger',
      description: 'Juicy patty with cheddar cheese, lettuce, tomato, and special sauce',
      price: 300,
      category: 'main',
      ingredients: ['Patty', 'Cheddar', 'Lettuce', 'Tomato', 'Bun'],
      isAvailable: true,
      rating: 4.5,
      reviewCount: 67
    },
    {
      name: 'BBQ Ribs',
      description: 'Slow-cooked pork ribs with tangy BBQ sauce and coleslaw',
      price: 480,
      category: 'main',
      ingredients: ['Pork Ribs', 'BBQ Sauce', 'Coleslaw', 'Spices'],
      isAvailable: true,
      rating: 4.7,
      reviewCount: 54
    },
    {
      name: 'Chicken Wings',
      description: 'Crispy chicken wings tossed in spicy sauce with ranch dip',
      price: 250,
      category: 'appetizer',
      ingredients: ['Chicken Wings', 'Sauce', 'Ranch', 'Celery'],
      isAvailable: true,
      rating: 4.6,
      reviewCount: 43
    },
    {
      name: 'Apple Pie',
      description: 'Classic American apple pie with cinnamon and vanilla ice cream',
      price: 160,
      category: 'dessert',
      ingredients: ['Apples', 'Cinnamon', 'Pie Crust', 'Vanilla Ice Cream'],
      dietary: ['vegetarian'],
      isAvailable: true,
      rating: 4.8,
      reviewCount: 38
    }
  ]
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const users = await User.create(sampleData.users);
    console.log(`👥 Created ${users.length} users`);

    // Create restaurants with owners
    const restaurantsWithOwners = sampleData.restaurants.map((restaurant, index) => ({
      ...restaurant,
      owner: users[index]._id
    }));
    
    const restaurants = await Restaurant.create(restaurantsWithOwners);
    console.log(`🏪 Created ${restaurants.length} restaurants`);

    // Create menu items for each restaurant
    const menuItemsWithRestaurants = [];
    const itemsPerRestaurant = 4; // Each restaurant gets 4 menu items
    
    sampleData.menuItems.forEach((item, index) => {
      const restaurantIndex = Math.floor(index / itemsPerRestaurant);
      if (restaurantIndex < restaurants.length) {
        menuItemsWithRestaurants.push({
          ...item,
          restaurant: restaurants[restaurantIndex]._id
        });
      }
    });

    const menuItems = await MenuItem.create(menuItemsWithRestaurants);
    console.log(`🍽️  Created ${menuItems.length} menu items`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Restaurants: ${restaurants.length}`);
    console.log(`   Menu Items: ${menuItems.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

