#!/usr/bin/env node

import { createQueue } from 'kue';

// create queue
const queue = createQueue({name: 'push_notification_code'});

// Job data
const jobData = {
  phoneNumber: '0712345678',
  message: 'This is the code to verify your account'
};

// Create Job
const job = queue.create('push_notification_code', jobData);

job
  // When job is created without error, log to the console
  // "Notification job created: JOB ID"
  .on('enqueue', () => {
    console.log(`Notification job created: ${job.id}`);
  })
  // When job is completed, log to the console "Notification job completed"
  .on('complete', () => {
    console.log('Notification job completed');
  })
  // When job is failing, log to the console "Notification job failed"
  .on('failed', () => {
    console.log('Notification job failed');
  })

  .save((error) => {
    if (error) {
      console.log('Error creating job:', error);
    }
  });
