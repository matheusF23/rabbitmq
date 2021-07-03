// Producer

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const exchange = 'logs'
    const msg = process.argv.slice(2).join('') || 'Hello world.';

    channel.assertExchange(exchange, 'fanout', { durable: false }); // transmite todas as mensagens que recebe para todas as filas que conhece.
    channel.publish(exchange, '', Buffer.from(msg));

    console.log(` [x] Sent ${msg}`);
  });

  setTimeout(() => {
    connection.close();
    process.exit(0)
  }, 500);
});
