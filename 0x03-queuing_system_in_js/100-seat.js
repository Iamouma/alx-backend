// Required dependencies
const express = require('express');
const redis = require('redis');
const kue = require('kue');
const { promisify } = require('util');

// Initialize Express app and Redis client
const app = express();
const port = 1245;
const client = redis.createClient();

// Promisify Redis functions for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Initialize available seats and reservation status
let reservationEnabled = true;
const initialSeats = 50;

// Function to set the number of available seats
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get the current number of available seats
async function getCurrentAvailableSeats() {
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10);
}

// Set initial available seats when launching the application
reserveSeat(initialSeats);

// Create a Kue queue
const queue = kue.createQueue();

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: "Reservation are blocked" });
  }

  const job = queue.create('reserve_seat').save(err => {
    if (err) {
      return res.json({ status: "Reservation failed" });
    }
    res.json({ status: "Reservation in process" });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  }).on('failed', err => {
    console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
  });
});

// Route to process the queue
app.get('/process', (req, res) => {
  res.json({ status: "Queue processing" });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();

    if (availableSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    await reserveSeat(availableSeats - 1);

    if (availableSeats - 1 === 0) {
      reservationEnabled = false;
    }

    done();
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
