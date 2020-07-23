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
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Form,
  CardFooter,
} from "reactstrap";

// core components

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      PrivateKey: "",
      PublicKey: "",
      numOutput: 0,
      transData: [],
    };
  }

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

  PrivateKeyChoosen = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      this.setState({
        PrivateKey: text,
      });
    };
    reader.readAsText(e.target.files[0]);
  };

  setBgChartData = (name) => {
    this.setState({
      bigChartData: name,
    });
  };

  initTransaction = async () => {
    this.setState(
      {
        numOutput: document.getElementById("Output").value,
      },
      () => {
        var stateCopy = [];
        for (let index = 0; index < parseInt(this.state.numOutput); index++) {
          stateCopy.push({
            alias: "",
            Key: "",
          });
        }
        this.setState({
          bigChartData: "data2",
          transData: stateCopy,
        });
      }
    );
  };

  sendTransaction = async () => {
    var stateCopy = [];
    for (let index = 0; index < parseInt(this.state.numOutput); index++) {
      stateCopy.push({
        alias: document.getElementById("Alias" + index).value,
        coins: document.getElementById("Coins" + index).value,
      });
    }
    const payLoad = {
      PrivateKey: this.state.PrivateKey,
      PublicKey: this.state.PublicKey,
      numOutput: this.state.numOutput,
      transData: stateCopy,
    };
    try {
      const response = await fetch("/processTransaction", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          payLoad,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col>
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left">
                      <h5 className="card-category">Transactions</h5>
                      <CardTitle tag="h2">Create A Transaction</CardTitle>
                    </Col>
                    <Col sm="6">
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data1",
                          })}
                          color="info"
                          id="0"
                          size="sm"
                          onClick={() => this.setBgChartData("data1")}
                        >
                          <input
                            defaultChecked
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Enter Keys
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data2",
                          })}
                          onClick={() => this.setBgChartData("data2")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Choose Outputs
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="2"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data3",
                          })}
                          onClick={() => this.setBgChartData("data3")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Transfer Coins
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.bigChartData === "data1" && (
                    <div className="content">
                      <Card>
                        <CardBody>
                          <Form>
                            <Row>
                              <Col className="pr-md-1" md="6">
                                <FormGroup>
                                  <label>Enter Number of Outputs</label>
                                  <Input
                                    defaultValue="0"
                                    placeholder="Public Key"
                                    type="text"
                                    id="Output"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-md-1" md="6">
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
                                <FormGroup>
                                  <label> Public Key</label>
                                  <Input
                                    defaultValue=""
                                    placeholder="Public Key"
                                    type="textarea"
                                    id="id1"
                                    rows="50"
                                    value={this.state.PublicKey}
                                    disabled
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-md-1" md="6">
                                {/* <FormGroup>
                                  <label>Enter Private Key</label>
                                  <Input
                                    cols="160"
                                    placeholder="Enter your Public Key"
                                    rows="10"
                                    type="textarea"
                                    id="Private"
                                  />
                                </FormGroup> */}
                                <FormGroup>
                                  <Input
                                    cols="160"
                                    placeholder="Enter your Public Key"
                                    rows="10"
                                    type="textarea"
                                    id="publicKey"
                                    accept="*"
                                    type="file"
                                    onChange={this.PrivateKeyChoosen.bind(this)}
                                  />
                                  <label htmlFor="publicKey">
                                    <Button
                                      className="btn-fill"
                                      color="primary"
                                      type="submit"
                                      onClick={async () => {}}
                                    >
                                      UPLOAD PRIVATE KEY
                                    </Button>
                                  </label>
                                </FormGroup>
                                <FormGroup>
                                  <label> Private Key</label>
                                  <Input
                                    defaultValue=""
                                    placeholder="Private Key"
                                    type="textarea"
                                    id="id1"
                                    rows="50"
                                    value={this.state.PrivateKey}
                                    disabled
                                  />
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
                              await this.initTransaction();
                              // console.log(this.state);
                            }}
                          >
                            CONTINUE
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                  {this.state.bigChartData === "data2" &&
                    this.state.transData.map((output, index) => {
                      return (
                        <Form>
                          <Row>
                            <Col className="pr-md-1" md="6">
                              <FormGroup>
                                <label>
                                  {"Enter Alias of Output " + (index + 1)}
                                </label>
                                <Input
                                  defaultValue=""
                                  placeholder="Company"
                                  type="text"
                                  id={"Alias" + index}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pr-md-1" md="6">
                              <FormGroup>
                                <label>
                                  {"Enter Amount of Output " + (index + 1)}
                                </label>
                                <Input
                                  defaultValue=""
                                  placeholder="Company"
                                  type="text"
                                  id={"Coins" + index}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                      );
                    })}
                  {this.state.bigChartData === "data2" && (
                    <CardFooter>
                      <Button
                        className="btn-fill"
                        color="primary"
                        type="submit"
                        onClick={async () => {
                          await this.sendTransaction();
                          // console.log(this.state);
                        }}
                      >
                        CONTINUE
                      </Button>
                    </CardFooter>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
