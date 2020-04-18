const guestTable = document.querySelector('#guests')
const addNewGuestBtn = document.querySelector('#addNewGuestBtn')
let deleteGuestBtn
const url = 'http://localhost:3000/guests'
let guests
const form = document.querySelector('#form')

// performs api call to grab all of the guests
const getGuests = async () => {
  try {
    const apiCall = await axios.get(url)
    guests = apiCall.data
    for (let guest of guests) {
      guestTable.innerHTML += `<tr id="${guest.id}"><td>${guest.firstname}</td><td>${guest.lastname}</td><td>${guest.email}</td><td>${guest.age}</td><td><button id="updateGuest" class="btn btn-info"value="${guest._id}">Update</button></td><td><button id="deleteGuest" class="btn btn-danger" value="${guest._id}">Delete</button></td></tr>`
    }
    deleteGuestBtn = document.querySelector('#deleteGuest')
  } catch (error) {
    console.log(error)
  }
}

window.onload = event => {
  getGuests()
}

const createGuest = async () => {
  try {
    // grab input values
    let firstname = document.querySelector('#firstname').value
    let lastname = document.querySelector('#lastname').value
    let email = document.querySelector('#email').value
    let age = document.querySelector('#age').value

    // data to be sent with the post request
    const config = {
      method: 'post',
      url: url,
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        age: age,
        date: new Date()
      }
    }

    // POST request
    const apiCallPOST = await axios(config)

    // GET request for most recent document
    const apiCallGET = await axios.get(
      'http://localhost:3000/guests/recentGuest'
    )

    const oneGuest = apiCallGET.data

    guestTable.innerHTML += `<tr><td>${oneGuest.firstname}</td><td>${oneGuest.lastname}</td><td>${oneGuest.email}</td><td>${oneGuest.age}</td><td><button value="${oneGuest._id}">Update</button><button value="${oneGuest._id}">Delete</button></td></tr>`
  } catch (error) {
    console.log(error)
  }
}

// delete guest
const deleteGuest = async event => {
  try {
    if (event.target.matches('#deleteGuest')) {
      const config = {
        method: 'delete',
        url: url,
        data: {
          id: event.target.value
        }
      }
      // api delete call
      const guest = await axios(config)
      event.target.parentElement.parentElement.remove()
    }
  } catch (error) {
    console.log(error)
  }
}

// get the specific guest data from the database
const updateGuest = async event => {
  try {
    if (!event.target.matches('#updateGuest')) {
      return
    }
    console.log(event.target.value)
    const apiCall = await axios.get(
      `http://localhost:3000/guests/${event.target.value}`
    )

    const guest = apiCall.data
    console.log(guest)

    let firstname = guest.firstname
    let lastname = guest.lastname
    let email = guest.email
    let age = guest.age

    document.querySelector('#newGuestForm').style.display = 'none'

    form.innerHTML = `<input class="form-control mb-2" type="text" id="updateFirstname" value=${firstname}><input class="form-control mb-2" type="text" id="updateLastname" value=${lastname}><input class="form-control mb-2" type="email" id="updateEmail" value=${email}><input class="form-control mb-2" type="number" id="updateAge" value=${age}><button class="btn-info btn btn-block" id="confirmUpdate">Confirm Update</button>`
  } catch (error) {
    console.log(error)
  }
}

// update the guest in the database
const confirmUpdate = async () => {
  try {
    if (!event.target.matches('#confirmUpdate')) {
      return
    }
    let updateFirstname = document.querySelector('#updateFirstname')
    console.log(updateFirstname.value)
  } catch (error) {
    console.log(error)
  }
}

// add's new guest
addNewGuestBtn.addEventListener('click', createGuest)

// deletes guest
guestTable.addEventListener('click', deleteGuest)

// updates guest
guestTable.addEventListener('click', updateGuest)

// confirm update
form.addEventListener('click', confirmUpdate)
