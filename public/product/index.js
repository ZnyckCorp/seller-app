function goTolocation(loc){
  fetch(loc).then(res => {
    if (res.status === 200) {
      window.location.href = loc;
    } else {
      alert("There was a problem loading the page!");
    }
  }).catch(err => console.log(err));
}

function addProductPage() {
  if(validatePage()){
    goTolocation("/product/add/add.html?store_id="+getStoreID()) ;
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

function deleteProduct(product_id,newCard){
  alert("please avoid deletion of products in production environment");
  fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/deleteProduct?product_id=${product_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (newCard && newCard.parentNode) {
        newCard.parentNode.removeChild(newCard);
      }
      alert('Product deleted successfully!');
      return response.json();
    })
    .catch(error => console.error('Error deleting product:', error));
}

function productCardPopulate(productsList) {
  const templateCard = document.getElementById('product_card');
  const default_container = document.getElementById('default_container');
  const search_container = document.getElementById('search_container');
  if(default_container && search_container){
    default_container.style.display = 'block';
    search_container.style.display = 'none';
  }
  const container = document.getElementById('containerForCards'); 
    if (templateCard && container) {
    container.innerHTML = '';

    productsList.forEach((product) => {

      const newCard = templateCard.cloneNode(true);
      newCard.style.display = 'block'; 

      const cardTitle = newCard.querySelector('.card-title');
      cardTitle.textContent = product.item_name || 'Unknown';
      cardTitle.setAttribute('data-store-id', product._id || '');

      newCard.querySelector('.card-subtitle').textContent = product.item_description || 'Unknown';
      
      const storeImage = newCard.querySelector('.card-img-top');
      storeImage.src = product.image_url_primary || '';

      newCard.querySelector('.btn-primary:first-child').addEventListener('click', function() {
        goTolocation('/product/edit/add/add.html?store_id='+product._id);
      });

      newCard.querySelector('.btn-primary:last-child').addEventListener('click', function() {
        deleteProduct(product._id,newCard);
      });

      container.appendChild(newCard);
    });
    container.style.display = 'flex';
  }
}

function getProducts(){
  const store_id = getStoreID();
  if(store_id == null){
    return;
  }
  fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/getAllProducts?store_id=${store_id}`)
  .then((response) => response.json())
  .then((data) => {
    if(data.docs.length == 0){
      return;
    }
    productCardPopulate(data.docs)
  }).catch((error) => console.error(error));

}

function populateStore(){
  const store_id = getStoreID();
  fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/getStore?store_id=${store_id}`)
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("store_name").innerHTML = data.store_name;
    document.getElementById("store_description").innerHTML = "Store Description : "+data.store_description;
    document.getElementById("store_location").innerHTML = "Store Location : "+data.store_location;
    const imageEle = document.getElementById("store_logo");
    imageEle.src = data.store_image_url;
    imageEle.addEventListener('click', function() {
      goTolocation('/store/edit/edit.html?store_id='+data._id);
    });
    getProducts();
  })

  .catch((error) => console.error(error));
}


function searchProductDefault(){
  const default_container = document.getElementById('default_container');
  const search_container = document.getElementById('search_container');
  if(default_container && search_container){
    default_container.style.display = 'block';
    search_container.style.display = 'none';
  }
  return;
}

function searchProduct(page = 1){
  const value = document.getElementById("search_input").value;
  if(value == "" || value == null || value == undefined){
    searchProductDefault();
    return;
  }
  const store_id = getStoreID();
  if(store_id == null){
    return;
  }
  fetch(`https://us-central1-seller-app-b0a09.cloudfunctions.net/searchProduct?keyword=${value}&page=${page}&store_id=${store_id}`)
  .then(response => response.json())
  .then(data => {
    if(data.length == 0){
      return;
    }
    productSearchCardPopulate(data)
  }).catch(error => console.error(error));
}


function productSearchCardPopulate(productsList) {
  const templateCard = document.getElementById('product_card');
  const default_container = document.getElementById('default_container');
  const search_container = document.getElementById('search_container');
  if(default_container && search_container){
    default_container.style.display = 'none';
    search_container.style.display = 'block';
  }
  const container = document.getElementById('containerForSearchCards'); 
    if (templateCard && container) {
    container.innerHTML = '';

    productsList.forEach((product) => {

      const newCard = templateCard.cloneNode(true);
      newCard.style.display = 'block'; 

      const cardTitle = newCard.querySelector('.card-title');
      cardTitle.textContent = product.item_name || 'Unknown';
      cardTitle.setAttribute('data-store-id', product._id || '');

      newCard.querySelector('.card-subtitle').textContent = product.item_description || 'Unknown';
      
      const storeImage = newCard.querySelector('.card-img-top');
      storeImage.src = product.image_url_primary || '';

      newCard.querySelector('.btn-primary:first-child').addEventListener('click', function() {
        goTolocation('/product/index.html?store_id='+product._id);
      });

      newCard.querySelector('.btn-primary:last-child').addEventListener('click', function() {
        deleteProduct(product._id,newCard);
      });

      container.appendChild(newCard);
    });
    container.style.display = 'flex';
  }
}

validatePage();
populateStore();
