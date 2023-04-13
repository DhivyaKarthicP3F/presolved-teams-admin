import { API } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";



export const getGroupsUsers = async (tenantID) => {
    return new Promise((resolve, reject) => {
        try {
            const query = groupsUsersQuery(tenantID);
            API.graphql({
                query: query,
                variables: {
                    filter: {
                        tenantId: {
                            eq: tenantID
                        }
                    }
                }
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    console.error({
                        getGroupsUsers: error,
                    });
                    throw error;
                });

        }
        catch (error) {

        }
    })
}

export const createNewGroupAPI = async (input) => {
    return new Promise((resolve, reject) => {
        try {
            API.graphql({
                query: mutations.createClientUsersGroup,
                variables: {
                    input: input
                }
            }).then((response) => {
                resolve(response.data.createClientUsersGroup);
            }).catch((error) => {
                throw ({
                    createNewGroupAPI: error,
                });
            });
        }
        catch (error) {
            console.error({ error });
        }
    })
}

export const deleteUserFromGroupAPI = async (input) => {
    return new Promise((resolve, reject) => {
        try {
            API.graphql({
                query: mutations.deleteClientUserWhitelisting,
                variables: input                
            }).then((response) => {
                resolve(response.data.deleteClientUsersGroupUser);
            }).catch((error) => {
                throw ({
                    deleteUserFromGroupAPI: error,
                });
            });
        }
        catch (error) {
            console.error({ error });
        }
    })
}






const groupsUsersQuery = (id) => `query MyQuery {
    listClientUsersGroups(filter: {tenantId: {eq: "${id}"}}) {
      items {
        createdAt
        description
        id
        name
        tenantId
        updatedAt
        users {
          items {
            id
            displayName
            jobTitle
            mail
            mobilePhone
            officeLocation
            preferredLanguage
            surname
            tenantId
            uid
            updatedAt
            userPrincipalName
          }
        }
      }
    }
  }`