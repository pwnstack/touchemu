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
      e.stopPropagation();
      return false;
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

    const TouchEmuLogoLoaded = new Promise(resolve => {
      const TouchEmuLogo = new Image();
      TouchEmuLogo.addEventListener('load', resolve);
      TouchEmuLogo.src = "https://www.touch-emu.com/assets/orb-816d0dd3.webp";
    });

    await Promise.all([
      languagesInitialized,
      TouchEmuLogoLoaded
    ]);

    const translatedTexts = texts[window.Config.language] || texts['en'] || texts[Object.keys(texts)[0]];

    window.gui.openSimplePopup(`
      <div>
        ${translatedTexts.messages.join('<br />')}<br />
        <a target="_blank" href="${link.url}" style="text-align: center; font-size: 1.2em; display: inline-block; width: 100%; margin-top: 0.4em; text-decoration: none;">
          <img src="https://www.touch-emu.com/assets/orb-816d0dd3.webp" style="height: 1.2em; display: inline-block; vertical-align: middle;"/>
          <span style="vertical-align: middle;">${link.text}</span>
        </a>
      </div>
    `, translatedTexts.title);
  }

  // New website notification
  if (!window.top.TouchEmuVersion) { // TouchEmu <= 2.5.2 does not have TouchEmuVersion
    const lastAsked = window.localStorage.getItem('TouchEmu-update-popup');
    if (!lastAsked || Date.now() > parseInt(lastAsked) + 1000 * 60 * 60 * 24 * 7) { // 1 week
      window.localStorage.setItem('TouchEmu-update-popup', Date.now())

      const texts = {
        fr: {
          title: `Notification de TouchEmu`,
          messages: [
            `Salut ! Désolé pour l'intrusion.`,
            `Cette version a été abandonnée au profit d'une version plus récente. Téléchargez la nouvelle version depuis notre site Web.`
          ]
        },
        en: {
          title: `Notification from TouchEmu`,
          messages: [
            `DOWNLOAD NEW VERSION!!!`,
            `This version has been abandoned for a newer version. Download the new version from our website.`
          ]
        },
        es: {
          title: `Notificación de TouchEmu`,
          messages: [
            `¡Hola! Perdón por la intrusión.`,
            `Esta versión ha sido abandonada en favor de una versión más reciente. Descargue la nueva versión desde nuestro sitio web.`
          ]
        }
      }

      const link = {
        url: 'https://www.touch-emu.com',
        text: 'touch-emu.com'
      }

      sendPopup(texts, link)
      return
    }
  }

  if (!window.localStorage.getItem('TouchEmu-discord-popup')) {
    window.localStorage.setItem('TouchEmu-discord-popup', true)

    const texts = {
      fr: {
        title: `Notification de TouchEmu`,
        messages: [
          ` Cette version a été abandonnée au profit d'une version plus récente. Téléchargez la nouvelle version depuis notre site Web.`
        ]
      },
      en: {
        title: `Notification from TouchEmu`,
        messages: [
          `This version has been abandoned for a newer version. Download the new version from our website.<br />`
        ]
      },
      es: {
        title: `Notificación de TouchEmu`,
        messages: [
          `Esta versión ha sido abandonada en favor de una versión más reciente. Descargue la nueva versión desde nuestro sitio web.<br /> `
        ]
      }
    }

    const link = {
      url: 'https://touch-emu.com/',
      text: 'Download TouchEmu'
    }

    sendPopup(texts, link)
    return
  }
  
})();
