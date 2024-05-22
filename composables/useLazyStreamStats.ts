/*
  use only one websocket client for all components that
  import and use this. it surprisingly works and is reactive!

  NOTE: don't do this if you aren't building a static-only
  application:
  https://v3.nuxtjs.org/getting-started/state-management
*/

const INITIAL_TIME_INC = 5;
const FETCH_TIMEOUT = 5000;
const WEBSOCKET_READYSTATE_CLOSING = 2;

const showErrorBanner = ref(false);
const errorString = ref('stream-unavailable');
const time = ref(0);
const websocketContainer = ref(null);

let intentional = false;
let reserved = '';
let initialTime = INITIAL_TIME_INC;
let streamStats: WebSocket;
let useStatSockAuth = false;

// ohmyfetch doesn't have timeout implemented so we have to use
// what we already have in all modern browsers
async function fetchJSON(path: string, options: any) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort('timed out'), FETCH_TIMEOUT);

  options = options || {};
  options.signal = controller.signal;
  if (options.body && typeof options.body === 'object')
    options.body = new URLSearchParams(options.body);

  try {
    const response = await fetch(path, options);
    const json = await response.json();

    clearTimeout(timeoutId);
    return json;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function lazy(id = reserved, admin = useStatSockAuth) {
  try {
    let path = '/sst/watch/watchsock';
    let body: Record<string, string> = { watchurl: id };

    if (admin) {
      path = '/sst/statsockauth';
      body = { streamid: id };
    }

    const data = await fetchJSON(path, {
      method: 'POST',
      body,
      initialCache: false
    });

    initialTime = INITIAL_TIME_INC;
    if (!data || !data.token)
      return doRefreshCountdown();

    streamStats = new WebSocket(`${(location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host}/sock/streamstats`);
    console.log('streamStats: ws connecting');

    streamStats.onopen = () => {
      initialTime = INITIAL_TIME_INC;
      time.value = 0;
      errorString.value = 'stream-unavailable';

      setTimeout(() => streamStats.send(data.token), 1000);
    };
    streamStats.onclose = () => {
      console.log('streamStats: closed fired, intentional:', intentional);
      if (!intentional)
        doRefreshCountdown();
      else
        intentional = false;
    };
    websocketContainer.value = streamStats;
  } catch (err) {
    showErrorBanner.value = true;
    errorString.value = 'stream-fetch-failed';

    initialTime += INITIAL_TIME_INC;
    time.value = initialTime;

    doRefreshCountdown();
  }
}

async function doRefreshCountdown() {
  time.value--;

  if (unref(time) % 5 === 0)
    console.log('streamStats: refetching in', unref(time));

  if (unref(time) <= 0) {
    errorString.value = 'stream-fetch-retry';
    return lazy();
  }

  setTimeout(doRefreshCountdown, 1000);
}

function getWS(): WebSocket | undefined {
  const websocket = unref(websocketContainer);
  const websocketDead = websocket === null || websocket.readyState >= WEBSOCKET_READYSTATE_CLOSING;
  if (websocketDead)
    return;

  return websocket;
}

function safeClose() {
  const websocket = getWS();
  if (!websocket) return;

  console.log('streamStats: intentionally closed!');
  reserved = '';
  intentional = true;
  websocket.close();
}

export default function(id?: string, wait: boolean = false, admin = false) {
  if (!wait && id && reserved !== id) {
    console.log('streamStats: given id not equal to reserved');

    safeClose();

    lazy(id, admin);
    useStatSockAuth = admin;
    reserved = id;
  }

  return {
    safeClose,
    showErrorBanner,
    errorString,
    time,
    websocketContainer
  };
}
