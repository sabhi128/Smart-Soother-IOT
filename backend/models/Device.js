const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true }, // unique hardware ID
    name: { type: String, default: 'Smart Soother' },
    status: { type: String, enum: ['connected', 'disconnected'], default: 'disconnected' },
    assignedBaby: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby', default: null },
    lastSeen: { type: Date }
});

module.exports = mongoose.model('Device', deviceSchema);
