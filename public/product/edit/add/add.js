// Function to update image preview
function updateImagePreview(inputId, previewId) {
  const imageUrl = document.getElementById(inputId).value;
  const previewElement = document.getElementById(previewId);

  if (imageUrl) {
      // Display the image preview
      previewElement.innerHTML = `<img src="${imageUrl}" class="img-preview" alt="Image Preview">`;
  } else {
      // Clear the image preview if no URL is provided
      previewElement.innerHTML = '';
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
// Function to add product
async function addProduct() {
  // Retrieve values from the form
  const store_id = getStoreID();
  let subBut = document.getElementById('submitButton');
  subBut.disabled = true;
  subBut.innerHTML = "Please wait...";


  const itemName = document.getElementById('productTitle').value;
  const itemDescription = document.getElementById('productDescription').value;
  const item_price = document.getElementById('item_price').value;
  const item_quantity = document.getElementById('item_quantity').value;
  const item_unit = document.getElementById('item_unit').value;
  const sub_category = document.getElementById('sub_category').value;
  const primaryImageUrl = document.getElementById('primaryImageUrl').value;


  // Create the product object with the retrieved values
  const product = {
      item_name: itemName,
      item_description: itemDescription,
      item_price: item_price,
      item_quantity: item_quantity,
      item_unit: item_unit,
      category: "grocery",
      sub_category: sub_category,
      image_url_primary: primaryImageUrl
  };

  await fetch('https://us-central1-seller-app-b0a09.cloudfunctions.net/updateProduct?product_id='+getStoreID(), {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
  }) .then(response =>  {
    if(response.status == 200){
      alert("Product Edit successfully");
      window.location.href = window.location.origin+'/index.html';
    }else{
      alert("Something went wrong");
      subBut.disabled = false;
      subBut.innerHTML = "Submit";
    }
  }).catch(error => {
    console.log(error);
  });

}


validatePage()
populateFields()

function populateFields(){
  const store_id = getStoreID();
  fetch('https://us-central1-seller-app-b0a09.cloudfunctions.net/getProduct?product_id='+store_id)
  .then(res => res.json()).then(data => {
    document.getElementById('productTitle').value = data.item_name;
    document.getElementById('productDescription').value = data.item_description;
    document.getElementById('item_price').value = data.item_price;
    document.getElementById('item_quantity').value = data.item_quantity;
    document.getElementById('item_unit').value = data.item_unit;
    document.getElementById('sub_category').value = data.sub_category;
    document.getElementById('primaryImageUrl').value = data.image_url_primary;
    updateImagePreview();
  }).catch(err => console.log(err));
}


function goTolocation(loc){
  fetch(loc).then(res => {
    if (res.status === 200) {
      window.location.href = loc;
    } else {
      alert("There was a problem loading the page!");
    }
  }).catch(err => console.log(err));
}