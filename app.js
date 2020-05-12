// const express = require('express')
// var http = require("http");
// var url = require("url");
// var JSZip = require("jszip");
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => res.send('Hello World!'))

// // var req = http.get(url.parse("http://localhost"), function (res) {
// //   if (res.statusCode !== 200) {
// //     console.log("res.statusCode")
// //     console.log(res.statusCode);
// //     // handle error
// //     return;
// //   }

// app.listen(port, () => console.log(`Example app listening at http://localhost:3000`))

"use strict";

var https = require("https");
var url = require("url");

var req = https.get(url.parse("https://cdn.fbsbx.com/v/t59.2708-21/97084684_241566827096920_5284327881810378752_n.csv/myjob.csv?_nc_cat=110&_nc_sid=0cab14&_nc_ohc=Z5oNCtjZJo4AX_jRSTI&_nc_ht=cdn.fbsbx.com&oh=6d581d6b9fc8f6ea94f7bf7384ca0454&oe=5EBCC8A4"), function (res) {
    console.log("res.statusCode");
  if (res.statusCode !== 200) {
    //console.log(res.statusCode);
    // handle error
    return;
  }
  var data = [], dataLen = 0;

  // don't set the encoding, it will break everything !
  // or, if you must, set it to null. In that case the chunk will be a string.

  res.on("data", function (chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  });

  res.on("end", function () {
    var buf = Buffer.concat(data);
    
    console.log(buf.toString());
    
  });
});

req.on("error", function(err){
  // handle error
});

