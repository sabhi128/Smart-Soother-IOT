const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
    deviceId: { type: String, required: true }, // Not ref, just ID for speed/decoupling
    temperature: { type: Number, required: true },
    heartRate: { type: Number, required: true },
    hydration: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Index for quick retrieval of history
sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
