require('dotenv/config'); 
const amqp = require('amqplib/callback_api');

exports.producer =() =>{

// Create connection to AMQP server
amqp.connect(process.env.RABBITMQ_PORT, (err, connection) => {
    console.log('it is coming here in producer');
    if (err) {
        console.error(err.stack);
        return process.exit(1);
    }
    // Create channel
    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }
        // Ensure queue for messages
        channel.assertQueue(process.env.QUEUE, {
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }
            // Create a function to send objects to the queue
            // Javascript object is converted to JSON and then into a Buffer
            let sender = (content, next) => {
                let sent = channel.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(content)));
                if (sent) {
                    console.log(sent);
                    return next();
                } else {
                    channel.once('drain', () => next());
                }
            };
            sender({ to: 'recipient@example.com', subject: 'Test message #' + sent, text: 'hello world!'}, next);
        });
    });
});
}
