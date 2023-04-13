import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Result,
  Row,
  Space,
  Typography,
  Divider,
  Steps,
  notification,
  Modal,
} from "antd";
import {
  RightOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import MicrosoftLogin from "react-microsoft-login";
import "./teamsIntegration.less";
import bgimg from "../assets/images/icons/teams144.svg";
import TeamsIcon from "../assets/images/icons/teams.png";
import attn from "../assets/images/empty-expense-card.png";
import { updateConsent, updateLoginWithMS } from "../api";
import { redirectTo } from "@gatsbyjs/reach-router";
import { useDispatch } from "react-redux";
import { updateClientConfig } from "../../store/reducers/client";
import { useSelector } from "react-redux";
///https://localhost:3000/teams-integration/?admin_consent=True&tenant=69ecaa9a-f38c-4f7b-9b2f-1108dfe74b8f
const TeamsIntegration = (props) => {
  let client = useSelector((state) => state.client);

  const consetVerified =
    (props.location.search.includes("admin_consent=True") &&
      props.location.search.includes(`tenant=${client.config.mstenantId}`)) ||
    false;

  const [state, setState] = useState({
    isLoaded: false,
    clientId: null,
    tenantId: client.config.mstenantId || undefined,
    consetVerified: consetVerified,
    consentMS: client.config.consentMS || 0,
  });

  if (state.consetVerified && client.config.consentMS === 0) {
    updateConsent({
      id: client.config.id,
      consentMS: 1,
      loginMS: 1,
      tenantId: client.id,
      mstenantId: client.config.mstenantId,
      attributes: client.config.attributes,
    });
  }

  const [current, setCurrent] = useState(0);
  const updateTenantId = (tenantId) => {
    setState({ ...state, tenantId });
  };
  const onChange = (value) => {
    console.log("onChange:", value);
    if (value === 1) {
      if (client.config.tenantId) {
        setCurrent(value);
      } else {
        notification.error({
          message: "Error",
          description: "Please complete the step 1 first.",
        });
      }
    }
    if (value === 2) {
      if (client.config.consentMS > 0) {
        setCurrent(value);
      } else {
        notification.error({
          message: "Error",
          description: "Please complete the step 2 first.",
        });
      }
    }
    if (value === 0) {
      setCurrent(0);
    }
  };
  useEffect(() => {
    if (client.clientId) {
      setState({
        ...state,
        isLoaded: true,
        clientId: client.clientId,
        ...client,
      });
    }
  }, []);
  useEffect(() => {
    setState({
      ...state,
      clientId: client.config.clientId,
      tenantId: client.config.tenantId,
      consentMS: client.config.consentMS,
    });
  }, [client.config]);

  return (
    <div className="content-container">
      <div className="teamsIntegration">
        <Row className="breadcrumb-container">
          <Col span={24}>
            <Breadcrumb>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>Teams Integration</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row className="greetings-container">
          <Col span={24}>
            <Card
              className="greetings-card"
              bordered={false}
              style={{ backgroundImage: `url('${bgimg}')` }}
            >
              <Card.Meta title="Microsoft Teams Integration" />
              <Card.Meta description="complete the integration in just 2 steps" />
            </Card>
          </Col>
        </Row>

        <Row className="steps-container">
          <Col span={24}>
            <Card>
              <Steps
                onChange={onChange}
                type="navigation"
                current={current}
                items={[
                  {
                    title: (
                      <Typography.Text strong>
                        Login With Microsoft
                      </Typography.Text>
                    ),
                    description: "Step 1 - Do not refresh or click back",
                  },
                  {
                    title: (
                      <Typography.Text strong>Get Consent</Typography.Text>
                    ),
                    subTitle: "Do not refresh or click back ",
                    description: "Step 2 -  Do not refresh or click back",
                  },
                  {
                    title: "Completed",
                    description:
                      "This is a description. This is a description.",
                  },
                ]}
              />
              {current === 0 && (
                <LoginWithMSWidget client={client} setCurrent={setCurrent} />
              )}
              {current === 1 && (
                <GetConsent
                  client={client}
                  setCurrent={setCurrent}
                  state={state}
                />
              )}
              {current === 2 && <CompletedMessage />}
            </Card>
          </Col>
        </Row>

        <div style={{ margin: "50px 0" }}>&nbsp;</div>
      </div>
    </div>
  );
};

export default TeamsIntegration;

const LoginWithMSWidget = ({ client, setCurrent }) => {
  const [showNext, setShowNext] = useState(
    client.config.tenantId ? true : false
  );
  const dispatch = useDispatch();
  const authCallback = (err, data) => {
    if (data.tenantId) {
      let clientIntegration = {
        tenantId: client.id,
        mstenantId: data.tenantId,
        loginMS: 1,
        consentMS: 0,
        attributes: JSON.stringify(data),
      };
      console.log("clientIntegration", clientIntegration);
      updateLoginWithMS(clientIntegration)
        .then((response) => {
          notification.success({
            message: "Success",
            description: "Client integration updated successfully.",
          });
          dispatch(updateClientConfig(response));
          setShowNext(true);
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description: error.message,
          });
        });
    } else {
      notification.error({
        message: "Error",
        description:
          "Something went wrong while authenticating with Microsoft.",
      });
    }
  };
  return (
    <div className="login-with-ms-widget">
      <Row>
        <Col span={24}>
          <Card
            bordered={false}
            actions={[
              showNext && (
                <Button
                  size="large"
                  icon={<RightOutlined />}
                  type="primary"
                  onClick={() => setCurrent(1)}
                >
                  Next
                </Button>
              ),
            ]}
          >
            {!showNext ? (
              <div>
                <Typography.Title
                  style={{ margin: "30px 0" }}
                  level={4}
                  type="secondary"
                >
                  Hi, {client.name} Kinldy signin with microsoft to accquire the
                  tokens for the integration with Microsoft Teams.
                </Typography.Title>
                {/* client.clientId */}
                <MicrosoftLogin
                  clientId="35a2ff7a-28a5-466d-9f84-1cefbe80c187"
                  authCallback={authCallback}
                  redirectUri="https://localhost:3000"
                />
              </div>
            ) : (
              <Alert
                message="Login with Microsoft is successfully configured."
                description="Congrats you chave completed the step 1, we have accquired few of the tokens and permissions. You can now proceed to the next step."
                type="success"
                showIcon
                banner
                role="alert"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const GetConsent = ({ client, state, setCurrent }) => {
  const [showNext, setShowNext] = useState(
    client.config.consentMS > 0 ? true : false
  );
  const { tenantId } = state;

  const redirectToConsent = () => {
    Modal.confirm({
      title: "Are you sure you want to redirect to the consent page?",
      content:
        "You will be redirected to the consent page to get the consent from the user to access the data.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        window.location.href = `https://login.microsoftonline.com/${
          client.config.mstenantId || tenantId
        }/adminConsent?client_id=35a2ff7a-28a5-466d-9f84-1cefbe80c187&redirect_uri=https://localhost:3000/teams-integration/`;
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className="login-with-ms-widget">
      <Row>
        <Col span={24}>
          <Card
            bordered={false}
            actions={[
              showNext && (
                <Button
                  size="large"
                  icon={<RightOutlined />}
                  type="primary"
                  onClick={() => setCurrent(2)}
                >
                  Next
                </Button>
              ),
            ]}
          >
            {!showNext ? (
              <div>
                <Typography.Title
                  style={{ margin: "30px 0" }}
                  level={4}
                  type="secondary"
                >
                  Almost There.
                </Typography.Title>
                <Typography.Title level={5} type="secondary">
                  You are all set. We have accquired the tokens and permissions.
                  Now we need to get the consent from the user to access the
                  data.
                </Typography.Title>
                {/* client.clientId */}
                <Button
                  type="default"
                  size="large"
                  style={{ margin: "30px 0" }}
                  onClick={() => redirectToConsent()}
                >
                  <Space align="start">
                    <img src={bgimg} height={30} />
                    <span>Get Consent</span>
                  </Space>
                </Button>
              </div>
            ) : (
              <Alert
                message="You have successfully completed the integration."
                description="Congrats you chave completed the step 1, we have accquired few of the tokens and permissions. You can now proceed to the next step."
                type="success"
                showIcon
                banner
                role="alert"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const CompletedMessage = () => {
  return (
    <Row style={{ margin: "50px 0" }}>
      <Col span={24}>
        <Card bordered={false}>
          <Result
            status="success"
            title="Successfully Completed the Integration"
            subTitle="You have successfully completed the integration with Microsoft Teams."
          />
        </Card>
      </Col>
    </Row>
  );
};
