const amqp = require("amqplib/callback_api");
const axios = require("axios").default;
const { POST_TRANSACTION_URL } = require("./config");

exports.consumerListener = () => {
    console.log("Consumer listening...");
    console.log(POST_TRANSACTION_URL)
    amqp.connect(
        "amqp://admin:admin@139.59.234.34:5672",
        function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }

                const queue = "transaction";

                channel.assertQueue(queue, {
                    durable: false,
                });

                console.log(
                    " [*] Waiting for messages in %s. To exit press CTRL+C",
                    queue
                );

                channel.consume(
                    queue,
                    async function (msg) {
                        const msgObject = JSON.parse(msg.content.toString());
                        const { account_id, transaction_type, payload, date } =
                            msgObject;

                        console.log(
                            " [x] Received %s",
                            JSON.parse(msg.content.toString())
                        );

                        const res = await axios.post(POST_TRANSACTION_URL, {
                            account_id,
                            transaction_type,
                            payload,
                            date,
                        });

                        console.log(res.data);
                    },
                    {
                        noAck: true,
                    }
                );
            });
        }
    );
};
