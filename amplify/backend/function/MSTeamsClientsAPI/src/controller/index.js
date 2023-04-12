const clientModel = require("../model/clientModel");

const teamsWrapper = require("../teams");

const {
  CommunicationIdentityClient,
} = require("@azure/communication-identity");
const { PublicClientApplication, CryptoProvider } = require("@azure/msal-node");
const clientId = "8c66d292-dabb-46dc-986a-f95fe55ad3cc";
const tenantId = "b0a714c6-6ab2-43b2-aae0-5e855bb3752f";
const REDIRECT_URI = `https://dbzegnu5lj.execute-api.us-east-1.amazonaws.com/develop/teams/acs/redirect`;

// Create configuration object that will be passed to MSAL instance on creation.
const msalConfig = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  },
};

// Create an instance of PublicClientApplication
const pca = new PublicClientApplication(msalConfig);
const provider = new CryptoProvider();

let pkceVerifier = "";
const scopes = [
  "https://auth.msft.communication.azure.com/Teams.ManageCalls",
  "https://auth.msft.communication.azure.com/Teams.ManageChats",
];

const clientController = {
  init: async (req, res) => {
    try {
      const { clientID } = req.body;
      let result = {
        clientInfo: {},
        clientValidated: false,
        clientID,
        clientConfigurations: {},
        clientUsers: [],
      };
      result.clientInfo = await clientModel.getClient(clientID);
      if (result.clientInfo.data && result.clientInfo.data.getClientSignup.id) {
        result.clientConfigurations = await clientModel.getClientConfigurations(
          clientID
        );
      }
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUsersFromGraphAPI: async (req, res) => {
    try {
      const { tenantID, displayName } = req.body;
      const msTeams = new teamsWrapper();
      const result = await msTeams.getUsers(tenantID, displayName);
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
  teamsLogin: async (req, res) => {
    // Generate PKCE Codes before starting the authorization flow
    const { verifier, challenge } = await provider.generatePkceCodes();
    pkceVerifier = verifier;

    const authCodeUrlParameters = {
      scopes: scopes,
      redirectUri: REDIRECT_URI,
      codeChallenge: challenge,
      codeChallengeMethod: "S256",
    };
    // Get url to sign user in and consent to scopes needed for application
    pca
      .getAuthCodeUrl(authCodeUrlParameters)
      .then((response) => {
        res.redirect(response);
      })
      .catch((error) => console.log(JSON.stringify(error)));
  },
  getACSToken: async (req, res) => {
    // Create request parameters object for acquiring the AAD token and object ID of a Teams user
    const tokenRequest = {
      code: req.query.code,
      scopes: scopes,
      redirectUri: REDIRECT_URI,
      codeVerifier: pkceVerifier,
    };
    // Retrieve the AAD token and object ID of a Teams user
    pca
      .acquireTokenByCode(tokenRequest)
      .then(async (response) => {
        console.log("Response:", response);
        let teamsUserAadToken = response.accessToken;
        let userObjectId = response.uniqueId;
        // This code demonstrates how to fetch your connection string
        // from an environment variable.
        const connectionString =
          "endpoint=https://presolved-acs.communication.azure.com/;accesskey=YB0OzlCjvpyF9PBKVZBzThzj/Cd33uIrutjAmBvSzH3UkRzH27U7b8y2+7s9zBYKg3iOdlH/vj+1NIaBWbzi4A==";

        // Instantiate the identity client
        const identityClient = new CommunicationIdentityClient(
          connectionString
        );

        //Exchange the Azure AD access token of the Teams User for a Communication Identity access token
        let accessToken = await identityClient.getTokenForTeamsUser({
          teamsUserAadToken: teamsUserAadToken,
          clientId: clientId,
          userObjectId: userObjectId,
        });
        console.log("Token:", accessToken);
        res.status(200).json({ accessToken });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
  },
};

module.exports = clientController;
