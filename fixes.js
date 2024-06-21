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
    if (window.chrome) {
      const touchObj = new Touch({
        identifier: 0,
        target: e.target,
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        screenX: e.screenX,
        screenY: e.screenY,
        radiusX: 11.5,
        radiusY: 11.5,
        rotationAngle: 0,
        force: e.type === "mouseup" ? 0 : 1,
      });
  
      const touchEvent = new TouchEvent(events[e.type], {
        cancelable: true,
        bubbles: true,
        touches: e.type === "mouseup" ? [] : [touchObj],
        targetTouches: e.type === "mouseup" ? [] : [touchObj],
        changedTouches: [touchObj],
        shiftKey: false,
        composed: true,
        isTrusted: true,
        sourceCapabilities: new InputDeviceCapabilities({ firesTouchEvents: true }),
        view: window
      });
  
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
