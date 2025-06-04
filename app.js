const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');
const cancelUpdateButton = document.querySelector('#cancel-update');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://3.142.68.2:3000/products');
  const products = await response.json();

  // Clear product list before updating
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${product.name}</strong> - $${product.price} <br>
      <em>${product.description}</em>
    `;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id); // Wait for the product to be deleted
      location.reload(); // Reload the page to update the list
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;

      // Show the update form and hide the add form
      updateProductForm.style.display = 'block';
      addProductForm.style.display = 'none';
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  await addProduct(name, price, description);
  addProductForm.reset();
  fetchProducts(); // Refresh product list after adding
});

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value;
  await updateProduct(id, name, price, description);
  updateProductForm.reset();
  updateProductForm.style.display = 'none';
  addProductForm.style.display = 'block';
  fetchProducts(); // Refresh product list after update
});

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://3.142.68.2:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to update a product
async function updateProduct(id, name, price, description) {
  const response = await fetch(`http://3.142.68.2:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a product
async function deleteProduct(id) {
  const response = await fetch(`http://3.142.68.2:3000/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}

// Event listener for Cancel Update button
cancelUpdateButton.addEventListener('click', () => {
  updateProductForm.style.display = 'none';
  addProductForm.style.display = 'block';
});

// Fetch all products on page load
window.addEventListener('load', fetchProducts);
