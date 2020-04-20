const express = require('express')
const Guest = require('./../models/guestModel')

const app = express()

const getGuests = async (req, res, next) => {
  const guest = await Guest.find()
  res.send(guest)
}

const getRecentGuest = async (req, res, next) => {
  const guest = await Guest.findOne()
    .sort({ dateAdded: -1 })
    .limit(1)
  res.send(guest)
}

const createGuest = async (req, res, next) => {
  await Guest.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    age: req.body.age,
    dateAdded: req.body.date
  })
  res.send(`${req.body.fistname} has been created`)
}

const updateGuest = async (req, res, next) => {
  try {
    const guest = await Guest.updateOne(
      { _id: req.body.id },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        age: req.body.age
      }
    )
    res.send(guest)
  } catch (error) {
    console.log(error)
  }
}

const deleteGuest = async (req, res, next) => {
  try {
    console.log(req.body.id)
    await Guest.deleteOne({ _id: req.body.id })
    res.send('Guest deleted')
  } catch (error) {
    console.log(error)
  }
}

const getOneGuest = async (req, res, next) => {
  try {
    const oneGuest = await Guest.findOne({ _id: req.params.id })
    res.send(oneGuest)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  read: getGuests,
  create: createGuest,
  update: updateGuest,
  delete: deleteGuest,
  recentGuest: getRecentGuest,
  getGuest: getOneGuest
}
