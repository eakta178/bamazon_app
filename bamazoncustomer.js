// Then create a Node application called bamazonCustomer.js. 

var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Run4g@ld',
    database: 'bamazon'

});

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log('connected as id:', connection.threadId);
    showAll();
    start();
  });
  // The app should then prompt users with two messages.
  // function which prompts the user for what action they should take
  // The first should ask them the ID of the product they would like to buy.
  // The second message should ask how many units of the product they would like to buy.
  function start() {
    inquirer
      .prompt({
        name: "id",
        type: "rawlist",
        message: "Please select the id of the product you would like to buy!",
        choices: [1,2,3,4,5,6,7,8,9,10]
            },
        {
        name: "units",
        type: "input",
        message: "How many units of the product youw would like to buy?",
        
        })
      .then(function(answer) {
        checkStock(answer);
      
      });
  }

  function checkStock(answer){
    // Once the customer has placed the order, your application should check if your store has enough of 
    // the product to meet the customer's request.
        connection.query("SELECT * FROM products WHERE ?",
        [{id: answer.id}],
        function(err, results) {
          if (err) throw err;
        if (parseInt(answer.units) < results.stock_quantity) {
          // However, if your store does have enough of the product, you should fulfill the customer's order.
          // This means updating the SQL database to reflect the remaining quantity.
          var newStockQuantity = results.stock_quantity - answer.units;
          var costOfPurchase = parseInt(answer.units)*results.price;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStockQuantity
              },
              {
                id: answer.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              // Once the update goes through, show the customer the total cost of their purchase.
              console.log("Order Placed successfully"+"/n Your total cost of purchase is: "+ costOfPurchase);

              start();
            }
          );
        }
        // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from 
        // going through.
        else {
          
          console.log("Our stocks are too low for this order. Please Try again later...");
          start();
        }
      })
    };

//Running this application will first display all of the items available for sale. Include the ids, names, and 
// prices of products for sale.
function showAll(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      console.log("Id: " + results[i].id + " || Product Name: " + results[i].product_name + " || Price of the product: " + results[i].price);
    }
   
}
)}  