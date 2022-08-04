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

exports.CREATE_CV_MUTATION = gql`
    mutation CreateCV($account_id: Int!, $path: String) {
        insert_user_cv(objects: { path: $path, account_id: $account_id }) {
            returning {
                path
            }
        }
    }
`;

exports.DELETE_CV_MUTATION = gql`
    mutation DeleteCV($account_id: Int!) {
        delete_user_cv_by_pk(account_id: $account_id) {
            id
            account_id
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

exports.GET_WALLETS_BY_ACCOUNT_ID = gql`
    query getWalletsByAccountId($account_id: Int!) {
        wallet(where: { account_id: { _eq: $account_id } }) {
            id
            amount
            type
            created_at
        }
    }
`;

exports.UPDATE_AMOUNT_WALLET = gql`
    mutation updateAmountWallet($wallet_id: Int!, $amount: numeric!) {
        update_wallet_by_pk(
            pk_columns: { id: $wallet_id }
            _set: { amount: $amount }
        ) {
            id
            amount
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

exports.GET_CV_BY_ACCOUNT_ID = gql`
    query MyQuery($account_id: Int!) {
        user_cv_by_pk(account_id: $account_id) {
            path
        }
    }
`;

exports.GET_REGISTRAION_QUERY = gql`
    query getRegistrationByID($registration_id: Int!) {
        registration_by_pk(id: $registration_id) {
            id
            account_id
            type
            approved
            created_at
            payload
        }
    }
`;

exports.APPROVE_REGISTRATION_MUTATION = gql`
    mutation approveRegistration($registration_id: Int!) {
        update_registration_by_pk(
            pk_columns: { id: $registration_id }
            _set: { approved: true }
        ) {
            id
            approved
        }
    }
`;

exports.APPROVE_AGENCY_MUTATION = gql`
    mutation approveAgency($account_id: Int!) {
        update_account_by_pk(
            pk_columns: { id: $account_id }
            _set: { is_agency: true }
        ) {
            id
            is_agency
        }
    }
`;

exports.GET_ORDER_BY_ID = gql`
    query getOrderById($order_id: Int!) {
        order_by_pk(id: $order_id) {
            id
            agency_id
            customer_name
            customer_address
            customer_phone
            status
            payment_type
            shipping_type
            order_items {
                id
                product {
                    id
                    name
                    price
                }
                quantity
            }
        }
    }
`;

exports.UPDATE_STATUS_ORDER = gql`
    mutation updateStatusOrder($order_id: Int!, $status: Int!) {
        update_order_by_pk(
            pk_columns: { id: $order_id }
            _set: { status: $status }
        ) {
            id
            status
        }
    }
`;

exports.INSERT_TRANSACTION = gql`
    mutation insertTransaction(
        $type: Int!
        $amount: numeric!
        $date: timestamp!
        $from_wallet_id: Int!
        $wallet_id: Int!
    ) {
        insert_transaction_one(
            object: {
                type: $type
                amount: $amount
                date: $date
                from_wallet_id: $from_wallet_id
                wallet_id: $wallet_id
            }
        ) {
            id
        }
    }
`;
