import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Router } from "@gatsbyjs/reach-router";
import { Amplify, Auth } from "aws-amplify";
import oldAwsConfig from "./aws-exports";
import Suspence from "./widgets/suspence";
import { Provider } from "react-redux";
import { store } from "./store";

import AppGlobal from "./widgets/global";
import { globalTheme } from "./globals/style";
import { ConfigProvider, theme } from "antd";

import SuperAdminIndexPage from "./super-admin/index";

const AdminPage = React.lazy(() => import("./admin/index"));
const ClientSignupPage = React.lazy(() => import("./signup"));
const root = document.getElementById("root");
Amplify.configure(oldAwsConfig);
Amplify.Logger.LOG_LEVEL = "INFO";
//Configure Amplify to use ID Token for Cognito instead of Access Token
Amplify.configure({
  API: {
    graphql_headers: async () => {
      const session = await Auth.currentSession();
      return {
        Authorization: session.getIdToken().getJwtToken(),
      };
    },
  },
});

new AppGlobal();

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Suspence />}>
      <ConfigProvider
        theme={{ algorithm: theme.defaultAlgorithm, token: globalTheme.token }}
        prefixCls={globalTheme.prefixCls}
      >
        <Router basepath="/">
          <AdminPage path="/*" />
          <ClientSignupPage path="/signup/*" />
          <SuperAdminIndexPage path="/admin/*" />
        </Router>
      </ConfigProvider>
    </Suspense>
  </Provider>,
  root
);
