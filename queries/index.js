const { gql } = require("graphql-request");

exports.INSERT_ACCOUNT_MUTATION = gql`
    mutation insertAccount($ory_id: uuid!, $referer_id: Int) {
        insert_account(objects: { ory_id: $ory_id, referer_id: $referer_id }) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

exports.CONNECT_ACCONT_TO_CARD_MUTATION = gql`
    mutation updateCard($card_id: Int!, $account_id: Int!) {
        update_card(
            where: { id: { _eq: $card_id } }
            _set: { account_id: $account_id }
        ) {
            affected_rows
        }
    }
`;

exports.CREATE_WALLET_MUTATION = gql`
    mutation createWallet($account_id: Int!, $wallet_type: Int!) {
        insert_wallet(
            objects: { account_id: $account_id, type: $wallet_type }
        ) {
            returning {
                id
            }
        }
    }
`;

exports.GET_ACCOUNT_BY_ID_QUERY = gql`
    query getAccount($account_id: Int!) {
        account_by_pk(id: $account_id) {
            id
        }
    }
`;
