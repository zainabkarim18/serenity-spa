const Booking = require('../models/booking.js')
const verifyToken = require('../middleware/verify-token.js');
const express = require('express');
const router = express.Router();

router.use(verifyToken);

// CREATE
router.post('/:userId/:serviceId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const serviceId = req.params.serviceId;
        const { date, time, status = 'Pending' } = req.body;

        let booking = await Booking.findOne({ user: userId, service: serviceId }).populate('user').populate('service');;

        const obj = {
            user: userId,
            service: serviceId,
            date,
            time,
            status 
        }

        if (booking) {
            booking.Booking = booking; 
            await booking.save();
            res.status(201).json(booking);
        } else {
            const addBooking = await Booking.create(obj); 
            await addBooking.save();
            res.status(201).json(addBooking);
        }    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// all booking of a user
router.get('/', async (req, res) => {
    try {
        const foundBookings = await Booking.find().populate('user').populate('service');
        res.status(200).json(foundBookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// details by booking id
router.get('/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId).populate('user').populate('service');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }
        const deleteBooking = await Booking.findByIdAndDelete(bookingId);
        if (!deleteBooking) {
            res.status(404);
            throw new Error('Booking not found.');
        }
        res.status(200).json(deleteBooking);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});


// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;

        const updatedService = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true}).populate('user').populate('service');
        console.log(updatedService);
        
        if (!updatedService) {
            res.status(404);
            throw new Error('Booking not found.');
        }
        res.status(200).json(updatedService);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});


module.exports = router;

