const db = require('../database/database');
const { Op } = require('sequelize');

/* Find all contacts */
async function showContacts(req, res, next) {
  try {
    const { Contact } = (await db()).models; // Destructure models from the result of db function
    const contacts = await Contact.findAll();
    res.render('contacts.twig', { title: 'Contacts List', contacts: contacts });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching contacts : ' + e.message);
  }
}

/* Find a specific contact */
async function findContactByDetails(FullName, Phone) {
    const { Contact } = (await db()).models;
    const contact = await Contact.findOne({
      where: {
        FullName,
        Phone,
      },
    });
    if (contact) {
      return true;
    }
    return false;
}

/* Display create form */
async function displayCreateForm (req, res, next){
  try {
    res.render('addContact.twig', { title: 'Add form'});
  } catch (e) {
    console.error(e);
    res.status(500).json({ e: 'Internal Server Error! ' + e.message});
  }
};

/* Create a new contact */
async function createContact(req, res, next) {
  try {
    const { Contact } = (await db()).models;
    const { FullName, Phone } = req.body;

    if(await findContactByDetails(FullName, Phone)) {
      return res.status(409).json({ error: 'Contact already exists!' });
    }

    await Contact.create({ FullName, Phone });

    res.send(`
      <script>
        alert("Contact successfully created and added!");
        window.location.href = '/contacts'; // Redirect to the contacts page
      </script>
    `);
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

    // Check if new data coincide with existing data
    if(await findContactByDetails(FullName, Phone)) {
      return res.status(409).json({ error: 'Contact already exists! Please enter new data' });
    }

    await contactToUpdate.save();
    res.send(`
    <script>
      alert("Contact successfully updated!");
      window.location.href = '/contacts'; // Redirect to the contacts page
    </script>
  `);
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
    res.send(`
      <script>
        alert("Contact successfully deleted!");
        window.location.href = '/contacts'; // Redirect to the contacts page
      </script>
    `);
  } catch (e) {
    console.error(e);
    res.status(500).send('Error deleting contact! :' + e.message);
  }
}

/* Search contacts */
async function searchContacts(query) {
  try {
    const { Contact } = (await db()).models; // Destructure models from the result of db function

    if (!query) {
      // If the query is empty, return all contacts
      const contacts = await Contact.findAll();
      return contacts;
    }

    const filteredContacts = await Contact.findAll({
      where: {
        [Op.or]: [
          { FullName: { [Op.like]: `%${query}%` } },
          { Phone: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    return filteredContacts;
  } catch (e) {
    console.error(e);
    throw new Error('Error during contact search: ' + e.message);
  }
}



module.exports = {displayCreateForm, showContacts, createContact, displayUpdateForm,
                  updateContact, deleteContact, searchContacts};
