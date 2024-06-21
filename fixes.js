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

    var touchEvent = document.createEvent("TouchEvent");
    touchEvent.initTouchEvent(
      events[e.type],   
      true,            
      true,           
      window,            
      1,                 
      e.clientX,        
      e.clientY,        
      e.pageX,           
      e.pageY,           
      false,             
      false,            
      false,             
      false,             
      null,              
      null,              
      null              
    );

    e.target.dispatchEvent(touchEvent);
  } catch (err) {
    console.error(err);
  }

  e.stopPropagation();
  return false;
};

try {
  for (var id in events) {
    document.body.addEventListener(id, handleEvents, true);
  }
} catch (err) {
  console.error(err);
}


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
