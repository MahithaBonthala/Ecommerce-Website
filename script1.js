const cartItems = [];

const cartIcon = document.querySelector('#cart-icon');
const cartItemsContainer = document.querySelector('.cart-section');

cartItemsContainer.style.display = 'none';

cartIcon.addEventListener('click', () => {
  // Hide all other elements except the cart items container
  const elementsToHide = document.querySelectorAll('body > :not(.cart-section)');
  elementsToHide.forEach(element => {
    element.style.display = 'none';
  });

  // Show the cart items container
  cartItemsContainer.style.display = 'block';

  // Move the cart items container to the top of the document
  document.body.insertBefore(cartItemsContainer, document.body.firstChild);
});




async function fetchProducts(url){
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("response is not Ok");
            
        }
        return await response.json();
    }
    catch(error){
        throw new Error("Error Fetching the data:" + error.message);
    }
}
function CreateProductList(products){
    const DivEle = document.createElement('div');
    DivEle.className='productList'
    products.map((items)=>{
    
    const Card = document.createElement('div')
    Card.classList.add('card');
    Card.innerHTML=`
    <h1 class="title">${items.title}</h1>
    <img src = ${items.image} alt = ${items.title}>
    <p class="price">$${items.price}</p>
    <p>${ JSON.stringify(items.rating)}</p>
    <p class="description">${truncateDescription(items.description, 100)}</p>

    <div class=quanity-container>
      <button class="plus">+</button>
      <input type="text" class="quantity-input" value="1">
      <button class="minus">-</button>
      </div>

      

    <button class="add-to-cart">Add to cart</button>`

    function truncateDescription(description, maxLength) {
      if (description.length > maxLength) {
        const truncatedText = description.substring(0, maxLength) + '...';
        const fullText = description;
        return `<span class="truncated-description" data-full-text="${fullText}">${truncatedText}</span>`;
      }
      return description;
    }
  
    
  


        const quantityInput=Card.querySelector('.quantity-input')
        const plusBtn = Card.querySelector('.plus')
        const minusBtn = Card.querySelector('.minus')
        

        let quantity=1;

        minusBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });

        plusBtn.addEventListener('click', () => {
            quantity++;
            quantityInput.value = quantity;
        });

        const addToCartButton = Card.querySelector('.add-to-cart');
        
        addToCartButton.addEventListener('click', () => {
            handleAddToCart(items,quantity);
          });
        
        
        
        
        
        Card.appendChild(addToCartButton);
        DivEle.appendChild(Card);

})
return DivEle;

}

