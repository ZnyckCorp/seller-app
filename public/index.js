  function goTolocation(loc) {
    fetch('/path/to/add-store')
  .then(response => {
    window.location.href = loc;
  })
  .catch(error => console.error('Error:', error));
  }

  function getStores(page =1, limit=40){
    searchViewDisable();
    fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/getAllStores?page=${page}&limit=${limit}`)
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data.docs);
    populateStoreCards(data.docs);
  })
  .catch(error => console.error('Error:', error))
  }
  getStores();

  function populateStoreCards(storeDetailsList) {
    // Get the template card element
    const templateCard = document.getElementById('storeCardTemplate');
  
    // Get the parent container where cards will be appended
    const container = document.getElementById('containerForCards'); // Update this with the actual ID or selector of your container
      if (templateCard && container) {
      container.innerHTML = '';
  
      storeDetailsList.forEach((storeDetails) => {

        const newCard = templateCard.cloneNode(true);
        newCard.style.display = 'block'; // Make the cloned card visible

        const cardTitle = newCard.querySelector('.card-title');
        cardTitle.textContent = storeDetails.store_name || 'Unknown';
        cardTitle.setAttribute('data-store-id', storeDetails._id || ''); // Replace 'id' with the actual property name for store ID
  
        newCard.querySelector('.card-subtitle').textContent = storeDetails.store_location || 'Unknown';
        
        const storeImage = newCard.querySelector('.card-img-top');
        storeImage.src = storeDetails.store_image_url || '';

        newCard.querySelector('.btn-primary:first-child').addEventListener('click', function() {
          goTolocation('/product/index.html?store_id='+storeDetails._id);
        });
  
        newCard.querySelector('.btn-primary:last-child').addEventListener('click', function() {
          alert('please avoid deltion of store in production environment');
          deleteStore(storeDetails._id,newCard);
        });
  
        container.appendChild(newCard);
      });
      container.style.display = 'flex';
    }
  }

  function deleteStore(storeId,newCard){
    fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/deleteStore?store_id=${storeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      alert('Store deleted successfully');
       if (newCard && newCard.parentNode) {
        newCard.parentNode.removeChild(newCard);
      }
      getStores();
    })
    .catch(error => console.error('Error:', error));
    
  }



  function populateSearchStoreCards(storeDetailsList) {
    // Get the template card element
    const templateCard = document.getElementById('storeCardTemplate');
    
    // Get the parent container where cards will be appended
    const container = document.getElementById('searchContainerForCards'); // Update this with the actual ID or selector of your container
      if (templateCard && container) {
      container.innerHTML = '';
  
      storeDetailsList.forEach((storeDetails) => {

        const newCard = templateCard.cloneNode(true);
        newCard.style.display = 'block'; // Make the cloned card visible

        const cardTitle = newCard.querySelector('.card-title');
        cardTitle.textContent = storeDetails.store_name || 'Unknown';
        cardTitle.setAttribute('data-store-id', storeDetails._id || ''); // Replace 'id' with the actual property name for store ID
  
        newCard.querySelector('.card-subtitle').textContent = storeDetails.store_location || 'Unknown';
        
        const storeImage = newCard.querySelector('.card-img-top');
        storeImage.src = storeDetails.store_image_url || '';

        newCard.querySelector('.btn-primary:first-child').addEventListener('click', function() {
          goTolocation('/product/index.html?store_id='+storeDetails._id);
        });
  
        newCard.querySelector('.btn-primary:last-child').addEventListener('click', function() {
          alert('please avoid deltion of store in production environment');
          deleteStore(storeDetails._id,newCard);
        });
  
        container.appendChild(newCard);
      });
      container.style.display = 'flex';
    }
  }

  function search(page =1, limit=40){
    const value = document.getElementById('searchInput').value;
    if(value === '' || value === undefined || value === null) {
      searchViewDisable();
      return;
    };
    fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/searchStores?keyword=${value}&page=${page}`).then(response => response.json()).then(data => {
    if(data === undefined || data.length === 0 ) {
      alert('No store found');
      return;
    }
    searchViewEnable();
    populateSearchStoreCards(data);
    })
    .catch(error => console.error('Error:', error))
  }


function searchViewEnable(){
  document.getElementById('searchContainerForCards').style.display = 'flex';
  document.getElementById('containerForCards').style.display = 'none';
}

function searchViewDisable(){
  document.getElementById('searchContainerForCards').style.display = 'none';
  document.getElementById('containerForCards').style.display = 'flex';
}