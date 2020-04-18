var express = require('express')
var router = express.Router()
const guestController = require('./../controllers/guestController')

/* GET home page. */
router.get('/', guestController.read)

router.get('/recentguest', guestController.recentGuest)

router.get('/:id', guestController.getGuest)

router.post('/', guestController.create)

router.delete('/', guestController.delete)

router.patch('/', guestController.update)

module.exports = router
