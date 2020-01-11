const mysql = require("mysql");
const inquirer = require("inquirer");

const keys = require("./keys.js");
const mysqlPassword = keys.mysql.pw;

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: mysqlPassword,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    listInventory();
});

function listInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        // console.log(results);
        if (err) throw err;
        let inventoryArr = [];
        for (let i = 0; i < results.length; i++) {
            if (parseInt(results[i].stock) === 0) {
                // do nothing
            } else {
                let inventoryObj = {};
                inventoryObj.id = results[i].item_id;
                inventoryObj.product_name = results[i].product_name;
                inventoryObj.price = results[i].price;
                inventoryArr.push(inventoryObj);
            }
        }
        printInventory(inventoryArr);
        return start();
    })
};

function printInventory(inventory) {
    for (let i = 0; i < inventory.length; i++) {
        console.log(`${inventory[i].id} | ${inventory[i].product_name} - ${inventory[i].price}`);
    }
    console.log(``);
};

function start() {
    inquirer
        .prompt([
            {
                type: "number",
                message: "Input the ID of the product which you would like to purchase:",
                name: "productID"
            },
            {
                type: "number",
                message: "Input the number of units you would like to purchase:",
                name: "unitsGet"
            }
        ]).then(function (response) {

            let checkInv = response.productID;
            let changeInv = response.unitsGet;

            checkAndUpdate(checkInv, changeInv);

        });
};

function checkAndUpdate(checkInv, changeInv) {
    connection.query("SELECT item_id,product_name,price,stock FROM products WHERE item_id LIKE " + checkInv, function (err, res) {
        if (err) throw err;
        if (changeInv > parseInt(res[0].stock)) {
            console.log("Insufficient quantity.")
        } else {
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock: (parseInt(res[0].stock) - changeInv)
                    },
                    {
                        item_id: checkInv
                    }
                ],
                function (error) {
                    if (error) throw err;
                    console.log(`
${changeInv} order(s) for ${res[0].product_name} successfully submitted. Your total comes to \u0024${(parseFloat(res[0].price) * 2)}.
`
                    );
                    start();
                }
            );
        }
    })
};
