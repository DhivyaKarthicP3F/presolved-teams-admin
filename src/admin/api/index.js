import { API } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

export const getClientIntegration = async (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: queries.listClientIntergrations,
        variables: {
          filter: {
            tenantId: {
              eq: clientId,
            },
          },
        },
      })
        .then((response) => {
          resolve(response.data.listClientIntergrations.items[0]);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        getClientIntegration: error,
      });
      reject(error);
    }
  });
};

export const updateLoginWithMS = async (clientIntegration) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.createClientIntergrations,
        variables: {
          input: clientIntegration,
        },
      })
        .then((response) => {
          resolve(response.data.createClientIntergrations);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        updateClientIntegration: error,
      });
      reject(error);
    }
  });
};

export const updateConsent = async (clientIntegration) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.updateClientIntergrations,
        variables: {
          input: clientIntegration,
        },
      })
        .then((response) => {
          resolve(response.data.updateClientIntergrations);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        updateClientIntegration: error,
      });
      reject(error);
    }
  });
};

export const addUserWhiteListing = async (user) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.createClientUserWhitelisting,
        variables: {
          input: user,
        },
      })
        .then((response) => {
          resolve(response.data.createClientUserWhitelisting);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        addUserWhiteListing: error,
      });
      reject(error);
    }
  });
};

export const getUsersWhiteListing = async (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: queries.listClientUserWhitelistings,
        variables: {
          filter: {
            tenantId: {
              eq: clientId,
            },
          },
        },
      })
        .then((response) => {
          resolve(response.data.listClientUserWhitelistings.items);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        getUsersWhiteListing: error,
      });
      reject(error);
    }
  });
};

export const getClientUsersList = async (tenantId) => {

  const variables = {
    filter: {
      tenantId: {
        eq: tenantId
      }
    }
  };
 
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: queries.listClientUsers,
        variables: variables 
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        getClientUsersList: error,
      });
      reject(error);
    }
  });
};

export const createSignup = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      let createSignupData = {
        ...data,
        role: undefined,
        address: " ",
        city: " ",
        state: " ",
        zip: " ",
        country: " ",
      };
      console.log("createSignupData", createSignupData);
      API.graphql({
        query: mutations.createClientSignup,
        variables: { input: createSignupData },
      })
        .then((response) => {
          // create client users if signup is successful
          console.log({ createSignup: response.data });
          createClientUser({
            ...data,
            id: undefined,
            tenantId: response.data.createClientSignup.id,
            company: undefined,
            phone: undefined,
          })
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        createSignup: error,
      });
      reject(error);
    }
  });
};

export const createClientUser = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.createClientUsers,
        variables: {
          input: {
            ...data,
            status: 1,
          },
        },
      })
        .then((response) => {
          console.log({ createClientUser: response.data });
          resolve(response.data);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        createClientUser: error,
      });
      reject(error);
    }
  });
};

export const updateClientUser = async (updateDetails) => {

  
  const variables = {
    input:{
      id:updateDetails.id,
      role: updateDetails.role,
      status: updateDetails.isDisable?0:1
    },
  };

  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.updateClientUsers,
        variables: variables
      })
        .then((response) => {
          resolve(response.data.updateClientIntergrations);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        updateClientIntegration: error,
      });
      reject(error);
    }
  });
};

