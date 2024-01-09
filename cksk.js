const cookieName = "cksk";
const cookieKey = "jsessionId";
const chavy = init();
const cookieVal = $request.headers["Cookie"];
if (cookieVal) {
  chavy.log(`[${cookieName}] , cookie: ${cookieVal}`);
  var jsessionId = cookieVal.match(/(?<=JSESSIONID=).*/gi)[0];
  chavy.log(`[${cookieName}] , jsessionId: ${jsessionId}`);
  if (chavy.setdata(jsessionId, cookieKey)) {
    chavy.msg(`${cookieName}`, "获取jsessionId: 成功", "");
    chavy.log(
      `[${cookieName}] 获取jsessionId: 成功, jsessionId: ${jsessionId}`
    );
  }
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true;
  };
  isQuanX = () => {
    return undefined === this.$task ? false : true;
  };
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key);
    if (isQuanX()) return $prefs.valueForKey(key);
  };
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val);
    if (isQuanX()) return $prefs.setValueForKey(key, val);
  };
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body);
    if (isQuanX()) $notify(title, subtitle, body);
  };
  log = (message) => console.log(message);
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb);
    }
    if (isQuanX()) {
      url.method = "GET";
      $task.fetch(url).then((resp) => cb(null, {}, resp.body));
    }
  };
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb);
    }
    if (isQuanX()) {
      url.method = "POST";
      $task.fetch(url).then((resp) => cb(null, {}, resp.body));
    }
  };
  done = (value = {}) => {
    $done(value);
  };
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done };
}
chavy.done();
