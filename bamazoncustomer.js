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
    showAll();
    start();
  });
  
  function start() {
    connection.query("SELECT * FROM products ",
    function(err, results) {
      if (err) throw err;
      var id;
      // var choiceArray = [];
      // for (var i = 0; i < results.length; i++) {
      //   choiceArray.push(results[i].id);
      // }
      // console.log(choiceArray)
    

    inquirer
      .prompt(
        {
        name: "id",
        type: "list",
        message: "Please select the id of the product you would like to buy!",
        choices: ["1","2","3","4","5","6","7","8","9","10"]
        //choices: choiceArray
        }
   
        )
      .then(function(answer) {
        id = parseInt(answer.id);
        inquirer.prompt(
          {
            name: "units",
            type: "input",
            message: "How many units of the product you would like to buy?",
            
            }
        ).then(function(answer){
          var unit = parseInt(answer.units);
          console.log("selected id: "+ id + " selected quatity: "+ unit);
          checkStock(id,unit);
        }
      )
      
      })
      .catch((error) => {
        console.log(error)
      });;
  })
};


  function checkStock(id,unit){
        connection.query("SELECT * FROM products WHERE id = ?",id,
        function(err, results) {
          if (err) throw err;
        if (unit < results[0].stock_quantity) {
          var newStockQuantity = results[0].stock_quantity - unit;
          var costOfPurchase = unit*results[0].price;
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStockQuantity
              },
              {
                id: id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              console.log("Order Placed successfully"+"/n Your total cost of purchase is: "+ costOfPurchase);

              start();
            }
          );
        }
        else {
          
          console.log("Our stocks are too low for this order. Please Try again later...");
          start();
        }
      })
    };

function showAll(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      console.log("Id: " + results[i].id + " || Product Name: " + results[i].product_name + " || Price of the product: " + results[i].price);
    }
   
}
)}  