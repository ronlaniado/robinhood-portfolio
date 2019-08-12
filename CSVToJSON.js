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

const getStocks = (data) => {
  //Initializing stocks array
  let stocks = []

  // Store JSON data into a local array
  let dataArray = data; 
  console.log("Grabbing stocks, please wait...");
  console.log(dataArray);

  for (let i = 0; i < data.length; i++) {
    if (data[i].execution_state === "completed" && data[i].side === "buy") {
      stocks[i] += data[i].symbol;
    }
    console.log(stocks);
  }
};

module.exports = {
  convertType: CSVToJSON
};
