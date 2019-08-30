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
  for (let i = 0; i < data.length; i++) {
    // Checks to only add completed and bought stocks
    if (data[i].state === "filled" && data[i].side === "buy") {
      console.log("bought " + data[i].quantity + " " + data[i].symbol);
      if (data[i].symbol in stocks) {
        // Adds the stock symbol (ex: AAPL, SNAP, SPOT) into the object
        stocks[data[i].symbol] += parseInt(data[i].quantity);
      } else {  
        // Creates a new symbol in the object and sets a quatity to it
        stocks[data[i].symbol] = parseInt(data[i].quantity);
      }
    } else if (data[i].state === "filled" && data[i].side === "sell") {
      // Substracts the bought shares by the sold shares in order to retain only what is currently being held
      stocks[data[i].symbol] -= parseInt(data[i].quantity);
      console.log("sold" + data[i].quantity + " " + data[i].symbol);
    } else {
      console.log(
        "whuuuut" +
          data[i].symbol +
          " " +
          data[i].state +
          data[i].side +
          " " +   
          data[i].quantity
      );
    }
  }
  console.log(stocks);
  console.log("Done grabbing stocks!\n");
};

const deDupe = arr => {
  console.log("Now removing all duplicate stocks, please wait...");
  let dedupedArr = arr.filter((elem, index, self) => {
    return index === self.indexOf(elem);
  });
  console.log(dedupedArr);
};

module.exports = {
  convertType: CSVToJSON
};
