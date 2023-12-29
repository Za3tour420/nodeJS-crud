var express = require('express');
var router = express.Router();

// Import Contact functions
var { findAll, createContact, displayUpdateForm,
    updateContact, deleteContact, searchContacts } = require('../services/contactService');
var searchContacts = require('../public/js/searchContacts');

// Import validation middleware
var validation = require('../middlewares/validation');

router.get('/', findAll);
router.post('/create', validation, createContact);
router.get('/update/:id', displayUpdateForm);
router.post('/update/:id', validation, updateContact);
router.get('/delete/:id', deleteContact);

router.get('/search', async (req, res) => {
    try {
      const { query } = req.query;
      const filteredContacts = await searchContacts(query);
      res.json(filteredContacts);
    } catch (error) {
      console.error('Error handling search:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Serve the searchScript.js file
router.get('/js/searchScript.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/js/searchScript.js'));
  });
 
module.exports = router;