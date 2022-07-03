const express = require("express");
const { ory } = require("./ory");
const _ = require("lodash");

const router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body);

    const { flowId, data, myData } = req.body;

    const cookies = Object.keys(req.cookies).map(key => `${key}=${req.cookies[key]}`)
    const cookiesString = cookies.join(";")

    try {
        // const registRes = await ory.submitSelfServiceRegistrationFlow(flowId, data, "csrf_token_806060ca5bf70dff3caa0e5c860002aade9d470a5a4dce73bcfa7ba10778f481=TS7+yf9wv3Eumvg2i31X7aRh0mwTsEziY2Ck3XOkxj0=");
        const registRes = await ory.submitSelfServiceRegistrationFlow(
            flowId,
            data,
            cookiesString
        );

        console.log(
            "This is the user session: ",
            registRes.data,
            registRes.data.identity
        );

        res.statusCode(registRes.status).json({
            success: registRes,
        });
    } catch (error) {
        console.log(_.get(error, "response.data.ui.messages"));
        res.json({
            error: error.response.data,
        });
    }
});

module.exports = router;
