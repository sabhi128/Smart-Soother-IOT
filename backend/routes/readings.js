const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');

// @route   GET api/readings/:deviceId
// @desc    Get recent readings
// @access  Private
router.get('/:deviceId', auth, async (req, res) => {
    try {
        const readings = await SensorReading.find({ deviceId: req.params.deviceId })
            .sort({ timestamp: -1 })
            .limit(50); // Last 50 readings
        res.json(readings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/readings/alerts/:deviceId
// @desc    Get alerts
// @access  Private
router.get('/alerts/:deviceId', auth, async (req, res) => {
    try {
        const alerts = await Alert.find({ deviceId: req.params.deviceId })
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
