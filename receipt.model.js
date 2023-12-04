
const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: false },
    date: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, default: 1 }
        }
    ],
});

module.exports = mongoose.model('Receipt', ReceiptSchema);