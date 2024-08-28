import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Create a Kue queue and enable test mode
    queue = createQueue({ name: 'push_notification_code_test' });
    queue.testMode.enter();
  });

  after(() => {
    // Exit test mode and shutdown the queue
    queue.testMode.exit();
    queue.shutdown(100, err => {
      if (err) {
        console.error('Error shutting down Kue queue:', err);
      } else {
        console.log('Kue queue shut down successfully');
      }
    });
  });

  afterEach(() => {
    // Clear the queue after each test
    queue.testMode.clear();
  });

  it('creates a job for each input object', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
      {
        phoneNumber: '4153518743',
        message: 'This is the code 4321 to verify your account',
      },
      {
        phoneNumber: '4153538781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Verify the jobs are created
    const createdJobs = queue.testMode.jobs;
    expect(createdJobs.length).to.equal(4);

    // Check each job's data
    createdJobs.forEach((job, index) => {
      expect(job.type).to.equal('push_notification_code_3');
      expect(job.data).to.deep.equal(jobs[index]);
    });
  });

  it('throws an error if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs({}, queue);
    }).to.throw('Jobs is not an array');
  });
});
