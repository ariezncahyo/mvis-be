const db = require('../models');
const bcrypt = require('bcrypt');

const createUser = async () => {
  return await db.user.create({
    name: 'Aris Nurcahyo',
    username: 'ariezncahyo',
    email: 'ariezncahyo@gmail.com',
    password: await bcrypt.hash('123456', 10),
    photo: ''
  });
};

module.exports = { createUser };
