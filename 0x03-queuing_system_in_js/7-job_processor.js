#!/usr/bin/env node
import { createQueue, Job } from 'kue';

// create a new kue queue
const queue = createQueue();

// Define an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

/**
 * Sends a notification to a phone number with a given message.
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message to send in the notification.
 * @param {Object} job - The Kue job object being processed.
 * @param {function} done - The function to call when the job is done processing.
 * @throws {Error} Will throw an error if the phone number is blacklisted.
 * @returns {void}
 */
const sendNotification = (phoneNumber, message, job, done) => {
  // Track the progress of the job
  job.progress(0, 100);
  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // If the phone number is blacklisted, fail the job with an error
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    // If the phone number is not blacklisted, continue processing the job
    // Track the progress of the job
    job.progress(50, 100);
    // Log the notification message to the console
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    // Call the done function to complete the job
    done();
  }
}
// Set up a job processor for the push_notification_code_2 queue
queue.process('push_notification_code_2', 2, (job, done) => {
  // Call the sendNotification function for each job in the queue
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});
