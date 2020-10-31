require("dotenv/config");
const amqp = require("amqplib/callback_api");
const QUEUE = "FundooApp";

class Producer {

  //Create connection to rabbit mq
  createConnection =(callback) =>{
    amqp.connect(process.env.RABBITMQ_PORT, (err, connection) => {
      if (err) {
        console.error(err.stack);
        return process.exit(1);
      } else {
        console.log("Connected to RabbitMq");
        // Create channel
        connection.createChannel((err, channel) => {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, channel);
          }
        });
      }
    });
  };

  //Send message to the queue
  sendToQueue = (content) =>{
    this.createConnection((err, channel) => {
      if (err) {
        console.error(err.stack);
        return process.exit(1);
      } else {
        // Ensure queue for messages
        channel.assertQueue(QUEUE, { durable: true }, (err) => {
          if (err) {
            console.error(err.stack);
            return process.exit(1);
          }
          const message = {
            from: `${process.env.EMAIL_ID}`,
            emailId: content.receiverEmail,
            subject: content.subject,
            message: content.content,
          };
          let sent = channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(message)));
          if (sent) {
            console.log(sent);
            return;
          } else {
            channel.once("drain", () => next());
          }
        });
      }
    });
  };
}

module.exports = new Producer();
