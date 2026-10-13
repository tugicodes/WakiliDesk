require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  { name: 'Amina Admin', email: 'admin@wakilidesk.test', password: 'Admin123!', role: 'Admin' },
  { name: 'J. Njeri', email: 'advocate@wakilidesk.test', password: 'Advocate123!', role: 'Advocate' },
  { name: 'Accounts Officer', email: 'accounts@wakilidesk.test', password: 'Accounts123!', role: 'Accounts' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({}); // development only: wipes existing users
  for (const u of users) await User.create(u); // create() so passwords get hashed
  console.log('Seeded', users.length, 'users');
  process.exit(0);
})();