const express = require("express");
const { REGISTRATION_TYPE } = require("../constants");
const { graphQLClient } = require("../graphql-client");
const {
    GET_REGISTRAION_QUERY,
    APPROVE_REGISTRATION_MUTATION,
    INSERT_REGISTRATION,
    GET_WALLETS_BY_ACCOUNT_ID,
    GET_WITHDRAW_REGISTRATION_BY_ACCOUNT_ID,
} = require("../queries");
const { useQueue } = require("../queue");
const { getCurrentTime, getWalletFromWallets } = require("../utils");

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
        approved_at: getCurrentTime(),
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
                date: getCurrentTime(),
            })
        )
    );

    res.json({
        success: true,
    });
});

router.post("/withdraw", async (req, res) => {
    const { account_id, amount } = req.body;

    // get prev registration
    const unapprovedRegsRes = await graphQLClient.request(
        GET_WITHDRAW_REGISTRATION_BY_ACCOUNT_ID,
        {
            account_id: account_id,
            approved: false,
        }
    );

    console.log(unapprovedRegsRes)

    const unapprovedRegs = unapprovedRegsRes.registration;

    if (unapprovedRegs.length > 0) {
        res.json({
            success: false,
            message:
                "Bạn đang có một lệnh rút đang xử lý, vui lòng đợi chúng tôi xử lý xong để tiếp tục rút tiền",
        });
        return;
    }

    // get wallet
    const walletRes = await graphQLClient.request(GET_WALLETS_BY_ACCOUNT_ID, {
        account_id: account_id,
    });

    const wallets = walletRes.wallet;
    const { mainWallet, secondaryWallet } = getWalletFromWallets(wallets);

    // validation

    if (isNaN(amount)) {
        res.json({
            success: false,
            message: "Số tiền rút không hợp lệ",
        });
        return;
    }
    if (amount > mainWallet.amount) {
        res.json({
            success: false,
            message: "Số tiền rút lớn hơn số dư trong ví, vui lòng thử lại",
        });
        return;
    }
    if (amount < 50000) {
        res.json({
            success: false,
            message: "Số tiền rút tối thiểu là 50,000đ",
        });
        return;
    }
    if (mainWallet.amount - amount < 50000) {
        res.json({
            success: false,
            message: "Số tiền còn lại trong ví tối thiểu là 50,000đ",
        });
        return;
    }

    // insert registration
    const registrationRes = await graphQLClient.request(INSERT_REGISTRATION, {
        account_id: account_id,
        type: REGISTRATION_TYPE.WITHDRAW,
        payload: {
            amount: amount,
        },
    });

    res.json({
        success: "true",
        message: "Thành công",
        data: {
            id: registrationRes.insert_registration_one.id,
        },
    });
});

module.exports = router;
