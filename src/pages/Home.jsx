import React from "react";
import { Container, Card } from "react-bootstrap";
import axios from 'axios';

export function Home() {
  const fetchMatches = async () => {
    try {
      const date = new Date().toISOString();
      const response = await axios.get(`https://localhost:3000/api/matches?date=${date}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };
    
      return (
        <div>
          <h2>Matches</h2>
          <ul>
            {matches.map(match => (
              <li key={match.matchId}>
                Home: {match.home}, Away: {match.away}, Home Goals: {match.homeGoals}, Away Goals: {match.awayGoals}
              </li>
            ))}
          </ul>
        </div>
      )
        
    
    
}

export default Home;
