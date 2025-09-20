const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Task', TaskSchema);
