const amqp = require("amqplib/callback_api");

let channel;
let connection;

// connect to rabbitmq
const connect = () => {
    amqp.connect(
        "amqp://admin:admin@139.59.234.34:5672",
        function (error0, _connection) {
            if (error0) {
                throw error0;
            }
            connection = _connection;
            connection.createChannel(function (error1, _channel) {
                if (error1) {
                    throw error1;
                }
                const queue = "transaction";

                channel = _channel;

                channel.assertQueue(queue, {
                    durable: false,
                });
            });
        }
    );
};

connect();

exports.channel = channel;
exports.connection = connection;
