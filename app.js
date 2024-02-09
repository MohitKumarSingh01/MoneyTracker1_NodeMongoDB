const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define schema for transaction
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware for parsing incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Route for getting all transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching transactions.');
  }
});

// Route for adding a new transaction
app.post('/transactions', async (req, res) => {
  const { description, amount } = req.body;
  try {
    const newTransaction = new Transaction({ description, amount });
    await newTransaction.save();
    res.send('Transaction added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while adding the transaction.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
