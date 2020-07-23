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

class Keygen extends React.Component {
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col>
              <Card
                style={{
                  paddingLeft: "10px",
                }}
              >
                <CardHeader>
                  <h5 className="title">GENERATE KEY PAIR</h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <a href="/genPublicKey">
                      <Button
                        className="btn-fill"
                        color="primary"
                        type="submit"
                      >
                        GET PUBLIC KEY
                      </Button>
                    </a>
                  </Row>
                  <Row>
                    <a href="/genPrivateKey">
                      <Button
                        className="btn-fill"
                        color="primary"
                        type="submit"
                      >
                        GET PRIVATE KEY
                      </Button>
                    </a>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Keygen;
