// app.js

/**
 * Populates the form with the user's data
 * @param {Object} data - The user object
 */
function populateForm(data) {
  const { user, id } = data;

  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Handles clicks on the user list
 * @param {Event} event 
 * @param {Array} users 
 * @param {Array} stocks 
 */
function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  const user = users.find(user => user.id == userId);

  populateForm(user);
  renderPortfolio(user, stocks);
}

/**
 * Renders the portfolio items for the user
 * @param {Object} user 
 * @param {Array} stocks 
 */
function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');

  // Clear previous portfolio items
  portfolioDetails.innerHTML = '';

  // Render new portfolio items
  portfolio.forEach(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');

    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);

    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  // Event delegation: handle clicks on the "View" buttons
  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Renders the stock information for the symbol
 * @param {string} symbol 
 * @param {Array} stocks 
 */
function viewStock(symbol, stocks) {
  const stockArea = document.querySelector('.stock-form');
  if (!stockArea) return;

  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) return;

  document.querySelector('#stockName').textContent = stock.name;
  document.querySelector('#stockSector').textContent = stock.sector;
  document.querySelector('#stockIndustry').textContent = stock.subIndustry;
  document.querySelector('#stockAddress').textContent = stock.address;
  document.querySelector('#logo').src = `logos/${symbol}.svg`;

  stockArea.style.display = 'block';
}

/**
 * Generates the user list
 * @param {Array} users 
 * @param {Array} stocks 
 */
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');

  // Clear previous list items
  userList.innerHTML = '';

  users.forEach(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // Add click listener to handle user selection
  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

// Main event handler
document.addEventListener('DOMContentLoaded', () => {
  // Parse JSON data from included script files
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Generate the initial user list
  generateUserList(userData, stocksData);

  // Delete button functionality
  const deleteButton = document.querySelector('#deleteButton');
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);
    if (userIndex > -1) {
      userData.splice(userIndex, 1);
      generateUserList(userData, stocksData);
    }
  });

  // Save button functionality
  const saveButton = document.querySelector('#saveButton');
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const id = document.querySelector('#userID').value;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;

        generateUserList(userData, stocksData);
        break;
      }
    }
  });
});
