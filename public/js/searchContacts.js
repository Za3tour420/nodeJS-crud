function searchContacts() {
    const searchInput = document.getElementById('search').value;
    const contactTable = document.getElementById('contactTable');
  
    fetch(`/contacts/search?query=${searchInput}`)
      .then(response => response.json())
      .then(data => {
        // Clear current table rows
        while (contactTable.rows.length > 1) {
          contactTable.deleteRow(1);
        }
  
        // Add new rows based on search results
        data.forEach(contact => {
          const newRow = contactTable.insertRow(-1);
          const fullNameCell = newRow.insertCell(0);
          const phoneCell = newRow.insertCell(1);
          const actionsCell = newRow.insertCell(2);
  
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
      })
      .catch(error => console.error('Error during search:', error));
  }