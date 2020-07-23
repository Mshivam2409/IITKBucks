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

// reactstrap components
import {
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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PublicKey: "",
    };
  }

  addAlias = async () => {
    try {
      console.log(this.state.PublicKey);
      const response = await fetch("/addAlias", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          alias: document.getElementById("Alias").value,
          publicKey: this.state.PublicKey.replace(/\\/g, "\\"),
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

  PublicKeyChoosen = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      this.setState({
        PublicKey: text,
      });
    };
    reader.readAsText(e.target.files[0]);
    console.log(this.state.PublicKey);
  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h5 className="title">SIGNUP</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1">
                        <FormGroup>
                          <label>Alias</label>
                          <Input
                            defaultValue=""
                            placeholder="Alias"
                            id="Alias"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
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
                        <FormGroup>
                          {/* <label>Public Key</label> */}
                          <Input
                            cols="160"
                            placeholder="Public Key"
                            rows="10"
                            type="textarea"
                            id="abc"
                            value={this.state.PublicKey}
                            hidden={this.state.PublicKey == ""}
                            disabled
                            style={{ color: "white" }}
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
                      await this.addAlias();
                    }}
                  >
                    SIGNUP
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

export default UserProfile;
