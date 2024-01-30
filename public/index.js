  function goTolocation(loc) {
    fetch('/path/to/add-store')
  .then(response => {
    window.location.href = loc;
  })
  .catch(error => console.error('Error:', error));
  }

