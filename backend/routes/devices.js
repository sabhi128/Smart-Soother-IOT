const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Device = require('../models/Device');
const Baby = require('../models/Baby');

// @route   GET api/devices
// @desc    Get all devices (admin) or just verify (parent) - MVP just listing
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Ideally find devices linked to user's babies
        // For MVP, finding devices where assignedBaby belongs to user
        const babies = await Baby.find({ parentId: req.user.id });
        const babyIds = babies.map(b => b._id);

        const devices = await Device.find({ assignedBaby: { $in: babyIds } }).populate('assignedBaby');
        res.json(devices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/devices/pair
// @desc    Pair a device to a baby
// @access  Private
router.post('/pair', auth, async (req, res) => {
    const { deviceId, babyId } = req.body;

    try {
        let device = await Device.findOne({ deviceId });

        if (!device) {
            // For MVP simulation, auto-create device if it doesn't exist when pairing
            device = new Device({ deviceId });
            await device.save();
        }

        // Check if device is already paired
        if (device.assignedBaby) {
            // If re-pairing to same baby, ok. If different, error.
            if (device.assignedBaby.toString() !== babyId) {
                return res.status(400).json({ msg: 'Device already paired to another baby' });
            }
        }

        const baby = await Baby.findById(babyId);
        if (!baby) return res.status(404).json({ msg: 'Baby not found' });

        if (baby.parentId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        device.assignedBaby = babyId;
        device.status = 'connected'; // Assume connected upon pairing for MVP
        await device.save();

        baby.device = device._id;
        await baby.save();

        res.json(device);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
