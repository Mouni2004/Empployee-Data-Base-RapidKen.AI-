// Define constants
const content = document.getElementById("content");
const navMenu = document.getElementById("navMenu");
const searchBar = document.getElementById("searchBar");

// State
let employees = JSON.parse(localStorage.getItem("employees")) || [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5;

// Event listeners
document.getElementById("hamburgerMenu").addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Search functionality
searchBar.addEventListener("input", handleSearch);
searchBar.addEventListener("keyup", e => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const query = searchBar.value.toLowerCase();
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(query)
  );
  currentPage = 1; // Reset to the first page on search
  renderEmployeeList(filteredEmployees);
}

// Navigation
function navigate(page) {
  if (page === "registration") {
    renderRegistrationPage();
  } else if (page === "listing") {
    renderListingPage();
  }
}

// Registration Page
function renderRegistrationPage() {
  content.innerHTML = `
    <h1>Employee Registration</h1>
    <form id="employeeForm">
      <label for="name">Name:</label>
      <input type="text" id="name" required>
      
      <label for="position">Position:</label>
      <input type="text" id="position" required>
      
      <label for="about">About:</label>
      <textarea id="about" required></textarea>
      
      <label for="joiningDate">Joining Date:</label>
      <input type="date" id="joiningDate" required>
      
      <button type="submit">Submit</button>
    </form>
  `;

  document.getElementById("employeeForm").addEventListener("submit", e => {
    e.preventDefault();
    const newEmployee = {
      name: document.getElementById("name").value,
      position: document.getElementById("position").value,
      about: document.getElementById("about").value,
      joiningDate: document.getElementById("joiningDate").value
    };
    employees.push(newEmployee);
    localStorage.setItem("employees", JSON.stringify(employees));
    navigate("listing");
  });
}

// Listing Page
function renderListingPage() {
  content.innerHTML = `
    <h1>Employee Listing</h1>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>About</th>
          <th>Joining Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="employeeTable"></tbody>
    </table>
    <div id="pagination"></div>
  `;
  renderEmployeeList();
}

function renderEmployeeList(filteredEmployees = employees) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const employeeTable = document.getElementById("employeeTable");
  employeeTable.innerHTML = "";

  if (paginatedEmployees.length === 0) {
    employeeTable.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center;">No employees found</td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  paginatedEmployees.forEach((emp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.position}</td>
      <td>${emp.about}</td>
      <td>${emp.joiningDate}</td>
      <td><button onclick="deleteEmployee(${filteredEmployees.indexOf(emp)})">Delete</button></td>
    `;
    employeeTable.appendChild(row);
  });

  renderPagination(filteredEmployees.length);
}

// Delete Employee
function deleteEmployee(index) {
  employees.splice(index, 1);
  localStorage.setItem("employees", JSON.stringify(employees));
  renderListingPage();
}

// Pagination
function renderPagination(totalItems) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = i === currentPage;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      const query = searchBar.value.toLowerCase();
      const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(query)
      );
      renderEmployeeList(filteredEmployees);
    });
    pagination.appendChild(pageButton);
  }
}

// Initial render
navigate("registration");
