// Producer

const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1
    }

    const exchange = 'direct_logs'
    const args = process.argv.slice(2)
    const msg = args.slice(1).join(' ') || 'Hello world!'
    const severity = (args.length > 0) ? args[0] : 'info'

    // Faz um direcionamento das mensagem. A depender da binding key
    channel.assertExchange(exchange, 'direct', { durable: false })
    channel.publish(exchange, severity, Buffer.from(msg))

    console.log(` [x] Sent ${severity}: '${msg}'`)
  })

  setTimeout(() => {
    connection.close()
    process.exit(0)
  }, 500)
})
