const express = require("express");
const amqp = require("amqplib/callback_api");
const { getParents, getChildren } = require("./db-queries");
const { graphQLClient } = require("./graphql-client");
const {
    GET_REGISTRAION_QUERY,
    APPROVE_REGISTRATION_MUTATION,
    APPROVE_AGENCY_MUTATION,
} = require("./queries");
const { useQueue } = require("./queue");

const router = express.Router();

router.post("/approve", useQueue, async (req, res) => {
    const { amqpChannel } = req;
    console.log(req.body);

    const { registrationId } = req.body;

    const registrationRes = await graphQLClient.request(GET_REGISTRAION_QUERY, {
        registration_id: registrationId,
    });

    const registration = registrationRes.registration_by_pk;

    if (!registration || registration.type !== 0) {
        res.json({
            success: false,
            message:
                "Registration is not exist or registration type doesn't match",
        });
        return;
    }

    const { id, account_id, type, approved, created_at } = registration;

    // if (approved) {
    //     res.status(400);
    //     res.json({
    //         success: false,
    //         message: "This registration has already approved",
    //     });
    //     return;
    // }

    await Promise.all([
        graphQLClient.request(APPROVE_REGISTRATION_MUTATION, {
            registration_id: registrationId,
        }),
        graphQLClient.request(APPROVE_AGENCY_MUTATION, {
            account_id: account_id,
        }),
    ]);

    const parents = await getParents(account_id);

    parents.forEach((parent, i) => {
        const { id, name, referer_id, is_agency } = parent;

        if (i === 0) {
            // i = 0 means this account (id === account_id)
            return;
        }

        if (is_agency) {
            // neu la nguoi gioi thieu truc tiep hoac nguoi do la agency thi thuong?
            amqpChannel.sendToQueue(
                "transaction",
                Buffer.from(
                    JSON.stringify({
                        account_id: id,
                        transaction_type: 2, // 2: refer for agency
                        payload: {
                            level: i - 1,
                            is_agency,
                        },
                        date: new Date(),
                    })
                )
            );
        }
    });

    res.json({
        success: true,
    });
});

router.get("/children", async (req, res) => {
    const { user_id } = req.body;
    const children = await getChildren(user_id);

    res.json({
        success: true,
        data: children,
    });
});

module.exports = router;
