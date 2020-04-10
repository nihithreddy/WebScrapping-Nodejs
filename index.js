const request_promise = require("request-promise");
const cheerio = require("cheerio");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const moviesURL =[
    "https://www.imdb.com/title/tt11912196/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=50MKM59J1FNXF8KHZBZ2&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt11912196&ref_=tt_tp_i_1",
    "https://www.imdb.com/title/tt9544034/?ref_=tt_sims_tti",
    "https://www.imdb.com/title/tt6473300/?ref_=tt_sims_tti"
];
(async () => {
     let imdbData = [];
     for(let movieURL of moviesURL){
     const response = await request_promise({
        uri:movieURL,
        gzip:true,//Response Type (Ex:json,gzip,..etc)
        headers:{
          accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding":"gzip, deflate, br",
          "accept-language":"en-GB,en-US;q=0.9,en;q=0.8"
        }
       });
    
      let $ = cheerio.load(response);
      let title = $('div[class="title_wrapper"] >h1').text().trim();
      let rating = $('div[class="ratingValue"] >strong >span').text();
      let summary = $('div[class="summary_text"]').text().trim();
      let release_data = $('a[title="See more release dates"]').text().trim();
      imdbData.push({title,rating,summary,release_data});
     }
    //For Converting JSON Data to a CSV File
    const json2csvparser = new json2csv();
    const csv = json2csvparser.parse(imdbData);
    //For creating a csv file
    fs.writeFileSync("./movie_info.csv",csv,"utf-8");
})();