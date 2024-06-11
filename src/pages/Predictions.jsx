import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import axios from "axios";

export function Predictions() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  useEffect(() => async () => {
    const matches = await axios.post(
    "http://localhost:3000/api/matches/",{date:"2024-06-14"})
  
    /*const fetchMatches = async () => {
      const fetchedMatches = [
        {
          matchId: 1,
          home: "Germany",
          homeLogo: "https://media.api-sports.io/football/teams/25.png",
          away: "Scotland",
          awayLogo: "https://media.api-sports.io/football/teams/1108.png",
          homeGoals: null,
          awayGoals: null,
          winner: null,
          },
          
          ];*/
          console.log("matches " + matches.home)
          setMatches([matches.data]);
          
          
          //fetchMatches();
          }, []);

  const handleMatchChange = (event) => {
    const matchId = event.target.value;
    setSelectedMatch(matchId);
    const selectedMatchData = matches.find((match) => match.matchId === parseInt(matchId));
    if (selectedMatchData) {
      setHomeTeam({
        name: selectedMatchData.home,
        logo: selectedMatchData.homeLogo,
      });
      setAwayTeam({
        name: selectedMatchData.away,
        logo: selectedMatchData.awayLogo,
      });
      setHomeScore("");
      setAwayScore("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Prediction submitted:", {
      match: selectedMatch,
      homeScore,
      awayScore,
    });
  };
/*return (
  <div>
    {matches.map((match) => (
             <div>
moi
              {match.matchId} {match.matchId}
                {match.home} {match.away}
             </div>
              
            ))} 
  </div>
)*/
  return (
    <Container className="mt-3">
      <h2>Make a Prediction</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formMatch">
          <Form.Label>Match</Form.Label>
          <Form.Control as="select" value={selectedMatch} onChange={handleMatchChange}>
            <option value="">Select a match</option>
            {matches.map((match) => (
              <option key={match.matchId} value={match.matchId}>
                {match.home} vs {match.away}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedMatch && homeTeam && awayTeam && (
          <Row>
            <Col>
              <Form.Group controlId="formHomeScore">
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image src={homeTeam.logo} alt={homeTeam.name} rounded className="rounded mx-auto d-block"style={{ width: '100px', height: '100px' }} />
                <span>{homeTeam.name}</span>
                <Form.Control
                  type="number"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formAwayScore">
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                
                <Form.Control style={{ width: '100px', height: '30px' }}
                  type="number"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  />
                  <span>{awayTeam.name}</span>
                <Image src={awayTeam.logo} alt={awayTeam.name} rounded className="rounded mx-auto d-block"style={{ width: '100px', height: '100px' }}  />
                  </div>
              </Form.Group>
            </Col>
          </Row>
        )}

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default Predictions;
