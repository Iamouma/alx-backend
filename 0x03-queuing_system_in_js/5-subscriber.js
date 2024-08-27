#!/usr/bin/env node

import { createClient } from 'redis';

const subscriber = createClient();

// On successful connection
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// On failed connection(error)
subscriber.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error}`);
});

// Subscribe to Holberton School
subscriber.subscribe('holberton school channel');

// On message received
subscriber.on('message', (channel, message) => {
  console.log(`${message}`);
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
