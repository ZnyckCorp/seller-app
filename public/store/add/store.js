function updateImagePreview() {
    const imageUrl = document.getElementById('imageUrl').value;
    const imagePreview = document.getElementById('imagePreview');
    
    // Update the image preview
    if (imageUrl) {
      imagePreview.innerHTML = `<img src="${imageUrl}" class="img-fluid" alt="Image Preview">`;
    } else {
      imagePreview.innerHTML = '';
    }
  }