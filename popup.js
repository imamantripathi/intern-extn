document.addEventListener('DOMContentLoaded', function() {
  var captureButton = document.getElementById('capture-button');
  captureButton.addEventListener('click', captureWord);

  var clearButton = document.getElementById('clear-button');
  clearButton.addEventListener('click', clearStorage);

  // Load captured elements from local storage
  chrome.storage.local.get('capturedElements', function(data) {
    var capturedElements = data.capturedElements || [];
    displayCapturedElements(capturedElements);
  });

  function captureWord() {
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
            timestamp: new Date().toLocaleString()
          };

          capturedElements.push(capturedElement);

          // Save the updated captured elements in local storage
          chrome.storage.local.set({ 'capturedElements': capturedElements }, function() {
            alert('Word has been captured and saved');
            displayCapturedElements(capturedElements);
          });
        });
      }
    });
  }

  function clearStorage() {
    chrome.storage.local.clear(function() {
      alert('Local storage has been cleared');
      document.getElementById('captured-list').innerHTML = '';
    });
  }

  function displayCapturedElements(capturedElements) {
    var capturedList = document.getElementById('captured-list');
    capturedList.innerHTML = '';

    capturedElements.forEach(function(element) {
      var listItem = document.createElement('li');
      var wordLine = document.createElement('p');
      var timestampLine = document.createElement('p');
      wordLine.textContent = 'Word: ' + element.word;
      timestampLine.textContent = 'Timestamp: ' + element.timestamp;

      listItem.appendChild(wordLine);
      listItem.appendChild(timestampLine);
      capturedList.appendChild(listItem);
    });
  }
});
