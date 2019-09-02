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

    // Removes all stocks with 0 shares from object
    if (stocks[data[i].symbol] === 0) {
      delete stocks[data[i].symbol];
    }
  }
  console.log("Done grabbing stocks!\n");
  console.log(stocks);
  averagePrices(stocks, data)
};

const averagePrices = (stocks, data) => {
  console.log("Calculating average prices...\n ------ \n");
  let symbols = Object.keys(stocks);
  let averages = [];
  for (let i = 0; i < data.length; i++) {
    // Looks for the symbol in data object
    if (symbols.includes(data[i].symbol)) {
      // Finds the index at which the symbol is found
      let index = symbols.indexOf(data[i].symbol);
      // Removes the symbol from array to avoid repeating 
      symbols.splice(index, 1);
      // Gets the average price paid, round it to 2 decimal places, and puts it into the averages object
      averages[data[i].symbol] = parseFloat(data[i].average_price).toFixed(2);
    }
  }
  console.log (averages);
  console.log("\n ------ \nDone calculating average prices for held stocks! \n ------");
  
}

module.exports = {
  convertType: CSVToJSON
};
