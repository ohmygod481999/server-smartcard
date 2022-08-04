const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const { storage, registration, agency, wallet, cv } = require("./routes");
const { consumerListener } = require("./consumer");

consumerListener();

const app = express();
// middleware
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: true,
    })
);
app.use(morgan("tiny"));

app.disable("x-powered-by");
// routes
app.use("/storage", storage);
app.use("/registration", registration);
app.use("/agency", agency);
app.use("/wallet", wallet);
app.use("/cv", cv);
// error handler
app.use((err, req, res, next) => {
    if (err) {
        console.error(err.message);
        console.error(err.stack);
        return res.status(err.output.statusCode | 500).json(err.output.payload);
    }
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
