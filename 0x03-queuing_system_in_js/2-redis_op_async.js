#!/usr/bin/env node
// Using promisify, modify the function displaySchoolValue to use
// ES6 async / await
// Same result as 1-redis_op.js

import { createClient, print } from 'redis';
import { promisify } from 'util';

const client = createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error.message}`);
});

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, print);
};

// Modify displaySchoolValue to use async/await
const displaySchoolValue = async (schoolName) => {
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (error) {
    console.error(`Error retrieving value: ${error.message}`);
  }
};

// Call displaySchoolValue with the Holberton key
displaySchoolValue('Holberton');

// Add a new key-value pair using setNewSchool with HolbertonSanFrancisco
// as the key and 100 as the value
setNewSchool('HolbertonSanFrancisco', '100');

// Call displaySchoolValue again with the new key
displaySchoolValue('HolbertonSanFrancisco');
