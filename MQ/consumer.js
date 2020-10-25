require('dotenv/config');
const lib = require("../lib/sendMail");
var amqp = require('amqplib/callback_api');

exports.consumer =() =>{

    // Create connection to AMQP server
    amqp.connect(process.env.RABBITMQ_PORT, (err, connection) => {
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
            // Ensure that the queue is not deleted when server restarts
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }
            // Only request 1 unacked message from queue
            // This value indicates how many messages we want to process in parallel
            channel.prefetch(1);
            // Set up callback to handle messages received from the queue
            channel.consume(process.env.QUEUE, data => {
                if (data === null) {
                    return;
                }

                // Decode message contents
                let message = JSON.parse(data.content.toString());
                const mailContent = {
                    receiverEmail: data.emailId,
                    subject: "Message received from the queue",
                    content: `<span>${message}</span>`,
                };
                lib.sendEmail(mailContent, (err, info) => {
                    if (err) {
                        console.error(err.stack);
                        // put the failed message item back to queue
                        return channel.nack(data);
                    }
                    console.log('Delivered message %s', info.messageId);
                    // remove message item from the queue
                    channel.ack(data);
                });
            });
        });
    });
});
}