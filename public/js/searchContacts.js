function initializeContactTable() {
  console.log('Initializing contact table');
  fetch('/contacts')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data fetched:', data);
      updateContactTable(data);
    })
    .catch(error => console.error('Error fetching contacts:', error));
}


async function searchContacts() {
  const searchInput = document.getElementById('search').value.trim();
  
  if (!searchInput) {
    // If the search input is empty, initialize the table with all contacts
    await initializeContactTable();
    return;
  }

  fetch(`/contacts/search?q=${searchInput}`, {
    headers: {
      'Accept': 'application/json', // Ensure that the server knows we expect JSON
    }
  })
    .then(response => response.json())
    .then(data => updateContactTable(data))
    .catch(error => console.error('Error during search:', error));
}

function updateContactTable(contacts) {
  const contactTable = document.getElementById('contactTable');
  const tbody = contactTable.querySelector('tbody');

  // Clear current table rows
  tbody.innerHTML = '';

  // Add new rows based on the updated contact list
  contacts.forEach(contact => {
    const newRow = tbody.insertRow(-1);
    const fullNameCell = newRow.insertCell(0);
    const phoneCell = newRow.insertCell(1);
    const actionsCell = newRow.insertCell(2);

    // Explicitly set styles for the new row
    newRow.style.border = '1px solid #ddd';
    newRow.style.textAlign = 'center';

    fullNameCell.textContent = contact.FullName;
    phoneCell.textContent = contact.Phone;

    const updateLink = document.createElement('a');
    updateLink.href = `/contacts/update/${contact.id}`;
    updateLink.textContent = 'Update';

    const deleteLink = document.createElement('a');
    deleteLink.href = `/contacts/delete/${contact.id}`;
    deleteLink.textContent = 'Delete';
    deleteLink.onclick = function() {
      return confirm('Are you sure you want to delete this contact?');
    };

    actionsCell.appendChild(updateLink);
    actionsCell.appendChild(deleteLink);
  });
}



// Call initializeContactTable when the page loads
document.addEventListener('DOMContentLoaded', async() => { 
  await initializeContactTable();
});

// Attach the searchContacts function to the search input's "keyup" event
const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', searchContacts);