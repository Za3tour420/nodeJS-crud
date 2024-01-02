var express = require('express');
var router = express.Router();
const path = require('path');

// Import Contact functions
var {showContacts, displayCreateForm, createContact, displayUpdateForm,
    updateContact, deleteContact, searchContacts} = require('../services/contactService');

// Import validation middleware
var validation = require('../middlewares/validation');

router.get('/', showContacts);
router.get('/create', displayCreateForm);
router.post('/create', validation, createContact);
router.get('/update/:id', displayUpdateForm);
router.post('/update/:id', validation, updateContact);
router.get('/delete/:id', deleteContact);

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required!' });
    }
    const results = await searchContacts(query);

    res.format({
      'application/json': () => {
        res.json(results);
      },
      'text/html': () => {
        res.render('contacts.twig', { title: 'Search Results', contacts: results, query });
      },
      default: () => {
        res.status(406).send('Not Acceptable');
      },
    });
  } catch (error) {
    console.error('Error handling search:', error);
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});


router.get('/js/searchContacts.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/js/searchContacts.js'));
});
 
module.exports = router;