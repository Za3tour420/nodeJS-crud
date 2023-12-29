const db = require('../database/database');
const { Op } = require('sequelize');

/* Find all contacts */
async function findAll(req, res, next) {
  try {
    const { Contact } = (await db()).models; // Destructure models from the result of db function
    const contacts = await Contact.findAll();
    res.render('contacts.twig', { title: 'My contacts', contacts: contacts });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching contacts : ' + e.message);
  }
}

/* Create a new contact */
async function createContact(req, res, next) {
  try {
    const { Contact } = (await db()).models;
    const { FullName, Phone } = req.body;
    await Contact.create({ FullName, Phone });
    res.redirect('/contacts');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating contact : ' + e.message);
  }
}

/* Display update form */
async function displayUpdateForm (req, res, next){
  try {
    const { Contact } = (await db()).models;
    // Assuming you send the updated comment data in the request body
    const { id } = req.params;
    // Find the comment by ID
    const contactToUpdate = await Contact.findByPk(id);
    // Check if the comment exists
    if (!contactToUpdate) {
      return res.status(404).json({ error: 'Contact not found!' });
    }
    res.render('updateContact.twig', { title: 'Update form', contact: contactToUpdate });
  } catch (e) {
    console.error(e);
    res.status(500).json({ e: 'Internal Server Error! ' + e.message});
  }
};

/* Update a contact */
async function updateContact(req, res){
  try {
    const { Contact } = (await db()).models;
    // Assuming you send the updated contact data in the request body
    const { FullName, Phone } = req.body;
    const { id } = req.params;
    // Find the contact by ID
    const contactToUpdate = await Contact.findByPk(id);
    // Check if the contact exists
    if (!contactToUpdate) {
      return res.status(404).json({ error: 'Contact not found!' });
    }
    // Update the contact
    contactToUpdate.FullName = FullName;
    contactToUpdate.Phone = Phone;
    await contactToUpdate.save();
    // res.json(commentToUpdate);
    res.redirect('/contacts');
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error! ' + e.message});
  }
}

/* Delete a contact */
async function deleteContact(req, res, next) {
  try {
    const { Contact } = (await db()).models;
    const { id } = req.params;
    // Find contact by id
    const contactToDelete = await Contact.findByPk(id);
    // Check if it exists
    if (!contactToDelete) {
      return res.status(404).json({ error: 'Contact not found!' });
    }
    // Delete contact
    await contactToDelete.destroy();
    res.redirect('/contacts');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error deleting contact! :' + e.message);
  }
}

module.exports = { findAll, createContact, displayUpdateForm, updateContact, deleteContact, };
