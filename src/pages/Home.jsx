import React from "react";
import { Container, Card } from "react-bootstrap";

export function Home() {
    return (
        <Container className="mt-1">
        <h1>Betti äppi</h1>
        <p>Jotai hauskaa</p>
        
            <h2>User Predictions</h2>
            <Card className="shadow-sm p-3 mb-3 bg-white rounded">
            <Card.Body>
              <Card.Text>Tähä tulee sit jotain hienoo koodii</Card.Text>
            </Card.Body>
            </Card>
      </Container>
        
    
    )
}

export default Home;
