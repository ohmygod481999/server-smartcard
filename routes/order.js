const express = require("express");
const { graphQLClient } = require("../graphql-client");
const {
    GET_ORDER_BY_ID,
    GET_WALLETS_BY_ACCOUNT_ID,
    UPDATE_STATUS_ORDER,
    UPDATE_AMOUNT_WALLET,
    INSERT_TRANSACTION,
} = require("../queries");
const {
    ORDER_STATUS,
    PAYMENT_TYPE,
    TRANSACTION_TYPE,
} = require("../constants");
const { getWalletFromWallets, getCurrentTime } = require("../utils");
const { ROOT_WALLET_ID } = require("../config");

const router = express.Router();

router.post("/approve", async (req, res) => {
    console.log(req.body);

    const { order_id } = req.body;

    const orderRes = await graphQLClient.request(GET_ORDER_BY_ID, {
        order_id: order_id,
    });

    const order = orderRes.order_by_pk;

    if (!order) {
        res.status(400);
        res.json({
            success: false,
            message: "order is not exist",
        });
        return;
    }
    if (order.status === ORDER_STATUS.APPROVE) {
        res.status(400);
        res.json({
            success: false,
            message: "order has already approve",
        });
        return;
    }

    const {
        id,
        status,
        agency_id,
        customer_name,
        customer_address,
        customer_phone,
        order_items,
        payment_type,
        shipping_type,
    } = order;

    let totalPrice = 0;
    order_items.forEach((item) => {
        const { product, quantity } = item;
        totalPrice += product.price * quantity;
    });

    console.log("totalPrice", totalPrice);

    const updateStatusRes = await graphQLClient.request(UPDATE_STATUS_ORDER, {
        order_id,
        status: ORDER_STATUS.APPROVE,
    });

    if (payment_type === PAYMENT_TYPE.SMARTCARD_WALLET) {
        // get wallet
        const walletRes = await graphQLClient.request(
            GET_WALLETS_BY_ACCOUNT_ID,
            {
                account_id: agency_id,
            }
        );

        const wallets = walletRes.wallet;
        const { mainWallet, secondaryWallet } = getWalletFromWallets(wallets);

        const amountWallet = mainWallet.amount;
        let amountWalletToPay = 0;
        if (amountWallet - 50000 >= totalPrice) {
            amountWalletToPay = totalPrice;
        } else {
            amountWalletToPay = Math.max(amountWallet - 50000, 0);
        }

        const remainAmountWallet = amountWallet - amountWalletToPay;
        console.log("remainAmountWallet", remainAmountWallet);

        if (remainAmountWallet !== amountWallet) {
            const updateAmountRes = graphQLClient.request(
                UPDATE_AMOUNT_WALLET,
                {
                    wallet_id: mainWallet.id,
                    amount: remainAmountWallet,
                }
            );

            // Create wallet transaction
            const insertTransactionRes = await graphQLClient.request(
                INSERT_TRANSACTION,
                {
                    amount: amountWalletToPay,
                    date: getCurrentTime(),
                    from_wallet_id: mainWallet.id,
                    wallet_id: parseInt(ROOT_WALLET_ID),
                    type: TRANSACTION_TYPE.PLACE_ORDER,
                }
            );
        }
    }

    res.json({
        success: true,
        message: "success",
    });
});

module.exports = router;
