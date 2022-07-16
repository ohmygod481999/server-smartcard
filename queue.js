const amqp = require("amqplib/callback_api");

const connectAmqp = () => {
    return new Promise((resolve, reject) => {
        amqp.connect(
            "amqp://admin:admin@139.59.234.34:5672",
            function (error0, connection) {
                if (error0) {
                    reject(error0);
                }
                // connection = _connection;
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    const queue = "transaction";

                    // channel = _channel;

                    channel.assertQueue(queue, {
                        durable: false,
                    });

                    resolve({
                        channel,
                        connection,
                    });
                });
            }
        );
    });
};

// connect to rabbitmq
exports.useQueue = async function (req, res, next) {
    const { channel, connection } = await connectAmqp();
    req.amqpConnection = connection;
    req.amqpChannel = channel;
    next();
};