const mongoose = require('mongoose');

const babySchema = new mongoose.Schema({
    name: { type: String, required: true },
    ageMonths: { type: Number, required: true },
    weightKg: { type: Number },
    medicalNotes: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' }, // Linked device
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Baby', babySchema);
