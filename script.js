/* =====================================================
   ZELNOIR — STORE SCRIPT
   CART + CHECKOUT + RAZORPAY + COD
===================================================== */


/* =====================================================
   BACKEND URL
===================================================== */

/*
   ABHI ISKO CHANGE MAT KARNA.

   Backend deploy hone ke baad:
   https://YOUR-BACKEND-URL.com

   yahan dalenge.
*/

const API_BASE_URL =
  "https://YOUR-BACKEND-DOMAIN.example.com";


/* =====================================================
   PRODUCTS
===================================================== */

const products = [

  {
    id: "midnight",
    name: "Midnight",
    price: 99900,
    displayPrice: "₹999",
    image: "assets/images/midnight-1.jpg",
    description:
      "Deep, magnetic and made for the night."
  },

  {
    id: "royaloud",
    name: "Royal Oud",
    price: 99900,
    displayPrice: "₹999",
    image: "assets/images/royaloud-1.jpg",
    description:
      "Rich woods with a refined signature."
  },

  {
    id: "signature",
    name: "Signature",
    price: 99900,
    displayPrice: "₹999",
    image: "assets/images/signature-1.jpg",
    description:
      "Clean, elegant and unmistakably ZELNOIR."
  },

  {
    id: "velvet",
    name: "Velvet",
    price: 99900,
    displayPrice: "₹999",
    image: "assets/images/velvet-1.jpg",
    description:
      "Smooth, warm and effortlessly memorable."
  }

];


/* =====================================================
   CART
===================================================== */

let cart =
  JSON.parse(
    localStorage.getItem("zelnoir_cart")
  ) || [];


/* =====================================================
   HELPERS
===================================================== */

const $ = (selector) =>
  document.querySelector(selector);


function formatMoney(amountInPaise) {

  return (
    "₹" +
    Math.round(amountInPaise / 100)
      .toLocaleString("en-IN")
  );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts() {

  const container = $("#products");

  if (!container) return;


  container.innerHTML = products.map(product => {

    return `

      <article class="product">

        <div class="product-image">

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

        </div>


        <div class="product-info">

          <p class="eyebrow">
            ${product.name.toUpperCase()}
          </p>

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.description}
          </p>

          <div class="product-price">
            ${product.displayPrice}
          </div>


          <button
            class="buy-button"
            data-product="${product.id}"
          >
            ADD TO BAG
          </button>

        </div>

      </article>

    `;

  }).join("");


  document
    .querySelectorAll(".buy-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          addToCart(
            button.dataset.product
          );

        }
      );

    });

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(productId) {

  const existing =
    cart.find(
      item => item.id === productId
    );


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({

      id: productId,

      quantity: 1

    });

  }


  saveCart();

  openCart();

  showToast(
    "Added to your ZELNOIR bag."
  );

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

  localStorage.setItem(
    "zelnoir_cart",
    JSON.stringify(cart)
  );


  updateCartCount();

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  const cartCount =
    $("#cartCount");


  if (cartCount) {

    cartCount.textContent =
      count;

  }

}


/* =====================================================
   CART TOTAL
===================================================== */

function getCartTotal() {

  return cart.reduce(

    (total, item) => {

      const product =
        products.find(
          p => p.id === item.id
        );


      if (!product) {

        return total;

      }


      return (
        total +
        product.price *
        item.quantity
      );

    },

    0

  );

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

  const container =
    $("#cartItems");

  const totalElement =
    $("#cartTotal");

  const checkoutButton =
    $("#checkoutBtn");


  if (!container) return;


  if (cart.length === 0) {

    container.innerHTML = `

      <p>
        Your bag is empty.
      </p>

    `;


    totalElement.textContent =
      "₹0";


    checkoutButton.disabled =
      true;


    return;

  }


  checkoutButton.disabled =
    false;


  container.innerHTML =
    cart.map(item => {

      const product =
        products.find(
          p => p.id === item.id
        );


      return `

        <div class="cart-line">

          <div>

            <strong>
              ${product.name}
            </strong>

            <br>

            <small>
              ${formatMoney(product.price)}
            </small>

          </div>


          <div class="qty">

            <button
              onclick="changeQuantity('${product.id}', -1)"
            >
              −
            </button>

            <span>
              ${item.quantity}
            </span>

            <button
              onclick="changeQuantity('${product.id}', 1)"
            >
              +
            </button>

          </div>

        </div>

      `;

    }).join("");


  totalElement.textContent =
    formatMoney(
      getCartTotal()
    );

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(
  productId,
  change
) {

  const item =
    cart.find(
      product =>
        product.id === productId
    );


  if (!item) return;


  item.quantity +=
    change;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        product =>
          product.id !== productId
      );

  }


  saveCart();

  renderCart();

}


/* =====================================================
   OPEN CART
===================================================== */
