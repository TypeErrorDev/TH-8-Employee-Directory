//API VARIABLE DECLARATION
let employees = [];
let urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
let flexContainer = document.querySelector(".flex-container");

// MODAL VARIABLE DECLARATION
let overlay = document.querySelector(".overlay");
let modalContainer = document.querySelector(".modal-content");
let modalClose = document.querySelector(".modal-close");

// FETCH FUNCTION TO GRAB API DATA
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

// FUNCTION TO DISPLAY EMPLOYEES
function displayEmployees(employeeData) {
  employees = employeeData;
  // EMPLOYEE HTML
  let employeeHTML = "";

  // LOOP THROUGH EMPLOYEE DATA AND CREATE HTML
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let state = employee.location.state;
    let picture = employee.picture;

    // CREATE HTML
    employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" alt="${name.first} ${name.last}"/>
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="city">${city}, ${state}</p>
            </div>
        </div>
        `;
  });
  flexContainer.innerHTML = employeeHTML;
}

// FUNCTION TO DISPLAY MODAL
function displayModal(index) {
  // OBJECT DESTRUCTURING
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];

  //   GRAB THE BIRTHDATE
  let date = new Date(dob.date);

  //   CREATE THE MODAL HTML
  const modalHTML = `
  <img class="avatar" src="${picture.large}"/>
  <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street}, ${state}, ${postcode}</p>
        <p>Birtday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;
  // REMOVE THE HIDDEN CLASS AND ASSIGN THE HTML TO THE MODAL
  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
}

// EVENTLISTENER FOR THE GRID
flexContainer.addEventListener("click", (e) => {
  // MAKE SURE THE CLICK IS NOT ON THE flexContainer ITSELF
  if (e.target !== flexContainer) {
    // SELECT THE CARD ELEMENT BASED ON THE PROXIMITY TO THE ACTUAL ELEMENT CLICKED
    const card = e.target.closest(".card");
    const index = card.getAttribute("data-index");
    displayModal(index);
  }
});

// EVENTLISTENER FOR THE MODAL CLOSE
modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

// FILTER THE RESULTS
function handleFilter(e) {
  const currentValue = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  for (const card of cards) {
    card.classList.toggle(
      "hidden",
      !card.innerText.toLowerCase().includes(currentValue)
    );
  }
}
const searchElement = document.querySelector(".search");
searchElement.addEventListener("input", handleFilter);

// PAGINATE THE OVERLAY
