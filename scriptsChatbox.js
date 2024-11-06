document.getElementById('chatbox-send').addEventListener('click', async () => {
    const input = document.getElementById('chatbox-input').value;
    if (input) {
      displayMessage('Player', input);  // Show player message
      document.getElementById('chatbox-input').value = '';  // Clear input
  
      // Send the question to the AI API
      const response = await getAIResponse(input);
      displayMessage('AI', response);  // Show AI response
    }
  });
  
  // Function to display messages in the chatbox
  function displayMessage(sender, text) {
    const messageElem = document.createElement('div');
    messageElem.innerText = `${sender}: ${text}`;
    document.getElementById('chatbox-messages').appendChild(messageElem);
    messageElem.scrollIntoView();  // Auto-scroll to latest message
  }
  
  // Function to send questions to AI API
  async function getAIResponse(message) {
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`  // Replace with your API key
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: message,
          max_tokens: 50
        })
      });
      const data = await response.json();
      return data.choices[0].text.trim();
    } catch (error) {
      console.error('Error:', error);
      return "I'm sorry, I couldn't answer that.";
    }
  }
  