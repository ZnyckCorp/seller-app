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
      image_url_primary: primaryImageUrl,
      store_id: store_id
  };

  await fetch('https://us-central1-seller-app-b0a09.cloudfunctions.net/createProduct', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
  }) .then(response =>  {
    if(response.status == 201){
      clearFields();
      alert("Product added successfully");
      goTolocation(window.location.origin+'/product.html') ;
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


function clearFields(){
  document.getElementById('productTitle').value = "";
  document.getElementById('productDescription').value = "";
  document.getElementById('item_price').value = "";
  document.getElementById('item_quantity').value = "";
  document.getElementById('item_unit').value = "";
  document.getElementById('sub_category').value = "";
  document.getElementById('primaryImageUrl').value = "";
}