const GRAPHQL_ENDPOINT = "https://fo5bad5dvvftlgb5cm4ih3dnce.appsync-api.us-east-1.amazonaws.com/graphql"
const GRAPHQL_API_KEY = "da2-vlztb4vfubdzhi7h4quuauoxqu"
const clientModel = {

    getClient: async (clientID) => {
        try {
            let variables = {
                id: clientID
            };
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": GRAPHQL_API_KEY,
                },
                body: JSON.stringify({ query: getClientSignup, variables }),
            };
            let getClientSignupRequest = new Request(GRAPHQL_ENDPOINT, options);
            let response = await fetch(getClientSignupRequest);
            let json = await response.json();
            return (json);
        } catch (error) {
            console.error({ getClient: error, clientID });
            throw ({ getClient: error })
        }
    },
    getClientConfigurations: async (clientID) => {
        try {
            let variables = {
                input: {
                    filter: {
                        tenantID: {
                            eq: clientID
                        }
                    }
                }
            };
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": GRAPHQL_API_KEY,
                },
                body: JSON.stringify({ query: listClientIntergrations, variables }),
            };
            let listClientIntergrationsRequest = new Request(GRAPHQL_ENDPOINT, options);
            let response = await fetch(listClientIntergrationsRequest);
            let json = await response.json();
            return (json);

        }
        catch (error) {
            console.error({ getClientConfigurations: error, clientID });
            throw ({ getClientConfigurations: error })
        }

    },


}

module.exports = clientModel;





const getClientSignup = /* GraphQL */ `
query GetClientSignup($id: ID!) {
  getClientSignup(id: $id) {
    id
    name
    email
    phone
    company
    address
    city
    state
    zip
    country
    createdAt
    updatedAt
  }
}
`;
const listClientIntergrations = /* GraphQL */ `
  query ListClientIntergrations(
    $filter: ModelClientIntergrationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientIntergrations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tenantId
        mstenantId
        loginMS
        consentMS
        attributes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;