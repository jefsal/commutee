// Commutee – main app logic (vanilla JS)

(function () {
  'use strict';

  // Like Java: get reference to elements, then use them
  const btnDemo = document.getElementById('btn-demo');
  const output = document.getElementById('output');

  function onDemoClick() {
    output.textContent = 'JavaScript is running! You can start building the carpool features here.';
  }

  if (btnDemo) {
    btnDemo.addEventListener('click', onDemoClick);
  }
})();
