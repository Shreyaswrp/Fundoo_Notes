require('dotenv/config'); 
const amqp = require('amqplib/callback_api');
const lib = require("../lib/sendMail");
const QUEUE = 'Fundoo App'

class RabbitMq {

    //Create connection to rabbit mq
    createConnection =(callback) => {
        amqp.connect('amqp://localhost:5672', (err, connection) => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }else {
                console.log('Connected to RabbitMq');
                // Create channel
                connection.createChannel((err, channel) => {
                    if (err) {
                        return callback(err, null);
                    }else {
                        return callback(null, channel); 
                    }    
                });
            }    
        });        
    }

    
    //Send message to the queue
    sendToQueue =(content) => {
        this.createConnection((err, channel) => {
            if(err) {
                console.error(err.stack);
                return process.exit(1);
            }else {
                // Ensure queue for messages
                channel.assertQueue(QUEUE, {durable: true }, err => {
                            if (err) {
                                console.error(err.stack);
                                return process.exit(1);
                            }
                            const message = {
                                from: `${process.env.EMAIL_ID}`,
                                emailId: content.emailId,
                                subject: content.subject,
                                message: content.message,
                              };
                            let sent = channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
                                if (sent) {
                                    console.log(sent);
                                    return;
                                } else {
                                    channel.once('drain', () => next());
                                }
                        });
                        
            }
        });
    }

    //Consume message from the queue
    consumeFromQueue =() => {
        this.createConnection((err, channel) => {
            if(err) {
                console.error(err.stack);
                return process.exit(1);
            }
            channel.prefetch(1);
            // Set up callback to handle messages received from the queue
            channel.consume(QUEUE, data => {
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

module.exports = RabbitMq;


