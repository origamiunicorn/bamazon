const mysql = require("mysql");
const inquirer = require("inquirer");

const keys = require("./keys.js");
const mysqlPassword = keys.mysql.pw;

let totalPurch = 0;

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: mysqlPassword,
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(``);
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
        return makePurch();
    })
};

function printInventory(inventory) {
    for (let i = 0; i < inventory.length; i++) {
        console.log(`${inventory[i].id} | ${inventory[i].product_name} - ${inventory[i].price}`);
    }
    console.log(``);
};

function makePurch() {
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
        })
        .catch(
            function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            }
        );
};

function checkAndUpdate(checkInv, changeInv) {
    connection.query("SELECT item_id,product_name,price,stock FROM products WHERE item_id LIKE " + checkInv, function (err, res) {
        if (err) throw err;
        if (changeInv > parseInt(res[0].stock)) {
            console.log("Insufficient quantity in stock.")
            listInventory();
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
                    let addTax = (parseFloat(res[0].price)) + (parseFloat(res[0].price) * 0.0725);
                    let total = addTax.toFixed(2) * changeInv;
                    totalPurch = totalPurch + total;
                    console.log(`
${changeInv} order(s) for ${res[0].product_name} at \u0024${total} successfully submitted. 
Your order total is now \u0024${totalPurch}.
`);
                    checkDone();
                }
            );
        }
    });
};

function checkDone() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Would you like to make another purchase?",
                name: "newPurch",
                default: false
            }
        ]).then(function (response) {

            if (response.newPurch === true) {
                console.log(``);
                listInventory();
            } else {
                totalPurch = 0;
                connection.end();
                return;
            }

        });
};