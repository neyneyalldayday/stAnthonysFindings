const {Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Donation extends Model {}

Donation.init(
     {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  donor_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  stripe_payment_intent_id: {
    type: DataTypes.STRING(100),
    unique: true
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending'
  }
}, {
  sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'donation'
});

module.exports = Donation;