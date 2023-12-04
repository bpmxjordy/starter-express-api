// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Receipt = require('./receipt.model'); // Import the model

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://bpmxjordy:AFqvRYUtPyS0CBQG@receiptocluster.rvithpk.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// API routes
app.get('/api/receipts', async (req, res) => {
    const { userId, page, pageSize } = req.query;
    console.log(res);
    console.log(req);
    try {
        const receipts = await Receipt.find({ userId })
            .skip(page * pageSize)
            .limit(parseInt(pageSize));
        res.json(receipts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/api/receipts/:id', async (req, res) => {
    const { id } = req.params;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
    }

    try {
        const receipt = await Receipt.findById(id);
        if (receipt) {
            res.json(receipt);
        } else {
            res.status(404).send('Receipt not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/api/receipts/updateUserId', async (req, res) => {
    try {
        const { receiptId, newUserId } = req.body;

            // Find the receipt by ID and update its userId
            const updatedReceipt = await Receipt.findByIdAndUpdate(receiptId, { userId: newUserId });
    
            if (updatedReceipt) {
                res.json(updatedReceipt);
            } else {
                res.status(404).send('Receipt not found');
            }
        } catch (error) {
            console.error('Error updating userId:', error);
            res.status(500).send(error.message);
        }
    });

app.post('/api/receipts', async (req, res) => {
    const receipt = new Receipt(req.body);

    try {
        const savedReceipt = await receipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

