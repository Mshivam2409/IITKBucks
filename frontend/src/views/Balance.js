/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import NotificationAlert from "react-notification-alert";
// reactstrap components
import {
  Alert,
  UncontrolledAlert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

class Typography extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PublicKey: "",
    };
  }

  setKey = (key) => {
    this.setState({
      PublicKey: key,
    });
  };

  PublicKeyChoosen = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      this.setState({
        PublicKey: text,
      });
    };
    reader.readAsText(e.target.files[0]);
  };

  notifySuccess = (balance) => {
    var type;
    type = "success";
    var options = {};
    options = {
      place: "bl",
      message: (
        <div>
          <div>
            Your Balance is <b>{balance}</b> .
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-money-coins",
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
  };

  notifyFailure = () => {
    var type;
    type = "danger";
    var options = {};
    options = {
      place: "bl",
      message: (
        <div>
          <div>
            <b>ERROR FETCHING BALANCE USER NOT FOUND</b>
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-money-coins",
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  fetchBalance = async (method) => {
    try {
      const response = await fetch("/balance", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          [method]: unescape(document.getElementById([method]).value),
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.notifyFailure();
        throw new Error(responseData.message);
      }
      this.notifySuccess(responseData.Balance);
    } catch (err) {
      console.log(err);
    }
  };

  fetchBalanceKey = async () => {
    try {
      const response = await fetch("/balance", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          publicKey: this.state.PublicKey,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        this.notifyFailure();
        throw new Error(responseData.message);
      }
      this.notifySuccess(responseData.Balance);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <div className="content">
          <Row>
            <Col md="6">
              <Card>
                <CardHeader>
                  <h5 className="title">Using Alias</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1">
                        <FormGroup>
                          <label>Alias</label>
                          <Input
                            defaultValue=""
                            placeholder="alias"
                            type="text"
                            id="alias"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row></Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button
                    className="btn-fill"
                    color="primary"
                    type="submit"
                    onClick={async () => {
                      await this.fetchBalance("alias");
                    }}
                  >
                    CHECK
                  </Button>
                </CardFooter>
              </Card>
            </Col>
            <Col md="6">
              <Card>
                <CardHeader>
                  <h5 className="title">Using Public Key</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Input
                            cols="160"
                            placeholder="Enter your Public Key"
                            rows="10"
                            type="textarea"
                            id="publicKey"
                            accept="*"
                            type="file"
                            onChange={this.PublicKeyChoosen.bind(this)}
                          />
                          <label htmlFor="publicKey">
                            <Button
                              className="btn-fill"
                              color="primary"
                              type="submit"
                              onClick={async () => {}}
                            >
                              UPLOAD PUBLIC KEY
                            </Button>
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <Button
                    className="btn-fill"
                    color="primary"
                    type="submit"
                    onClick={async () => {
                      await this.fetchBalanceKey();
                    }}
                  >
                    CHECK
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Typography;
