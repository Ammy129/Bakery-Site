// FOR NAVBAR
const menuBtn = document.querySelector(".menu");
const header = document.querySelector("header");
menuBtn.onclick = function () {
  menuBtn.parentElement.classList.toggle("active");
};
//change navbar while scrolling..
window.addEventListener("scroll", e => {
  const headerHeight = header.clientHeight;
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > headerHeight) header.classList.add("fixed-nav");
  else header.classList.remove("fixed-nav");
});

//---------------------------------------------------------
// FOR CART
const productData = [
  {
    id: "1",
    image: "images/Rolls@2x.jpg",
    title: "Rolls",
    price: 10,
    text: " This Rolls is so Tasty I recommed you to try this one.",
  },
  {
    id: "2",
    image: "images/pancakes@2x.jpg",
    title: "Pancakes",
    price: 20,
    text: " This Pan cakes is so Tasty I recommed you to try this one.",
  },
  {
    id: "3",
    image: "images/donuts@2x.jpg",
    title: "Donuts",
    price: 10,
    text: "  This Donuts is so Tasty I recommed you to try this one.",
  },
  {
    id: "4",
    image: "images/cake@2x.jpg",
    title: "Cakes",
    price: 25,
    text: " This Cakes is so Tasty I recommed you to try this one.",
  },
  {
    id: "5",
    image: "images/loaf-cakes@2x.jpg",
    title: "Loaf Cakes",
    price: 15,
    text: " This Loaf cakes is so Tasty I recommed you to try this one.",
  },
  {
    id: "6",
    image: "images/muffins@2x.jpg",
    title: "Muffins",
    price: 10,
    text: " This Muffins is so Tasty I recommed you to try this one.",
  },
];

const cartBtn = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartCloseBtn = document.querySelector(".cross");
const menuContainer = document.querySelector(".menu-container");
const totalAmount = document.querySelector(".total-amount");
const itemCount = document.querySelector(".items_count");
const cartContent = document.querySelector(".cart-content");
const removeBtn = document.querySelector(".remove-item");
const clearCartBtn = document.querySelector(".clear-btn");
const upBtn = document.querySelector(".fa-sort-up");
const downBtn = document.querySelector(".fa-sort-down");

let Cart = [];
let buttonsDOM = [];

class UI {
  constructor() {
    //Open & close cart
    cartBtn.addEventListener("click", this.showCart);
    cartCloseBtn.addEventListener("click", this.hideCart);

    // Display Menu-Items in DOM
    UpdateDOM.displayItems();

    // display Cart-items by localStorage
    Cart = Storage.getCart();
    this.setValues(Cart);
    Cart.map(item => {
      UpdateDOM.addItemToCartDOM(item);
    });

    //get and update the buttons
    this.getAllBtns();

    // Clear Cart
    this.cartLogic();
  }
  showCart() {
    cartOverlay.classList.add("cart-toggle");
  }
  hideCart() {
    cartOverlay.classList.remove("cart-toggle");
  }

  getAllBtns() {
    const buttons = [...document.querySelectorAll(".cart-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      const id = button.dataset.id;

      const alreadyAdded = Cart.find(item => item.id === id);

      if (alreadyAdded) {
        button.innerText = "Added";
        button.disabled = true;
      }
      button.addEventListener("click", () => {
        button.innerText = "Added";
        button.disabled = true;

        //Adding item to cart
        const item = {
          ...productData.find(item => item.id === id),
          quantity: 1,
        };
        Cart = [...Cart, item];
        UpdateDOM.addItemToCartDOM(item);

        //Save the Cart-items to localStorage
        Storage.saveCart(Cart);

        // setting the values of cart-item and cart-total
        this.setValues(Cart);

        //Added to Cart-dom

        //showCart
        this.showCart();
      });
    });
  }

