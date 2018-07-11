var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cors = require('cors');
var app = express();

var json = {};

app.use(cors);

app.get('/scrape', function(req, res) {
  // console.log(req.query.name);
  console.log("HIYA");
  var url = 'https://sneakernews.com/2018/07/03/adidas-yeezy-fall-2018-release-info/';

request(url, function(error, response, html) {
  if (!error) {
    console.log("no error...");
    var $ = cheerio.load(html);
    var shoeImgs = [];
    var shoeDetails = [];

    $('.latest_posts').siblings().each(function(i, elem) {
      if (elem.name === 'p' && $(this).siblings('div')) {
        if ($(this).children('img')) {
          var imgSrc = $(this).children('img').attr('src');
          // console.log(imgSrc, "... imgSrc");
          shoeImgs.push(imgSrc);
        }
      }
    })

    $('.rel-full').children().children().each(function(i, elem) {
      var relDate = $(this).children().eq(2).text().slice(14);
      var name = $(this).children().eq(0).text();
      var price = $(this).last().text();
      var shortPrice = '$' + price.substr(price.length - 3);
      shoeDetails.push([name, relDate, shortPrice]);
    })

    shoeImgs.shift();

    for (let i = 0; i < shoeImgs.length; i++) {
      json[i] = {};
      json[i].imgUrl = shoeImgs[i];
    };

    for (let i = 0; i < shoeDetails.length; i++) {
      json[i].name = shoeDetails[i][0];
      json[i].relDate = shoeDetails[i][1];
      json[i].price = shoeDetails[i][2];
    };
  }

  fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
    console.log('File successfully written! - Check your project directory for the output.json file!');
  })

  res.send("yo did it")
})

})

app.get('/', function(req, res) {
  res.json({
    message: "hello you are not going crazy"
  })
})

app.listen('4000');
console.log('Listening on port 4000');
