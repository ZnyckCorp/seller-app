function updateImagePreview(imageType) {
    const imageUrl = document.getElementById(`${imageType}Url`).value;
    const imagePreview = document.getElementById(`${imageType}Preview`);
    
    // Update the image preview
    if (imageUrl) {
      imagePreview.innerHTML = `<img src="${imageUrl}" class="img-fluid" alt="${imageType} Preview">`;
    } else {
      imagePreview.innerHTML = '';
    }
  }