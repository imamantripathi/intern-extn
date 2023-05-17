// Replace 'YOUR_CHAT_API_KEY' with your actual ChatGPT API key
const apiKey = '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';

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'capture_element') {
    chrome.tabs.executeScript({
      code: 'window.getSelection().toString();'
    }, function(result) {
      var selectedWord = result[0].trim();

      if (selectedWord) {
        // Retrieve the previously captured elements from local storage
        chrome.storage.local.get('capturedElements', function(data) {
          var capturedElements = data.capturedElements || [];
          var capturedElement = {
            word: selectedWord,
            url: window.location.href,
            timestamp: new Date().toLocaleString()
          };

          capturedElements.push(capturedElement);

          // Save the updated captured elements in local storage
          chrome.storage.local.set({ 'capturedElements': capturedElements }, function() {
            alert('Word has been captured and saved');
            generateResponse(selectedWord);
          });
        });
      }
    });
  }
});

function generateResponse(input) {
  var prompt = "Generate a response for: " + input;
  var requestBody = {
    prompt: prompt,
    max_tokens: 50
  };

  fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      var generatedResponse = data.choices[0].text.trim();

      // Store the generated response in local storage
      chrome.storage.local.set({ 'generatedResponse': generatedResponse }, function() {
        alert('Generated response has been saved');
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
