

-- The products table should have each of the following columns:

-- item_id (unique id for each product)

-- product_name (Name of product)

-- department_name

-- price (cost to customer)

-- stock_quantity (how much of the product is available in stores)

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER(10) AUTO_INCREMENT,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(200) NOT NULL,
price int(20) NOT NULL,
stock_quantity int(20) NOT NULL,
PRIMARY KEY(id)
  
);