const guestTable = document.querySelector('#guests')
const addNewGuestBtn = document.querySelector('#addNewGuestBtn')
let deleteGuestBtn
const url = 'https://my-guests.herokuapp.com/guests'
let guests
const form = document.querySelector('#form')
let parent

// performs api call to grab all of the guests
const getGuests = async () => {
  try {
    const apiCall = await axios.get(url)
    guests = apiCall.data
    for (let guest of guests) {
      const newRows = document.createElement('tr')
      newRows.id = `${guest._id}`
      guestTable.appendChild(newRows)
      newRows.innerHTML = `<td>${guest.firstname}</td><td>${guest.lastname}</td><td>${guest.email}</td><td>${guest.age}</td><td><button id="updateGuest" class="btn btn-info"value="${guest._id}">Update</button></td><td><button id="deleteGuest" class="btn btn-danger" value="${guest._id}">Delete</button></td>`
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
    let firstname = document.querySelector('#firstname')
    let lastname = document.querySelector('#lastname')
    let email = document.querySelector('#email')
    let age = document.querySelector('#age')

    // data to be sent with the post request
    const config = {
      method: 'post',
      url: url,
      data: {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        age: age.value,
        date: new Date()
      }
    }

    // POST request
    const apiCallPOST = await axios(config)

    // GET request for most recent document
    const apiCallGET = await axios.get(
      'https://my-guests.herokuapp.com/guests/recentGuest'
    )

    const oneGuest = apiCallGET.data

    // add the most recent document to the table
    const newRows = document.createElement('tr')
    newRows.id = `${oneGuest._id}`
    guestTable.appendChild(newRows)
    newRows.innerHTML = `<td>${oneGuest.firstname}</td><td>${oneGuest.lastname}</td><td>${oneGuest.email}</td><td>${oneGuest.age}</td><td><button id="updateGuest" class="btn btn-info"value="${oneGuest._id}">Update</button></td><td><button id="deleteGuest" class="btn btn-danger" value="${oneGuest._id}">Delete</button></td>`

    // reset the inputs back to blank
    firstname.value = ''
    lastname.value = ''
    email.value = ''
    age.value = ''

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

// get the specific guest data from the database and insert it into an update form
const updateGuest = async event => {
  try {
    if (!event.target.matches('#updateGuest')) {
      return
    }

    parent = event.target.parentElement.parentElement

    console.log(event.target)

    const apiCall = await axios.get(
      `https://my-guests.herokuapp.com/guests/${event.target.value}`
    )

    const guest = apiCall.data
    console.log(guest)

    let id = guest._id
    let firstname = guest.firstname
    let lastname = guest.lastname
    let email = guest.email
    let age = guest.age

    const newGuestForm = document.querySelector('#addGuestForm')

    if (typeof(newGuestForm) != 'undefined' && newGuestForm != null) {
      newGuestForm.style.display = 'none'
    }
    
    form.innerHTML = `<div id="updateForm"><input class="form-control mb-2" type="text" id="updateFirstname" value=${firstname}><input class="form-control mb-2" type="text" id="updateLastname" value=${lastname}><input class="form-control mb-2" type="email" id="updateEmail" value=${email}><input class="form-control mb-2" type="number" id="updateAge" value=${age}><button value="${id}"class="btn-info btn btn-block" id="confirmUpdate">Confirm Update</button></div>`

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

    console.log(parent)

    // grab the update form values

    let updateFirstname = document.querySelector('#updateFirstname').value
    let updateLastname = document.querySelector('#updateLastname').value
    let updateEmail = document.querySelector('#updateEmail').value
    let updateAge = document.querySelector('#updateAge').value
    let id = document.querySelector('#confirmUpdate').value

    // send patch request to update guest in DB
    const config = {
      method: 'patch',
      url: url,
      data: {
        id: id,
        firstname: updateFirstname,
        lastname: updateLastname,
        email: updateEmail,
        age: updateAge
      }
    }

    const apiCall = await axios(config)

    // return the updated record
    const updated = await axios(`https://my-guests.herokuapp.com/guests/${id}`)

    const guest = updated.data

    console.log(parent.innerHTML)

    // update the table with the updated record
    parent.innerHTML = `<td>${guest.firstname}</td><td>${guest.lastname}</td><td>${guest.email}</td><td>${guest.age}</td><td><button id="updateGuest" class="btn btn-info"value="${guest._id}">Update</button></td><td><button id="deleteGuest" class="btn btn-danger" value="${guest._id}">Delete</button></td>`

    document.querySelector('#updateForm').style.display = 'none'
    newGuestForm.style.display = 'block'

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
