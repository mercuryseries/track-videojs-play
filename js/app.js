/**
 * VideoJS Time Tracker with possibility to pick up where we last left off.
 *
 * 24/07/2016
 *
 * @author Honore Hounwanou
 */

// Video Tracking Timer
var playerRecordingLoop;

// Adapter for localStorage in order to be able to switch WebStore easily
var WebStore = {
    get: function(item) {
        return localStorage.getItem(item);
    },
    set: function(item, value) {
        return localStorage.setItem(item, value);
    },
    remove: function(item) {
        return localStorage.removeItem(item);
    }
};

// Small Utility for retrieving a QueryString param.
var RequestUtils = {
    queryParam: function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
};

// Main VideoPlayer Object
var VideoPlayer = {

    initialize: function(player, time, autoplay) {
        this.player = player;
        this.time = time;
        this.autoplay = autoplay;
        this.addEventListeners();
    },

    addEventListeners: function() {
        this.player.ready(this.onLoad.bind(this));
        this.player.on("play", this.onPlay.bind(this));
        this.player.on("ended", this.onEnd.bind(this));
        this.player.on("volumechange", this.onVolumeChange.bind(this));

        // Playback rates listeners
        var playbackRates = document.querySelectorAll('.vjs-menu-item');
        for (var i = 0; i < playbackRates.length; i++) {
          playbackRates[i].addEventListener('click', this.onPlaybackRateChange.bind(this), false);
        }
    },

    onLoad: function() {
        this.setStartPoint().setDefaultVolume().setDefaultPlaybackSpeed().promptUser();
    },

    onPlay: function() {
        if(this.currentTime() <= 1) {
            this.startAt(0);
        }

        this.beginRecordingPosition();
    },

    onEnd: function() {
        this.stopRecordingPosition();
    },

    beginRecordingPosition: function() {
        playerRecordingLoop = setInterval(function() {
            WebStore.set(this.id(), this.currentTime());
        }.bind(this), 3000);
    },

    stopRecordingPosition: function() {
        clearInterval(playerRecordingLoop);
        WebStore.remove(this.id());
    },

    onVolumeChange: function() {
        WebStore.set("tdn_volume", this.player.volume());
    },

    onPlaybackRateChange: function() {
        WebStore.set("tdn_playback_speed", this.player.playbackRate());
    },

    setStartPoint: function() {
        this.startAt(this.getVideoStartTime());
        return this;
    },

    setDefaultVolume: function() {
        var currentVolume = WebStore.get("tdn_volume");

        if(currentVolume) {
            this.player.volume(currentVolume);
        }

        return this;
    },

    setDefaultPlaybackSpeed: function() {
        var currentPlayBackSpeed = WebStore.get("tdn_playback_speed");

        if(currentPlayBackSpeed) {
            this.player.playbackRate(currentPlayBackSpeed);
        }

        return this;
    },

    hasPreviouslyBeenWatched: function() {
        var secondsWatchedSoFar = WebStore.get(this.id());
        return (secondsWatchedSoFar && secondsWatchedSoFar > 3)
    },

    secondsWatchedSoFar: function() {
        return WebStore.get(this.id()) - 3;
    },

    promptUser: function() {
        if(this.hasPreviouslyBeenWatched() && !this.time) {
            return this.promptUserToContinue();
        }

        if(this.autoplay) {
            this.play();
        }

        return this;
    },

    play: function() {
        this.player.play();
    },

    promptUserToContinue: function() {
        var that = this;
        swal({
            title: "Continuer la vidéo",
            text: "Souhaitez-vous reprendre là où vous vous êtes arrêté?",
            html: true,
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Recommencer"
        }, function(confirm) {
            if( confirm ) {
                return that.startAt(that.secondsWatchedSoFar()).play();
            }

            that.stopRecordingPosition();
            return that.startAt(that.getVideoStartTime()).play();
        });
    },

    startAt: function(time) {
        return this.player.currentTime(time);
    },

    currentTime: function() {
        return this.player.currentTime();
    },

    id: function() {
        return "tdn_video:" + location.pathname;
    },

    getVideoStartTime: function() {
        if (!this.time) return 1;
        if (this.time.indexOf(":") > -1) {
            var t = this.time.split(":");
            return 60 * parseInt(t[0]) + parseInt(t[1]);
        }
        return parseInt(this.time);
    }
};