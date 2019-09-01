const Papa = require("papaparse");
const fs = require("fs");

const CSVToJSON = CSV => {
  Papa.parse(CSV, {
    download: true,

    // Header creates the key:value tags rather than one large object, providing more organization
    header: true,
    complete: function(results) {
      const fileName = "convertedJSON.json";
      // Saves the converted CSV file to JSON
      fs.writeFile(fileName, JSON.stringify(results.data), function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log(
            "----\n Success! Your converted JSON file is saved under the name: " +
              fileName +
              "\n----\n"
          );
          getStocks(results.data);
        }
      });
    }
  });
};

const getStocks = data => {
  // Initializing stocks array
  let stocks = [];
  console.log("Grabbing stocks, please wait...");
  for (let i = data.length - 1; i >= 0; i--) {
    // Checks to only add completed and bought stocks
    if (data[i].state === "filled" && data[i].side === "buy") {
      // Checks if the stocks symbol is already in the object, otherwise, adds it
      if (data[i].symbol in stocks) {
        // Adds the stock symbol (ex: AAPL, SNAP, SPOT) into the object
        stocks[data[i].symbol] += parseInt(data[i].quantity);
      } else {  
        // Creates a new symbol in the object and sets a quatity to it
        stocks[data[i].symbol] = parseInt(data[i].quantity);
      }
      // Handles sucessfully sold stocks
    } else if (data[i].state === "filled" && data[i].side === "sell" && data[i].symbol in stocks) {
        // Substracts the bought shares by the sold shares in order to retain only what is currently being held
        stocks[data[i].symbol] -= parseInt(data[i].quantity);
    }
  }
  console.log("Done grabbing stocks!\n");
  removeSold(stocks);
};

const removeSold = (stocks) => {
  let quantity = Object.values(stocks);
  let shares = Object.keys(stocks);
  for (let i = 0; i < quantity.length; i++) {
    // If the quantity of held stocks is 0, then that stock symbol will be removed 
    if (quantity[i] === 0) {
      // Removes any stock with 0 shares
      delete stocks[shares[i]];
    }
  }
  averagePrices(stocks) 
}


module.exports = {
  convertType: CSVToJSON
};
