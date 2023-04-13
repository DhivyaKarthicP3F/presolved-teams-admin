const clientController = require("../controller");

const Routes = (app) => {
  app.get("/teams/init", clientController.init);
  app.post(
    "/teams/getUsersFromGraphAPI",
    clientController.getUsersFromGraphAPI
  );
  app.get("/teams/acs/", clientController.teamsLogin);
  app.get("/teams/acs/redirect", clientController.getACSToken);
};

module.exports = Routes;
