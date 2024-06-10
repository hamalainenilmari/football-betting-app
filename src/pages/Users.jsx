import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
export function Users() {
    return (
         <Container className="mt-3">
        <h2>User Profiles</h2>
        <Row className="mb-3">
        <Col xs={12} md={6}>
          <Card className="shadow-sm p-3 mb-3 bg-white rounded">
            <Card.Body>
              <Card.Title>Pelaaja nimi</Card.Title>
              <Card.Text>Ile</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="shadow-sm p-3 mb-3 bg-white rounded">
            <Card.Body>
              <Card.Title>esittely</Card.Title>
              <Card.Text>hidas</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-sm p-3 mb-3 bg-white rounded">
            <Card.Body>
              <Card.Title>Veikkaukset</Card.Title>
              <Card.Text>lol</Card.Text>
            </Card.Body>
            </Card>
      </Container>
      )
}

export default Users;
