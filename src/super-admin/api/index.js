import { API } from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

export const getClientIntegration = async (clientId) => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: queries.listClientIntergrations,
        variables: {
          tenantId: clientId,
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

export const getClientSignupUserList = async () => {
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: queries.listClientSignups,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        getClientSignupUserList: error,
      });
      reject(error);
    }
  });
};

export const createSignup = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("data", data);
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
          // create client users if signup is successful
          console.log({ createSignup: response.data });
          createClientIntergrations({
            tenantId: data.tenantId
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
        createClientUser: error,
      });
      reject(error);
    }
  });
};

export const createClientIntergrations = async (data) => {
  console.log('createClientIntergrations', 'tenantId', data.tenantId)
  return new Promise((resolve, reject) => {
    try {
      API.graphql({
        query: mutations.createClientIntergrations,
        variables: {
          input: {
            id: undefined,
            tenantId: data.tenantId,
            mstenantId: 'null',
            loginMS: 0,
            consentMS: 0,
            attributes: "{}",
          },
        },
      })
        .then((response) => {
          console.log({ createClientIntergrations: response.data });
          resolve(response.data);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      console.error({
        createClientIntergrations: error,
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
