var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
	
	start: function() {
		console.log("Starting node helper: " + this.name);
		
	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		//console.log("Notification: " + notification + " Payload: " + payload);
		
		if(notification === "GET_COMIC"){
			
			var comicJsonUri = payload.config.dailyJsonUrl;
			
			request(comicJsonUri, function (error, response, body) {
				if (!error && response.statusCode == 200) {
          var comicDays = [ 1,3,5 ];
          var dayNum = new Date().getDay(); 
          console.log("dayNum: "  + dayNum + " " + comicDays.indexOf(dayNum) );
					if ( (parseFloat(comicDays.indexOf(dayNum)) == parseFloat("-1")
              || payload.randomize == true)
              && (payload.number == undefined || payload.number == -1)) {
            //console.log("Random Comic");
            var comic = JSON.parse(body);                         
            var rndcomic = Math.floor((Math.random() * comic.num) + 1); 
            var rndUrl = "http://xkcd.com/" + rndcomic.toString() + "/info.0.json";
            console.log("Random url: " + rndUrl);
            request(rndUrl, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    self.sendSocketNotification("COMIC", {body: JSON.parse(body)});
                }
            });
					} else if(payload.number != undefined && payload.number > 0){
            var Url = "http://xkcd.com/" + payload.number.toString() + "/info.0.json";
            console.log("Specific comic url: " + Url);
            request(Url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    self.sendSocketNotification("COMIC", {body: JSON.parse(body)});
                }
            });
          } else {
            console.log("New Comic");
            self.sendSocketNotification("COMIC", {body: JSON.parse(body), daily: true});
					}
				}
			});
		}
	},
});
