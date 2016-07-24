VideoJS Time Tracker
====================

VideoJS Time Tracker with possibility to pick up where we last left off.

## How to use?

```js
VideoPlayer.initialize(
  videojs('my-video', {
      playbackRates: [.5, .75, 1, 1.25, 1.5, 1.75, 2],
      fluid: true
  }),
  RequestUtils.queryParam("time"),
  RequestUtils.queryParam("autoplay")
);
```