  setValues(Cart) {
    let newTotalAmount = 0;
    let newItemCount = 0;
    Cart.map(item => {
      newTotalAmount += item.price * item.quantity;
      newItemCount += item.quantity;
    });
    itemCount.innerText = newItemCount;
    totalAmount.innerText = parseFloat(newTotalAmount.toFixed(2));
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());

    //Other events
    cartContent.addEventListener("click", e => {
      const target = e.target;

      //remove one cart-item
      if (target.classList.contains("remove-item")) {
        const id = target.dataset.id;
        const cartItem = target.parentElement.parentElement;
        this.removeFromCart(id);
        //remove form dom
        cartItem.remove();
      }

      //Increase Quantity
      else if (target.classList.contains("fa-sort-up")) {
        const id = target.dataset.id;
        const item = Cart.find(item => item.id === id);
        item.quantity += 1;
        //Updating in the DOM
        target.nextElementSibling.innerText = item.quantity;
        this.setValues(Cart);
        Storage.saveCart(Cart);
      }

      //Decrease Quantity
      else if (target.classList.contains("fa-sort-down")) {
        const id = target.dataset.id;
        const cartItem = target.parentElement.parentElement;
        const item = Cart.find(item => item.id === id);
        item.quantity -= 1;

        // when quantity is zero
        if (item.quantity <= 0) {
          this.removeFromCart(id);
          //remove from DOM
          cartItem.remove();
        }

        // Every thing is fine
        else {
          //Updating in the DOM
          target.previousElementSibling.innerText = item.quantity;
          this.setValues(Cart);
          Storage.saveCart(Cart);
        }
      }
    });
  }

  clearCart() {
    const ids = Cart.map(item => item.id);
    ids.forEach(id => this.removeFromCart(id));
    [...cartContent.children].forEach(child => child.remove());
    this.hideCart();
  }

  removeFromCart(id) {
    Cart = Cart.filter(item => item.id !== id);
    this.setValues(Cart);
    Storage.saveCart(Cart);

    //update buttons
    const btn = buttonsDOM.find(btn => btn.dataset.id === id);
    btn.innerText = "Add To Cart";
    btn.disabled = false;
  }
}

class UpdateDOM {
  static displayItems() {
    const result = productData
      .map(data => {
        const { image, id, title, price, text } = data;
        return `
      <!-- single-item -->
      <article class="item">
        <figure class="menu-image">
          <img src=${image} alt=${title} />
        </figure>

        <aside class="desc-container">
          <div class="disc">
            <h3 class="subtitle">${title}</h3>
            <p class="price">Starting price - <span>$${price}</span></p>
            <p class="para">
            ${text}
            </p>
            <button class="cart-btn btn" data-id=${id}>Add to cart</button>
          </div>
        </aside>
      </article>
      <!-- end of single-item -->`;
      })
      .join("");

    menuContainer.innerHTML = result;
  }

  static addItemToCartDOM(newItem) {
    const newItemDom = ` 
            <!-- single-cart-item -->
            <article class="cart-item">
              <figure class="img-container">
                <img src=${newItem.image} alt=${newItem.title} />
              </figure>
              <div class="text">
                <h3 class="item-name">${newItem.title}</h3>
                <h4 class="item-price">$${newItem.price}</h4>
                <h5 class="remove-item" data-id=${newItem.id}>remove</h5>
              </div>
              <div class="quantity-container">
                <i class="fas fa-sort-up" data-id=${newItem.id}></i>
                <p class="quantity">${newItem.quantity}</p>
                <i class="fas fa-sort-down" data-id=${newItem.id}></i>
              </div>
            </article>
            <!-- end of single-cart-item -->  `;
    cartContent.innerHTML += newItemDom;
  }
}

class Storage {
  static saveCart(Cart) {
    localStorage.setItem("cart", JSON.stringify(Cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();

  //close the cart if you click outside of cart
  window.addEventListener("click", e => {
    if (e.target.classList.contains("cart-overlay")) ui.hideCart();
  });
});
