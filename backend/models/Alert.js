const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby' },
    type: { type: String, enum: ['temperature', 'heartRate', 'hydration'], required: true },
    severity: { type: String, enum: ['warning', 'critical'], required: true },
    message: { type: String, required: true },
    value: { type: Number },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
