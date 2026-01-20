const SensorReading = require('../models/SensorReading');
const Alert = require('../models/Alert');
const Device = require('../models/Device');

const SAFE_TEMP_MAX = 38.0;
const SAFE_HR_MIN = 80;
const SAFE_HR_MAX = 170;
const SAFE_HYDRATION_MIN = 30; // 30% threshold? Maybe use something else. Let's say 40%.

const startSimulation = (io) => {
    console.log('Starting IoT Simulation Service...');

    setInterval(async () => {
        try {
            // Find all devices that are successfully paired
            const devices = await Device.find({ status: 'connected', assignedBaby: { $ne: null } });

            devices.forEach(async (device) => {
                // Generate simulated data
                // Normal range: 36.5 - 37.5. Occasional spike to 38.5
                const isFever = Math.random() > 0.95;
                const temp = isFever
                    ? (38.0 + Math.random() * 1.5).toFixed(1)
                    : (36.5 + Math.random() * 1.0).toFixed(1);

                const hr = Math.floor(90 + Math.random() * 70); // 90-160 normal-ish
                const hydration = Math.floor(80 + Math.random() * 20); // 80-100%

                const reading = new SensorReading({
                    deviceId: device.deviceId,
                    temperature: temp,
                    heartRate: hr,
                    hydration: hydration
                });

                await reading.save();

                // Broadcast data
                io.emit(`reading:${device.deviceId}`, reading);

                // Check for alerts
                let alerts = [];

                if (temp > SAFE_TEMP_MAX) {
                    alerts.push({ type: 'temperature', msg: `High temperature detected: ${temp}°C`, severity: 'critical', val: temp });
                }

                if (hr > SAFE_HR_MAX || hr < SAFE_HR_MIN) {
                    alerts.push({ type: 'heartRate', msg: `Abnormal Heart Rate: ${hr} BPM`, severity: 'warning', val: hr });
                }

                if (hydration < SAFE_HYDRATION_MIN) {
                    alerts.push({ type: 'hydration', msg: `Low Hydration: ${hydration}%`, severity: 'warning', val: hydration });
                }

                for (let alertInfo of alerts) {
                    // Check if recent alert exists to avoid spamming? For MVP, just creating.
                    // Or strictly emit.

                    const alert = new Alert({
                        deviceId: device.deviceId,
                        babyId: device.assignedBaby,
                        type: alertInfo.type,
                        severity: alertInfo.severity,
                        message: alertInfo.msg,
                        value: alertInfo.val
                    });

                    await alert.save();
                    io.emit(`alert:${device.deviceId}`, alert);
                }

            });
        } catch (err) {
            console.error('IoT Simulation Error:', err);
        }
    }, 5000); // Run every 5 seconds
};

module.exports = startSimulation;
