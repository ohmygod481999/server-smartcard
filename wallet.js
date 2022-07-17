const express = require("express");
const { graphQLClient } = require("./graphql-client");
const {
    GET_REGISTRAION_QUERY,
    APPROVE_REGISTRATION_MUTATION,
} = require("./queries");
const { useQueue } = require("./queue");

const router = express.Router();

router.post("/approve-withdraw", useQueue, async (req, res) => {
    const { amqpChannel } = req;

    const { registrationId } = req.body;

    const registrationRes = await graphQLClient.request(GET_REGISTRAION_QUERY, {
        registration_id: registrationId,
    });

    const registration = registrationRes.registration_by_pk;

    if (!registration || registration.type !== 1) {
        res.json({
            success: false,
            message:
                "Registration is not exist or registration type doesn't match",
        });
        return;
    }
    const { id, account_id, type, approved, created_at, payload } =
        registration;

    const { amount } = payload;

    if (approved) {
        res.status(400);
        res.json({
            success: false,
            message: "This registration has already approved",
        });
        return;
    }

    await graphQLClient.request(APPROVE_REGISTRATION_MUTATION, {
        registration_id: registrationId,
    });

    amqpChannel.sendToQueue(
        "transaction",
        Buffer.from(
            JSON.stringify({
                account_id: account_id,
                transaction_type: 3, // 3: withdraw
                payload: {
                    amount,
                },
                date: new Date(),
            })
        )
    );

    res.json({
        success: true,
    });
});

module.exports = router;