const timeStyle = {
    fontSize: '14px',
    color: '#333',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Make sure the time spans the entire width
    marginBottom: '10px' // Add margin bottom for spacing
  };


  const matchStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'flex',
    justifyContent: 'space-between', // Remove this line
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const teamStyle = {
    display: 'flex',
    alignItems: 'center',
    marginRight: '5px', // Add margin to create space between teams
  };

  const buttonStyle = {
    padding: '4px 4px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontSize: '12px',
  };

  const matchContainerStyle = {
    flexDirection: 'column', // Display matches vertically on small screens
    marginBottom: '20px',
  };

  const goalsInputStyle = {
    marginLeft: 10,
    width: '30px', // Make the input field narrower
    padding: '4px', // Reduce padding for a smaller look
    fontSize: '14px', // Adjust font size if needed
    textAlign: 'center' // Center the text for better readability
  };

  export { teamStyle, timeStyle, matchStyle, buttonStyle, matchContainerStyle, goalsInputStyle  }