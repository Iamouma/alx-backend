#!/usr/bin/env node

import { createQueue } from 'kue';

// create the queue
const queue = createQueue();

const sendNotification = (phoneNumber, message) => {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
};

// Queue process that will listen to new jobs on push_notifications
queue.process('push__notifications_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done();
});

export default queue;
