
const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'archived'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.models.Gig || mongoose.model('Gig', gigSchema);
