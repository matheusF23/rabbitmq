let amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queue = 'task_queue';

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1); // give work to the worker only if the worker is free

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, msg => {
      let seconds = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());

      setTimeout(() => {
        console.log(` [x] Done in ${seconds} seconds`);
        channel.ack(msg);
      }, seconds * 1000);
    }, {
      // manual acknowledgment mode,
      noAck: false
    });
  });
});