VideoJS Time Tracker
====================

VideoJS Time Tracker with possibility to pick up where we last left off.

## How to use?

```js
VideoPlayerTracker.initialize(
  videojs('my-video', {
      playbackRates: [.5, .75, 1, 1.25, 1.5, 1.75, 2],
      fluid: true
  }),
  RequestUtils.queryParam("time"),
  RequestUtils.queryParam("autoplay")
);
```

### Autoplay

Add ?autoplay=true to the url

### Start at a specific time

Add ?time=30 (Time in seconds) or if you prefer you can use the format '03:00' like ?time=03:00

### Guess what :) ?

For both autoplay and start at a specific time:

http://mywebsite.com/video/great-video?time=60&autoplay=true

Enjoy !