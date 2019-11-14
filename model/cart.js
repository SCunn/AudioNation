module.exports = function Cart(cart) {  //create Cart constructor function, module.exports makes code available when called elsewhere
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

// add new items to the shopping cart 
    this.add = function(item, id) {
        //console.log("item:",item)
        var cartItem = this.items[id]; 
        // check to see if the item added to cart is already there 
        if (!cartItem) {    // if not, create a new item
            cartItem = this.items[id] = {item: item, quantity: 0, price: 0}; // Use <%= item.item.JSON object %> in ejs
        }
        cartItem.quantity++;    // increase quantity by 1
        cartItem.price = cartItem.item.price * cartItem.quantity;   // calculate the price of the item by the quantity  
        // This section updates the total quantity and price
        this.totalItems++;
        this.totalPrice += cartItem.item.price;
    };

    this.remove = function(id) {
        this.totalItems -= this.items[id].quantity;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };
    
    //generate an array to output an array of product lists
    this.getItems = function() {    
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        console.log(arr)
        return arr;
    };
};