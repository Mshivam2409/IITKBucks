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

class GetBlock extends React.Component {
  getBlock = async () => {
    try {
      const response = await fetch(
        "/getBlock/" + document.getElementById("Index").value,
        {
          method: "GET",
        }
      );
      const responseData = await response.blob();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      window.open("/getBlock/" + document.getElementById("Index").value);
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
              <Card>
                <CardHeader>
                  <h5 className="title">Get Blocks</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1">
                        <FormGroup>
                          <label>Enter Index</label>
                          <Input
                            defaultValue=""
                            placeholder="Alias"
                            id="Index"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                  <a href={document.getElementById("Index")}>
                    <Button
                      className="btn-fill"
                      color="primary"
                      type="submit"
                      onClick={async () => {
                        await this.getBlock();
                      }}
                    >
                      GET BLOCK
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default GetBlock;
