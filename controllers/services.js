const Service = require('../models/service.js')
const User = require("../models/user.js");
const verifyToken = require('../middleware/verify-token.js');
const isAdmin = require("../middleware/isAdmin.js");
const express = require('express');
const router = express.Router();


// CREATE
router.post('/' ,async (req, res) => {
        try {
            const addService = await Service.create(req.body);
            res.status(201).json(addService);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// READ - INDEX
router.get('/', async (req, res) => {
    try {
        const foundServices = await Service.find();
        console.log(foundServices)
        res.status(200).json(foundServices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DETAIL
router.get('/:id', async (req, res) => {
    try {
        const foundService = await Service.findById(req.params.id);
        if (!foundService) {
            res.status(404);
            throw new Error('Service not found.');
        }
        res.status(200).json(foundService);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// DELETE
router.delete('/:id' , async (req, res) => {
    try {
        console.log('loo');

        const deleteService = await Service.findByIdAndDelete(req.params.id);
        if (!deleteService) {
            res.status(404);
            throw new Error('Service not found.');
        }
        res.status(200).json(deleteService);
    } catch (err) {
        if (res.statusCode === 404) {
            res.json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});


// UPDATE
router.put('/', async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.body._id, req.body, {
            new: true,
        });
        if (!updatedService) {
            res.status(404);
            throw new Error('Service not found.');
        }
        console.log("updated");
        
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

