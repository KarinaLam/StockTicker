const express = require("express");
const bodyParser = require("body-parser");
const e = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/example", (req, res) => {
  var query = req.body.stomp;
  //   res.send(`Entered:${req.body.stomp}.`);

  // Importing http module
  var http = require("http");

  const MongoClient = require("mongodb").MongoClient;

  const url =
    "mongodb+srv://karina:HZAQPa1*@cluster0.0pekt.mongodb.net/HW14?retryWrites=true&w=majority"; // connection string goes here

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) {
      console.log("Connection err: " + err);
      return;
    }

    var dbo = db.db("HW14");
    var coll = dbo.collection("companies");
    console.log("before find");
    //theQuery = {author:"Bob Smith"};
    var theQuery = "";
    function querier(type, quer) {
      if (type == "comp") {
        theQuery = '{"Company":' + '"' + quer + '"}';
      } else if (type == "tick") {
        theQuery = '{"Ticker":' + '"' + quer + '"}';
      }
      return theQuery;
    }
    var typ = req.body.type;
    console.log("typ: " + typ);
    theQuery = JSON.parse(querier(typ, query));
    console.log("theQuery: " + theQuery);
    const func = async () => {
      var toSend = "";
      coll.find(theQuery).toArray(function (err, items) {
        if (err) {
          console.log("Error: " + err);
        } else {
          console.log("Items: ");
          for (i = 0; i < items.length; i++) {
            // console.log(i + ": " + items[i].title + " by: " + items[i].author);
            // console.log("here");
            console.log(
              "Company Name: " +
                items[i].Company +
                "<br/>" +
                "Stock Ticker Symbol: " +
                items[i].Ticker
            );
            // console.log("there");
            toSend =
              toSend +
              "Company Name: " +
              items[i].Company +
              "<br/>" +
              "Stock Ticker Symbol: " +
              items[i].Ticker +
              "<br/>";
          }
          res.send(toSend);
        }
        // Setting up PORT
        const PORT = process.env.PORT || 3000;

        // Creating http Server
        //   var httpServer = http.createServer(function (request, response) {
        //     // Writing string data
        //     response.write("Heyy geeksforgeeks ", "utf8", () => {
        //       console.log("Writing string Data...");
        //     });

        //     // Prints Output on the browser in response
        //     response.end(" ok");
        //   });

        // Listening to http Server
        //   httpServer.listen(PORT, () => {
        //     console.log("Server is running at port 3000...");
        //   });
        db.close();
        console.log("after close");
      }); //end find
    };
    func();
  }); //end connect
});

const port = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port${port}`);
});
