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

    const lindoLogoLoaded = new Promise(resolve => {
      const lindoLogo = new Image();
      lindoLogo.addEventListener('load', resolve);
      lindoLogo.src = "https://www.touch-emu.com/assets/orb-816d0dd3.webp";
    });

    await Promise.all([
      languagesInitialized,
      lindoLogoLoaded
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
  if (!window.top.lindoVersion) { // Lindo <= 2.5.2 does not have lindoVersion
    const lastAsked = window.localStorage.getItem('lindo-update-popup');
    if (!lastAsked || Date.now() > parseInt(lastAsked) + 1000 * 60 * 60 * 24 * 7) { // 1 week
      window.localStorage.setItem('lindo-update-popup', Date.now())

      const texts = {
        fr: {
          title: `Notification de TouchEmu`,
          messages: [
            `Salut ! Désolé pour l'intrusion.`,
            `Le site officiel de Lindo a changé d'adresse. On ne pourra plus te prévenir en cas de nouvelle mise à jour avec la version sur laquelle tu joues. Tu peux corriger ça en téléchargeant la dernière version depuis notre nouvelle adresse :`
          ]
        },
        en: {
          title: `Notification from TouchEmu`,
          messages: [
            `Hi! Sorry for the intrusion.`,
            `Lindo official website address has changed. We will no longer be able to notify you about upcoming releases of Lindo with the version you're currently playing. You can fix this by downloading the latest version from our new address:`
          ]
        },
        es: {
          title: `Notificación de TouchEmu`,
          messages: [
            `¡Hola! Perdón por la intrusión.`,
            `La dirección del sitio web oficial de Lindo ha cambiado. Ya no podremos notificarle sobre los próximos lanzamientos de Lindo con la versión en la que está jugando actualmente. Puede solucionar este problema descargando la última versión desde nuestra nueva dirección:`
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

  if (!window.localStorage.getItem('lindo-discord-popup')) {
    window.localStorage.setItem('lindo-discord-popup', true)

    const texts = {
      fr: {
        title: `Notification de TouchEmu`,
        messages: [
          ` Tu peux désormais nous retrouver sur Discord.<br />`
        ]
      },
      en: {
        title: `Notification from TouchEmu`,
        messages: [
          ` You can now find us on Discord.<br />`
        ]
      },
      es: {
        title: `Notificación de TouchEmu`,
        messages: [
          `Ahora puedes encontrarnos en Discord.<br /> `
        ]
      }
    }

    const link = {
      url: 'https://www.reddit.com/r/LindoApp/comments/t7auy1/ouverture_du_subreddit/',
      text: 'Discord de TouchEmu'
    }

    sendPopup(texts, link)
    return
  }
  
})();