var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Crawler = require("js-crawler");


app.get('/scrape', function(req, res){
   new Crawler().configure({ shouldCrawl: function(url) {
    return url.indexOf("mazdaoftoronto.com") > 0;
  }, depth: Number.POSITIVE_INFINITY})
  .crawl("http://www.mazdaoftoronto.com", function(page) {
    console.log(page.url);

   request(page.url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

    var url, name, price, mileage, body, engine, transmission, code;
    var json = { url: "", name : "", price : "", mileage : "", body : "", engine : "", transmission : "", code : ""};
    json.url =  page.url;
      $('.yui3-u-2-3 .ddc-content.content-page-title .bd h1').filter(function(){
        var data = $(this);
        json.name = data.text();
    })

    $('strong.h1.price').filter(function(){
        var data = $(this);
        json.price =  data.text();
    })

    $('.fuel-efficiency em').filter(function(){
        var data = $(this);
        json.mileage =  data.text();
    })

    $('.bodyStyle .value').filter(function(){
        var data = $(this);
        json.body =  data.text();
    })

    $('.engine .value').filter(function(){
        var data = $(this);
        json.engine =  data.text();
    })

    $('.transmission .value').filter(function(){
        var data = $(this);
        json.transmission =  data.text();
    })

     $('.modelCode .value').filter(function(){
        var data = $(this);
        json.code =  data.text();
    })
}


if(json.name&&json.price&&json.mileage&&json.code){
fs.appendFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('output.json file');

})

}

    }) ;
  }, function(response) {
    console.log("ERROR occurred:");
    console.log(response.status);
    console.log(response.url);
    console.log(response.referer);
  });
 res.send('yo'); 
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;