async function displayProducts(){
  try{
  
      const [mobiles1, mobiles2, laptops,laptops2, watches,watches2, automotives ,automotives2] = await Promise.all([
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18'),
          fetchProducts('https://fakestoreapi.com/products/category/electronics?limit=18')
      ]);

      const mobilesContainer = document.querySelector('.mobiles-container');
      const laptopsContainer = document.querySelector('.laptops-container');
      const watchesContainer = document.querySelector('.watches-container');
      const automotivesContainer = document.querySelector('.automotives-container');

      const mobilesList = CreateProductList([...mobiles1, ...mobiles2]);
      const LaptopsList = CreateProductList([...laptops,...laptops2]);
      const watchesList = CreateProductList([...watches,...watches2]);
      const automotivesList = CreateProductList([...automotives,...automotives2]);

        mobilesContainer.appendChild(mobilesList);
        laptopsContainer.appendChild(LaptopsList);
        watchesContainer.appendChild(watchesList);
        automotivesContainer.appendChild(automotivesList);

        



}
    catch(error){
        const ErrorDisplay = document.getElementById('ErrorDisplay');
        ErrorDisplay.textContent = "Error: " + error.message;
        console.log(ErrorDisplay);
    }
}
function handleAddToCart(item ,quantity) {
  
  const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({ ...item, quantity: quantity });
  }
  
 

  updateCart();
  updateCartTotal();
  updateCartItemCount();
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

  function handleIncreaseQuantity(item, quantityValue) {
    item.quantity++; // Increase the quantity of the item
    quantityValue.textContent = item.quantity; // Update the quantity display
    updateCart(); // Update the cart display
    updateCartTotal(); // Update the cart total
  }
  
  // Function to handle decreasing the quantity of a product
  function handleDecreaseQuantity(item, quantityValue) {
    if (item.quantity > 1) {
      item.quantity--; // Decrease the quantity of the item if it's greater than 1
      quantityValue.textContent = item.quantity; // Update the quantity display
      updateCart(); // Update the cart display
      updateCartTotal(); // Update the cart total
    }
  }
  function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = ''; // Clear the cart items container
  
    if (cartItems.length === 0) {
      const emptyCartMessage = document.createElement('p');
      emptyCartMessage.textContent = 'Your cart is empty.'; // Display a message if the cart is empty
      cartItemsContainer.appendChild(emptyCartMessage);
      updateCartTotal(); // Update the cart total
      return;
    }
  
    // Iterate over each item in the cart and create a cart item element for it
    cartItems.forEach((item) => {
      const cartItem = document.createElement('div'); // Create a div element for the cart item
      cartItem.className = 'cart-item'; // Set the class name of the div to 'cart-item'
      cartItem.innerHTML = `
        <img src=${item.image} alt=${item.title}>
        <div class="item-details">
          <h4 class="title">${item.title}</h4>
          <p class="price">$${item.price}</p>
          <div class="quantity-container">
            <label for="quantity">Quantity:</label>
            <button class="decrease-quantity">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="increase-quantity">+</button>
          </div>
          <p class="total">Total: <span>$${(item.price * item.quantity).toFixed(2)}</span></p>
          <button class="remove-from-cart">Remove</button>
        </div>`; // Set the inner HTML of the cart item with the item details
  
      // Get references to various elements within the cart item
      const quantityContainer = cartItem.querySelector('.quantity-container');
      const quantityValue = quantityContainer.querySelector('.quantity-value');
      const removeFromCartButton = cartItem.querySelector('.remove-from-cart');
      const increaseButton = quantityContainer.querySelector('.increase-quantity');
      const decreaseButton = quantityContainer.querySelector('.decrease-quantity');
  
      // Add event listeners to the buttons for quantity manipulation and removing from cart
      increaseButton.addEventListener('click', () => {
        handleIncreaseQuantity(item, quantityValue);
      });
  
      decreaseButton.addEventListener('click', () => {
        handleDecreaseQuantity(item, quantityValue);
      });
  
      removeFromCartButton.addEventListener('click', () => {
        handleRemoveFromCart(item);
      });
  
      cartItemsContainer.appendChild(cartItem); // Append the cart item to the cart items container
    });
  
    updateCartTotal(); // Update the cart total

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
  
  // Function to handle removing a product from the cart
  function handleRemoveFromCart(item) {
    const index = cartItems.findIndex((cartItem) => cartItem.id === item.id); // Find the index of the item in the cart
  
    if (index !== -1) {
      if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--; // If the item's quantity is greater than 1, decrease it
      } else {
        cartItems.splice(index, 1); // If the item's quantity is 1, remove it from the cart
      }
  
      updateCart(); // Update the cart display
      updateCartTotal(); // Update the cart total
      updateCartItemCount(); 
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }
  
  // Function to update the cart total
  function updateCartTotal() {
    const cartTotalContainer = document.getElementById('cart-total');
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0); // Calculate the total price of all items in the cart
    cartTotalContainer.textContent = `Total: $${cartTotal.toFixed(2)}`; // Display the cart total
  }

  function updateCartItemCount() {
    const cartItemCount = document.getElementById('cart-item-count');
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Calculate the total quantity of items in the cart
    cartItemCount.textContent = itemCount; // Display the item count
  }
  
  function loadCartItems() {
    const storedCartItems = localStorage.getItem('cartItems');
  
    if (storedCartItems) {
      cartItems.push(...JSON.parse(storedCartItems));
      updateCart();
      updateCartTotal();
      updateCartItemCount();
    }
  }
  function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.card');
  
    productCards.forEach(card => {
      const title = card.querySelector('h1').textContent.toLowerCase();
      if (title.includes(searchInput)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }


loadCartItems();
displayProducts();


const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide() {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });
  slides[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide();
}

function prevSlide() {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  showSlide();
}

setInterval(nextSlide, 3000); // Change slide every 3 seconds


// Get the search input element
const searchInput = document.getElementById('searchInput');

// Get the slideshow element
const slideshow = document.querySelector('.slideshow-container');
const featureSection = document.querySelector('.feature-section')

// Add event listener to the search input
searchInput.addEventListener('input', function(e) {
  const searchTerm = e.target.value.trim();
  
  // Toggle the visibility of the slideshow based on the search term
  if (searchTerm === '') {
    slideshow.style.display = 'block'; // Show the slideshow and feature section
    featureSection.style.display = 'block';
  } else {
    slideshow.style.display = 'none'; // Hide the slideshow and feature section
    featureSection.style.display = 'none'
  }
});

function checkout() {


    if (cartItems.length === 0) {
        alert('There are no items in your cart.');
        return;
      }

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const confirmation = confirm(`Total amount in cart: $${cartTotal.toFixed(2)}. Proceed with checkout? and make CartItems Empty.`);
  
    if (confirmation) {
      // Reset cart items array to an empty array
      cartItems.length = 0;
  
      // Clear the cart items from local storage
      localStorage.removeItem('cartItems');
  
      // Reset the cart count to 0
      const cartItemCount = document.getElementById('cart-item-count');
      cartItemCount.textContent = '0';
  
      // Remove animation class from cart icon
      cartIcon.classList.remove('cart-animation');
  
      // Redirect to signup.html
      window.location.href = 'signup.html';
    }
  }
