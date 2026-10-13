require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Client = require('./models/Client');
const Matter = require('./models/Matter');

const users = [
  { name: 'Amina Admin', email: 'admin@wakilidesk.test', password: 'Admin123!', role: 'Admin' },
  { name: 'J. Njeri', email: 'advocate@wakilidesk.test', password: 'Advocate123!', role: 'Advocate' },
  { name: 'Accounts Officer', email: 'accounts@wakilidesk.test', password: 'Accounts123!', role: 'Accounts' },
  { name: 'P. Mutua', email: 'pmutua@wakilidesk.test', password: 'Advocate123!', role: 'Advocate' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // Development only: wipes everything and recreates the demo data
  await Promise.all([User.deleteMany({}), Client.deleteMany({}), Matter.deleteMany({})]);

  const created = [];
  for (const u of users) created.push(await User.create(u)); // create() so passwords get hashed
  const njeri = created[1];
  const mutua = created[3];

  const clients = await Client.insertMany([
    { name: 'Wanjiru Kamau', type: 'Individual', phone: '0712 345 678' },
    { name: 'Mwangi Holdings Ltd', type: 'Company', phone: '020 222 4100' },
    { name: 'Otieno & Sons Traders', type: 'Company', phone: '0722 880 019' },
    { name: 'Amina Hassan', type: 'Individual', phone: '0733 104 552' },
  ]);

  await Matter.insertMany([
    { caseNumber: 'HCCC E214 of 2026', title: 'Kamau v. Nairobi Estates Ltd', client: clients[0]._id,
      court: 'Milimani Law Courts', type: 'Civil', status: 'Active', advocate: njeri._id },
    { caseNumber: 'ELC 87 of 2026', title: 'Mwangi Holdings land dispute', client: clients[1]._id,
      court: 'ELC Milimani', type: 'Land', status: 'Active', advocate: mutua._id },
    { caseNumber: 'CR 412 of 2026', title: 'Republic v. Otieno', client: clients[2]._id,
      court: 'Kibera Law Courts', type: 'Criminal', status: 'Pending', advocate: njeri._id },
    { caseNumber: 'SUCC 33 of 2026', title: 'Estate of the late H. Hassan', client: clients[3]._id,
      court: 'Family Division', type: 'Succession', status: 'Closed', advocate: mutua._id },
  ]);

  console.log('Seeded', users.length, 'users, 4 clients and 4 matters');
  process.exit(0);
})();