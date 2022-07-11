const amqp = require("amqplib/callback_api");
const axios = require("axios").default;

exports.consumerListener = () => {
    console.log("Consumer listening...");
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

                        const res = await axios.post(
                            "https://faas-sgp1-18bc02ac.doserverless.co/api/v1/web/fn-a916d45e-b515-4ffa-8656-7131ef8f4d20/smartcard/transaction",
                            {
                                account_id,
                                transaction_type,
                                payload,
                                date,
                            }
                        );

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
