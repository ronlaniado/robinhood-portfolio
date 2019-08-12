const fs = require("fs");
const CSV = fs.createReadStream("./robinhood.csv");
const CSVToJSON = require("./CSVToJSON");

CSVToJSON.convertType(CSV);