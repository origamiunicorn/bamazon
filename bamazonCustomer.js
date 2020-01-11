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
    console.log("connected as id " + connection.threadId + "\n");
    listInventory();
    // start();
});

function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to [POST] an auction or [BID] on an auction?",
                choices: ["POST", "BID"],
                name: "initAction"
            }
        ]).then(function (response) {

            console.log(response.initAction);
            var newAction = response.initAction;

            switch (newAction) {
                case "POST":

                    postAuction();

                    break;
                case "BID":
                    break;
                case "EXIT":
                    break;
            }

        });
};

// function postAuction() {


//     // inquirer
//     //     .prompt([{
//     //         type: "input",
//     //         message: "What is the item you would like to submit?",
//     //         name: "item"
//     //     },
//     //     {
//     //         type: "input",
//     //         message: "What category would you like to place your auction in?",
//     //         name: "cat"
//     //     },
//     //     {
//     //         type: "number",
//     //         message: "What would you like your starting bid to be?",
//     //         name: "startBid"
//     //         validate: function (value) {
//     //             if (isNaN(value) === false) {
//     //                 return true;
//     //             }
//     //             return false;
//     //         }
//     //     }
//     //     ]).then(function (response) {
//     //         addItem(response.item, response.cat, response.startBid);
//     //     });
// };

// function addItem(item, cat, startBid) {
//     console.log("Adding new auction item...\n");
//     var query = connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//             item_name: item,
//             category: cat,
//             start_bid: startBid || 0,
//             high_bid: startBid || 0
//         },
//         function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " auction added!\n");
//             start();
//         }
//     );
//     console.log(query.sql);
// }

function listInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        // console.log(results);
        if (err) throw err;
        let inventoryArr = [];
        for (let i = 0; i < results.length; i++) {
            let inventoryObj = {};
            inventoryObj.id = results[i].item_id;
            inventoryObj.product_name = results[i].product_name;
            inventoryObj.price = results[i].price;
            inventoryArr.push(inventoryObj);
        }
        return printInventory(inventoryArr);
    })
}

function printInventory(inventory) {
    for (let i = 0; i < inventory.length; i++) {
        console.log(`${inventory[i].id}) ${inventory[i].product_name} - ${inventory[i].price}`);
    }
}

// function makeAuctionList() {
//     connection.query("SELECT * FROM auctions.item_name", function (err, res) {
//         if (err) throw err;
//         for (var i = 0; i < res.length; i++) {
//             console.log(res[i].id + " | " + res[i].item_name);
//         }
//     });
// }