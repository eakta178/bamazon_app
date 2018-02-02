

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
    console.log('connected as id:', connection.threadId); 
    start();
  });


function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
          case "View Products for Sale":
            viewProductList();
            break;
          case "View Low Inventory":
            viewLowInventory();
            break;
          case "Add to Inventory":
            addInventory();
            break;
          case "Add New Product":
            addProduct();
            break;
        }
      });
  }
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, 
// names, prices, and quantities.
  function viewProductList(){
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
  
      for (var i = 0; i < results.length; i++) {
        console.log("Id: " + results[i].id + " || Product Name: " + results[i].product_name 
        + " || Price of the product: " + results[i].price + " || Quantity of the product: " + results[i].stock_quantity);
      }
      start();
  }

  )
  
};

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower 
// than five.
function viewLowInventory(){
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
  
      for (var i = 0; i < results.length; i++) {
        if(results[i].stock_quantity < 5){
            console.log("Here are the items low on inventory...");
            console.log("Id: " + results[i].id + " || Product Name: " + results[i].product_name 
            + " || Price of the product: " + results[i].price + " || Quantity of the product: " + results[i].stock_quantity);
          
            }
        else{
            console.log("There is no product low in inventory");
        }
        }
        start();
  }
    
  )
  
};

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager 
// "add more" of any item currently in the store.
function addInventory(){
    connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "Which item you want to add more to?"
        },
        {
          name: "unit",
          type: "input",
          message: "How many units you would you like to add?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItem.stock_quantity + parseInt(answer.unit)
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Inventory updated successfully!");
              start();
            }
          );
        

      });
  });
};

// If a manager selects Add New Product, it should allow the manager to add a completely new product
//  to the store.
function addProduct(){
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the product you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department you would you like to add the product in?"
      },
      {
        name: "stock",
        type: "input",
        message: "What is the quantity you would like to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of a unit of the product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: answer.name,
            department_name: answer.department,
            stock_quantity: parseInt(answer.stock),
            price: parseInt(answer.price)
        },
        function(err) {
          if (err) throw err;
          console.log("Your product was created successfully!");
        
          start();
        }
      );
    });
}