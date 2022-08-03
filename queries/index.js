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
        insert_user_cv(objects: {
              path: $path, 
              account_id:$account_id 
        }) { returning {path} }
}`;

exports.DELETE_CV_MUTATION = gql`
    mutation DeleteCV($account_id: Int!) {
    delete_user_cv_by_pk (
        account_id: $account_id
    ) {
      id
      account_id
    }
  }
`



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

exports.GET_CV_BY_ACCOUNT_ID = gql`
    query MyQuery ($account_id: Int!) {
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
