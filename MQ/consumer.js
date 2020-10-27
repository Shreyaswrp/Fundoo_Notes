require("dotenv/config");
const producer = require('./producer.js')
const lib = require("../lib/sendMail");

class Consumer {

    //Consume message from the queue
    consumeFromQueue =() => {
        producer.createConnection((err, channel) => {
            if(err) {
                console.error(err.stack);
                return process.exit(1);
            }
            channel.prefetch(1);
            // Set up callback to handle messages received from the queue
            channel.consume(process.env.QUEUE, data => {
                if (data === null) {
                    return;
                }
                // Decode message contents
                let message = JSON.parse(data.content.toString());
                console.log(message);
                const mailContent = {
                    receiverEmail: message.emailId,
                    subject: message.subject,
                    content: message.message,
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
    }
}

module.exports = new Consumer();


