const { GraphQLClient, gql } = require("graphql-request");
const { HASURA_ENDPOINT } = require("./config");

// const endpoint = "https://hasura.smartcardnp.vn/v1/graphql";
exports.graphQLClient = new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
        "content-type": "application/json",
        // "x-hasura-admin-secret":
        //     "MJj7ZvOcOnNrca5DQBRQf6Eq5RAAUIWsWSK2ju2eBseBbffMzKrMCgeMtfM3ncKF",
    },
    timeout: 10000,
});
