#!/usr/bin/env node
import { createQueue } from 'kue';

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create queue
const queue = createQueue({name: 'push_notification_code'});

for (const job of jobs) {
  const notificationJob = queue.create('push_notification_code_2', job)
    .on('complete', () => {
      console.log(`Notification job ${notificationJob.id} completed`);
    })
    .on('failed', (err) => {
      console.log(`Notification job ${notificationJob.id} failed: ${err}`);
    })
    .on('progress', (progress, _data) => {
      console.log(`Notification job ${notificationJob.id} ${progress}% complete`);
    })
    .save((err) => {
      if (err) {
        console.log(`Error creating notification job: ${err}`);
      } else {
        console.log(`Notification job created: ${notificationJob.id}`);
      }
    });
}
