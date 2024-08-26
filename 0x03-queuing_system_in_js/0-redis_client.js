#!/usr/bin/env node
// Script that logs to the console "Redis client connected to the server.
//  Import the redis library using ES6 syntax.
import { createClient } from 'redis';

// Create a Redis client
const client = createClient();

// Handle successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle connection errors
client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});
