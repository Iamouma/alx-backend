#!/usr/bin/env node

import { createClient } from 'redis';

// Create redis client
const publisher = createClient();

// On successful connection
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

// On connection failed(error)
publisher.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// Function to publish nessage after a certain time
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('Holberton school channel', message);
  }, time);
}

// Publish messages
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
