DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(300) NOT NULL,
    department_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,4) NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products
    (product_name, department_name, price, stock)
VALUES
    ("Kong", "Dog Toys", 15.99, 3),
    ("Feather Teaser", "Cat Toys", 11.99, 2),
    ("Lamb Chop Chew Toy", "Dog Toys", 4.99, 2),
    ("Mammoth Tire Medium", "Dog Toys", 8.99, 3),
    ("Catnip Mouse", "Cat Toys", 0.99, 15),
    ("Kitty Laser Pointer", "Cat Toys", 3.99, 3),
    ("Mylar Balls", "Cat Toys", 4.99, 2),
    ("ChuckIt Large", "Dog Toys", 15.99, 2),
    ("Magic Gem Chew Toy", "Dog Toys", 7.99, 5),
    ("Kong Narwhale Catnip Toy", "Cat Toys", .99, 2);

SELECT * FROM products;