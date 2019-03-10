Module.register("DailyXKCD", {

    // Default module config.
    defaults: {
        dailyJsonUrl: "http://xkcd.com/info.0.json",
        updateInterval: 10000 * 60 * 60, // 10 hours
        invertColors: false,
        max_height: 500,
        max_width: 500
    },

    start: function() {
        Log.info(this.config);
        Log.info("Starting module: " + this.name);

        this.dailyComic = "";
        this.dailyComicTitle = "";
        this.dailyComicAlt = "";

        this.current_comic_number = 0;

        this.getComic();
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    getComic: function(number, randomize) {
        Log.info("XKCD: Getting comic.");

        this.sendSocketNotification("GET_COMIC", {
            config: this.config,
            number: number,
            randomize: randomize
        });
    },

    socketNotificationReceived: function(notification, payload) {

        if (notification === "COMIC") {
            Log.info(payload.body.img+ "  ("+payload.body.num.toString()+")");
            this.dailyComic = payload.body.img;
            this.dailyComicTitle = payload.body.safe_title;
            this.dailyComicAlt = payload.body.alt;
            this.current_comic_number = payload.body.num;
            this.scheduleUpdate();
        }

    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.style.border = "thin solid #fff";

        var title = document.createElement("div");
        title.className = "bright large light";
        title.innerHTML = this.dailyComicTitle;



        var xkcd = document.createElement("img");
        xkcd.src = this.dailyComic;
        if (this.config.invertColors) {
                 xkcd.setAttribute("style", "-webkit-filter: invert(100%); max-width: 100%; max-height: 100%; height: 280px; ")
        }

        Log.log("X: "+xkcd.naturalWidth + ", Y:"+xkcd.naturalHeight);
        if(this.dailyComic != ""){
          if(xkcd.naturalWidth > xkcd.naturalHeight){
            xkcd.style.width = this.config.max_width+"px";
            xkcd.style.height = "";
          } else {
            xkcd.style.height = this.config.max_height+"px";
            xkcd.style.width = "";
          }
        }


        if (this.config.title) wrapper.appendChild(title);

        wrapper.appendChild(xkcd);

        if (this.config.altText) {
            var alt = document.createElement("div");
            alt.className = "bright medium light";
            alt.innerHTML = this.dailyComicAlt;
            wrapper.appendChild(alt);
        }


        return wrapper;
    },

    scheduleUpdate: function() {
        var self = this;

        self.updateDom(2000);

        setInterval(function() {
            self.getComic();
        }, this.config.updateInterval);
    },

    notificationReceived: function(notification, payload, sender){
      var self=this;
      switch(notification){
        case "NEXT_COMIC":
          self.getComic(this.current_comic_number + 1, false);
          break;
        case "PREVIOUS_COMIC":
          self.getComic(this.current_comic_number - 1, false);
          break;
        case "SHOW_COMIC":
          self.getComic(payload.number, false);
          break;
        case "RANDOM_COMIC":
          self.getComic(-1, true);
          break;
      }
    }

});
