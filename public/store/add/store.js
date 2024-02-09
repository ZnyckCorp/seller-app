function updateImagePreview() {
    const imageUrl = document.getElementById('store_image_url').value;
    const imagePreview = document.getElementById('imagePreview');
    
    // Update the image preview
    if (imageUrl) {
      imagePreview.innerHTML = `<img src="${imageUrl}" class="img-fluid" alt="Image Preview">`;
    } else {
      imagePreview.innerHTML = '';
    }
  }



function createStore (){
  const submit_button = document.getElementById('submit_button');
  if(submit_button.disabled === true){
    alert('Please wait while we create your store');
    return;
  }
  submit_button.disabled = true;
  submit_button.innerHTML = 'Creating store...';
  const store_name = document.getElementById('store_name').value;
  const store_description = document.getElementById('store_description').value;
  const store_location = document.getElementById('store_location').value;
  const store_lat = document.getElementById('store_lat').value;
  const store_long = document.getElementById('store_long').value;
  const store_image_url = document.getElementById('store_image_url').value;


  const store = {
      store_name: store_name,
      store_description: store_description,
      store_location: store_location,
      store_lat: store_lat,
      store_long: store_long,
      store_image_url: store_image_url
  }
  if(vaildateStore(store) === false){
    enableSubmitButton()
    return;
  }
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(store)
  }
  fetch('https://us-central1-seller-app-b0a09.cloudfunctions.net/createStore', options)
  .then(res =>{
    if(res.status === 201){
      alert('Store created successfully');
      clearFields();
      submit_button.disabled = false;
      submit_button.innerHTML = 'Submit';
    }
    return res.json();
  }).then(data => {
    if(data.id === undefined){
      alert("Error creating store !! please contact admin");
      enableSubmitButton()
      return;
    }
    window.location.href = `/product/index.html?store_id=${data.id}`;
  }).catch(err => {
    enableSubmitButton()
    alert("Error creating store !! please contact admin");
  });
}

function clearFields(){
  document.getElementById('store_name').value = '';
  document.getElementById('store_description').value = '';
  document.getElementById('store_location').value = '';
  document.getElementById('store_lat').value = '';
  document.getElementById('store_long').value = '';
  document.getElementById('store_image_url').value = '';
  document.getElementById('imagePreview').innerHTML = '';
}


function vaildateStore(store){
  if(store.store_name === '' || store.store_description === '' || store.store_location === '' || store.store_lat === '' || store.store_long === '' || store.store_image_url === ''){
      alert('Please fill in all fields');
      return false;
  }
  if(store.store_name === undefined || store.store_description === undefined  || store.store_location === undefined  || store.store_lat === undefined || store.store_long === undefined || store.store_image_url === undefined ){
    alert('Please fill in all fields');
    return false;
  }
  if(isNaN(store.store_lat) || isNaN(store.store_long)){
      alert('Please enter a valid latitude and longitude');
      return false;
  }

  if(store.store_lat < -90 || store.store_lat > 90){
      alert('Please enter a valid latitude');
      return false;
  }

  if(store.store_long < -180 || store.store_long > 180){
      alert('Please enter a valid longitude');
      return false;
  }
  
  if(store.store_image_url.length === 0 || store.store_image_url.length   =="" || store.store_image_url.length === undefined){
      alert('Please enter a valid image url');
      return false;
  }

  if(store.store_name.length >= 100 || store.store_name.length <= 3){
      alert('Please enter a store name with more than 3 characters and less than 100 characters');
      return false;
  }

  if(store.store_description.length > 1000 || store.store_description.length <= 15){
      alert('Please enter a store description with more than 15 characters and less than 1000 characters');
      return false;
  }

  return true;
}


function enableSubmitButton() {
  const submit_button = document.getElementById('submit_button');
  submit_button.disabled = false;
  submit_button.innerHTML = 'Submit';
}