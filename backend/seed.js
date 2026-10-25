require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Bin = require('./models/Bin');
const PickupRequest = require('./models/PickupRequest');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Bin.deleteMany(), PickupRequest.deleteMany()]);
  const hash = await bcrypt.hash('123456', 10);
  const [admin, collector, citizen] = await User.create([
    { name: 'Admin', email: 'admin@waste.com', password: hash, role: 'admin' },
    { name: 'Ravi Collector', email: 'collector@waste.com', password: hash, role: 'collector' },
    { name: 'Asha Citizen', email: 'citizen@waste.com', password: hash, role: 'citizen' },
  ]);
  const bins = [
    ['Hampankatta Bin', 'Hampankatta Circle, Mangaluru', 85],
    ['Lalbagh Bin', 'Lalbagh Road, Mangaluru', 55],
    ['Kadri Park Bin', 'Kadri Park, Mangaluru', 20],
    ['Bejai Bin', 'Bejai Main Road, Mangaluru', 92],
    ['Kankanady Bin', 'Kankanady Market, Mangaluru', 40],
  ];
  for (const [name, address, fillLevel] of bins) await new Bin({ name, address, fillLevel }).save();
  await PickupRequest.create({
    user: citizen._id, address: '12, MG Road, Mangaluru', wasteType: 'household', notes: 'Near the bus stop',
  });
  console.log('Seeded. Logins (password 123456): admin@waste.com, collector@waste.com, citizen@waste.com');
  await mongoose.disconnect();
})();
