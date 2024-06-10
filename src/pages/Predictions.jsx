
import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

export function Predictions() {
    const [team, setTeam] = useState("");
    const [prediction, setPrediction] = useState("");
  
    const handleSubmit = (event) => {
      event.preventDefault();
     
      console.log("Prediction submitted:", { team, prediction });
      
      setTeam("");
      setPrediction("");
    };
    return ( 
    <Container className="mt-3">
        <h2>Make a Prediction</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTeam">
            <Form.Label>Team</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              required
            />
          </Form.Group>
  
          <Form.Group controlId="formPrediction" className="mt-3">
            <Form.Label>Prediction</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your prediction"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              required
            />
          </Form.Group>
  
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Container>
      )
}

export default Predictions;
