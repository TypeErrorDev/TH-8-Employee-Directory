/////////////////////////////////////////////////////////////////
///////////////// API VARIABLE DECLARATION //////////////////////
/////////////////////////////////////////////////////////////////

let employees = [];
let urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
let flexContainer = document.querySelector(".flex-container");
let cardID;

/////////////////////////////////////////////////////////////////
////////////// MODAL VARIABLE DECLARATION ///////////////////////
/////////////////////////////////////////////////////////////////

let overlay = document.querySelector(".overlay");
let modalContainer = document.querySelector(".modal-content");
let modalClose = document.querySelector(".modal-close");

/////////////////////////////////////////////////////////////////
///////////// FETCH FUNCTION TO GRAB API DATA ///////////////////
/////////////////////////////////////////////////////////////////

fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

/////////////////////////////////////////////////////////////////
////////////// FUNCTION TO DISPLAY EMPLOYEES ////////////////////
/////////////////////////////////////////////////////////////////

function displayEmployees(employeeData) {
  employees = employeeData;
  // EMPLOYEE HTML
  let employeeHTML = "";

  // DECLARE THE EMPLOYEE DATA
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let state = employee.location.state;
    let picture = employee.picture;

    // CREATE HTML FOR THE EMPLOYEES
    employeeHTML += `
        <div class="card" id="cardID" data-index="${index}">
            <img class="avatar" src="${picture.large}" alt="${name.first} ${name.last}"/>
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="city">${city}, ${state}</p>
            </div>
        </div>
        `;
  });
  // ASSIGN THE HTML TO THE CONTAINER
  flexContainer.innerHTML = employeeHTML;
  // GRAB THE CARDS
  let cards = document.querySelectorAll(".card");
  // LOOP THROUGH AND ADD EVENT LISTENER TO EACH CARD AND CALL DISPLAY MODAL FUNCTION
  for (let i = 0; i < employees.length; i++) {
    cards[i].addEventListener("click", (e) => {
      displayModal(i);
    });
  }
}

/////////////////////////////////////////////////////////////////
//////////////// FUNCTION TO DISPLAY MODAL //////////////////////
/////////////////////////////////////////////////////////////////

function displayModal(index) {
  // OBJECT DESTRUCTURING
  let {
    name,
    dob,
    phone,
    email,
    location: { city, state, postcode },
    picture,
  } = employees[index];

  //   GRAB THE BIRTHDATE
  let date = new Date(dob.date);

  //   CREATE THE MODAL HTML TO DISPLAY THE CARDS
  const modalHTML = `
  <img class="avatar" src="${picture.large}"/>
  <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
       <hr />
        <p>${phone}</p>
        <p class="address">123 5th Street, ${state}, ${postcode}</p>
        <p>Birtday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;
  // REMOVE THE HIDDEN CLASS AND ASSIGN THE HTML TO THE MODAL
  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
  cardID = index;
}

/////////////////////////////////////////////////////////////////
///////////////// EVENTLISTENER FOR THE CARD ////////////////////
/////////////////////////////////////////////////////////////////

flexContainer.addEventListener("click", (e) => {
  // MAKE SURE THE CLICK IS NOT ON THE FLEXCONTAINER ITSELF
  if (e.target !== flexContainer) {
    // SELECT THE CARD ELEMENT BASED ON THE PROXIMITY TO THE ACTUAL ELEMENT CLICKED
    const card = e.target.closest(".card");
    const index = card.getAttribute("data-index");
    displayModal(parseInt(index));
  }
});
/////////////////////////////////////////////////////////////////
///////////// EVENTLISTENER FOR THE MODAL CLOSE /////////////////
/////////////////////////////////////////////////////////////////

modalClose.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

/////////////////////////////////////////////////////////////////
///// EVENTLISTENER TO CLOSE MODAL WHEN OVERLAY IS CLICKED //////
/////////////////////////////////////////////////////////////////

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

/////////////////////////////////////////////////////////////////
//////////////////// FILTER THE RESULTS /////////////////////////
/////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////
//////////////////// PAGINATE THE OVERLAY ///////////////////////
/////////////////////////////////////////////////////////////////
const modalbtns = overlay.querySelectorAll(".modal-btn");
modalbtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("next")) {
      if (cardID === employees.length - 1) {
        // IF THE CARD ID IS THE LAST INDEX, RESET THE CARD ID TO 0
        cardID = 0;
        displayModal(cardID);
      } else {
        // IF THE CARD ID IS NOT THE LAST INDEX, INCREMENT THE CARD ID
        displayModal(cardID + 1);
      }
    } else {
      if (cardID == 0) {
        // IF THE CARD ID IS 0, SET THE CARD ID TO THE LAST INDEX
        cardID = 11;
        displayModal(cardID);
      } else {
        // IF THE CARD ID IS NOT 0, DECREMENT THE CARD ID
        displayModal(cardID - 1);
      }
    }
  })
);
