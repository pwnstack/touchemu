var events = {
  "mousedown": "touchstart",
  "mouseup": "touchend",
  "mousemove": "touchmove"
};

var mouseDown = false;

var handleEvents = function (e) {
  try {
    if (e.type === "mousedown") mouseDown = true;
    else if (e.type === "mouseup") mouseDown = false;

    if (!mouseDown && e.type === "mousemove") return;

    // Check if TouchEvent is supported
    if (typeof TouchEvent !== 'undefined') {
      // Create touch event using TouchEvent
      var touchEvent = new TouchEvent(events[e.type], {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        touches: [{
          target: e.target,
          identifier: Date.now(),
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pageX: e.pageX,
          pageY: e.pageY
        }],
        changedTouches: [{
          target: e.target,
          identifier: Date.now(),
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          pageX: e.pageX,
          pageY: e.pageY
        }]
      });

      // Dispatch touch event
      e.target.dispatchEvent(touchEvent);
    } else {
      // Create custom touch event
      var customTouchEvent = document.createEvent('Event');
      customTouchEvent.initEvent(events[e.type], true, true);
      customTouchEvent.touches = [{
        target: e.target,
        identifier: Date.now(),
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pageX: e.pageX,
        pageY: e.pageY
      }];
      customTouchEvent.changedTouches = [{
        target: e.target,
        identifier: Date.now(),
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        pageX: e.pageX,
        pageY: e.pageY
      }];

      // Dispatch custom touch event
      e.target.dispatchEvent(customTouchEvent);
    }
  } catch (err) {
    console.error(err);
  }

  e.stopPropagation();
  // e.preventDefault();
  return false;
};

try {
  for (var id in events) {
    document.body.addEventListener(id, handleEvents, true);
  }
} catch (err) {
  console.error(err);
}

/* Popups */

(function () {

  /**
   * @param {Record<string, { title: string, messages: string[] }>} texts
   * @param {{ url: string, text: string }} link
   */
  async function sendPopup(texts, link) {
    const languagesInitialized = new Promise(resolve => {
      const interval = setInterval(() => {
        if (window.Config && window.Config.language) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });

    await languagesInitialized;

    // Proceed with sending popup logic
    console.log("Languages initialized, proceeding with sending popup...");
    // Add the popup sending logic here.
  }

})();
