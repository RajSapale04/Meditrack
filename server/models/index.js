const sequelize = require('../config/db');
const User = require('./User');

// Define associations here if you have more models
// User.hasMany(Post);
// Post.belongsTo(User);

const initDatabase = async () => {
  try {
    // Sync all models
    await sequelize.sync({ 
      force: false, // Set to true only in development to reset tables
      alter: process.env.NODE_ENV === 'development' // Auto-alter tables in development
    });
    
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  initDatabase
};