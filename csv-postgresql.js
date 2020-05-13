const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("myjob.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    console.log("query");

    // create a new connection to the database
    const pool = new Pool({
      host: "localhost",
      user: "postgres",
      database: "testdb",
      password: "admin",
      port: 5432
    });

    console.log(csvData);
    const query =
      "INSERT INTO category (InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID, Country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          console.log(row);
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              //console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });
  });

stream.pipe(csvStream);
