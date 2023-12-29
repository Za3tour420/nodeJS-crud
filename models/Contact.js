const { DataTypes } = require('sequelize');
 
const Contact = (sequelize) => {
  const ContactModel = sequelize.define('Contact', {
    FullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Phone: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });
  return ContactModel;
};
 
module.exports = Contact;