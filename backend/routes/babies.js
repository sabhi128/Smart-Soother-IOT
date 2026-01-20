const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Baby = require('../models/Baby');
const Device = require('../models/Device');

// @route   GET api/babies
// @desc    Get all babies for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const babies = await Baby.find({ parentId: req.user.id }).populate('device');
        res.json(babies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/babies
// @desc    Add a new baby
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, ageMonths, weightKg, medicalNotes } = req.body;

    try {
        const newBaby = new Baby({
            name,
            ageMonths,
            weightKg,
            medicalNotes,
            parentId: req.user.id
        });

        const baby = await newBaby.save();
        res.json(baby);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/babies/:id
// @desc    Update baby info
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, ageMonths, weightKg, medicalNotes } = req.body;

    // Build baby object
    const babyFields = {};
    if (name) babyFields.name = name;
    if (ageMonths) babyFields.ageMonths = ageMonths;
    if (weightKg) babyFields.weightKg = weightKg;
    if (medicalNotes) babyFields.medicalNotes = medicalNotes;

    try {
        let baby = await Baby.findById(req.params.id);

        if (!baby) return res.status(404).json({ msg: 'Baby not found' });

        // Make sure user owns baby
        if (baby.parentId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        baby = await Baby.findByIdAndUpdate(
            req.params.id,
            { $set: babyFields },
            { new: true }
        );

        res.json(baby);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
