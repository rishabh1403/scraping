'use strict';
/* global require,console */

// request- library to send http request, gets data which we are scraping
// cheerio- library which helps in scraping html response
// fs- library which helps in writing output to json file

let request = require('request'); 
let cheerio = require('cheerio');
let fs = require('fs');

// url - the url which was provided, change to some other url of
// tripadvisor with similar page content for their result

let url = `https://www.tripadvisor.in/Attractions-g187497-Activities-Barcelona_Catalonia.html`;

// end result data

let scraped = [];

request(url, (err, res, html) => {
    if (!err) {

    	//loading html in library for further scraping
        let $ = cheerio.load(html);

        // it was found that this #... id had all data in dom
        // extracting its children to loop over then and scrape data

        let child = $('#taplc_attraction_coverpage_attraction_0').children();

        //looping over all of the data except first

        child.each(function(i, elem) {

        	// a holder data object 

            let data = {};
            if (i > 0) {
            	// extracting header
                let header = $(elem).find($('.shelf_title_container')).find('a').text();
                data.title = header;

                // extracting data list 
                let listContainer = $(elem).find($('.shelf_item_container')).children();
                let details = [];

                //iterating over data array and scraping particular details like
                // image, name, reviews, details

                listContainer.each(function(i, ele) {
                    let deatiledData = {};
                    let listDataHolder = $(ele).find($('.poi')).find($('.item'));
                    let imageDetail = $(ele).find($('.poi')).find($('.photo_image')).attr('src');
                    let name = $(listDataHolder[0]).find('a').text();
                    let review = $(listDataHolder[1]).find('a').text();
                    let detailName = $(listDataHolder[2]).text();
                    deatiledData.image = imageDetail;
                    deatiledData.name = name;
                    deatiledData.review = review;
                    deatiledData.details = detailName;
                    details.push(deatiledData);

                });

                // creating a json data and pushing to our array
                data.details = details;
                scraped.push(data);
            }

        });
        // saving data to our file 
        fs.writeFile('output.json', JSON.stringify(scraped, null, 4), err => {
            if (err) {
                console.log("Something went wrong");
            } else {
                console.log('File successfully written! - Check your project directory for the output.json file');
            }

        });

    }

});