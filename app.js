
"use strict";
const fs = require("fs");
const Pool = require("pg").Pool;
const fastcsv = require("fast-csv");
var https = require("https");
var url = require("url");

// create a new connection to the database
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "testdb",
  password: "admin",
  port: 5432
});

var csv_url = "https://cdn.fbsbx.com/v/t59.2708-21/97269798_268455104293348_9172572718455848960_n.csv/test.csv?_nc_cat=108&_nc_sid=0cab14&_nc_ohc=ypAqgSuDcRwAX_wPA_d&_nc_ht=cdn.fbsbx.com&oh=1a8af45cf928385087e7ec25156520d0&oe=5EBD5971";

var req = https.get(url.parse(csv_url), function (res) {
  if (res.statusCode !== 200) {
    return;
  }
  var data = [], dataLen = 0;
  var csvData = [];
  res.on("data", function (chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  });

  const query =
    "INSERT INTO category (InvoiceNo, StockCode, Description, Quantity, InvoiceDate, UnitPrice, CustomerID, Country) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  res.on("end", function () {
    var buf = Buffer.concat(data);
    var datas = buf.toString();
    var str = datas.split("\n");
    // remove the first line: header
    str.shift();
    str.forEach(rows => {
      var element = rows.split(",");
      if (rows != "") {
        csvData.push(element);
      }
    })

    console.log(csvData);

    //const createquery = "CREATE TABLE IF NOT EXISTS category (username Text(45) NOT NULL, password varchar(450) NOT NULL, enabled integer NOT NULL DEFAULT '1',PRIMARY KEY (username))";
    pool.connect((err, client, done) => {
      if (err) throw err;

      try {
        csvData.forEach(row => {
          client.query(query, row, (err, res) => {
            if (err) {
              console.log(err.stack);
            } else {
              console.log("inserted " + res.rowCount + " row:", row);
            }
          });
        });
      } finally {
        done();
      }
    });


  });
});

req.on("error", function (err) {
  // handle error
  console.log(error);
});



