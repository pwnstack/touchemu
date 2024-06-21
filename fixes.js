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

    var touchEvent = new TouchEvent(events[e.type], {
      touches: [
        new Touch({
          identifier: Date.now(),
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
          force: e.type === "mouseup" ? 0 : 1
        })
      ],
      targetTouches: [],
      changedTouches: [
        new Touch({
          identifier: Date.now(),
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
          force: e.type === "mouseup" ? 0 : 1
        })
      ],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Dispatch the touch event
    e.target.dispatchEvent(touchEvent);
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
