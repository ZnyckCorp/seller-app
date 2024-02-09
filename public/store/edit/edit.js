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

function getStoreID(){
    const urlParams = new URLSearchParams(window.location.search);
    const store_id = urlParams.get('store_id');
    if(store_id  != null && store_id != "" && store_id != undefined){
      return store_id;
    }
    return null;
  }
  
function validatePage(){
    const store_id = getStoreID();
    if(store_id  != null && store_id != "" && store_id != undefined){
      return true;
    }else{
      goTolocation(window.location.origin+'/index.html') ;
    }
}

function populateEditForm(data){
    document.getElementById("store_name").value = data.store_name;
    document.getElementById("store_description").value = data.store_description;
    document.getElementById("store_lat").value = data.store_lat;
    document.getElementById("store_long").value = data.store_long;
    document.getElementById("store_location").value = data.store_location;
    document.getElementById("store_image_url").value = data.store_image_url;
    document.getElementById("store_form").style.display = "block";;
    updateImagePreview();
}

function getStore(){
    const store_id = getStoreID();
    fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/getStore?store_id=${store_id}`)
    .then(res => res.json()).then(data => {
    console.log(data);
    if(data == null || data == undefined || data.length == 0){
        goTolocation(window.location.origin+'/index.html') ;
    }
    return populateEditForm(data);
    }).catch(err => {
        console.log(err)
        goTolocation(window.location.origin+'/index.html') ;
    });
}

function editStore (){
  const submit_button = document.getElementById('submit_button');
  const store_id = getStoreID();

  submit_button.disabled = true;
  submit_button.innerHTML = 'Updating store...';
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
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(store)
  }
  fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/updateStore?store_id=${store_id}`, options)
  .then(res =>{
    enableSubmitButton()
    if(res.status === 201 || res.status === 200){
      alert('Store Updated successfully');
      clearFields();
      submit_button.disabled = false;
      submit_button.innerHTML = 'Submit';
      window.location.href = `/product/index.html?store_id=${store_id}`;
    }
    if(res.status === 400 || res.status === 404 || res.status === 401 || res.status === 500){
      alert('Error creating store !! please contact admin');
      return;
    }
  }).catch(err => {
    enableSubmitButton()
    alert("Error creating store !! please contact admin");
  });
}



validatePage();
getStore();






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
  submit_button.innerHTML = 'Update';
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