const cookieName = "cksk";
const cookieKey = "jsessionId";
const chavy = init();

let isGetCookie = typeof $request !== "undefined";
chavy.log(`[${cookieName}] 是否获取cookie: ${isGetCookie}`)
if (isGetCookie) {
  getcookie();
} else {
  sign();
}

function getcookie() {
  var cookieVal = $request.headers["Cookie"];
  if (cookieVal) {
    var matchResult = cookieVal.match(/(?<=JSESSIONID=).*/gi);
    if (0 !== matchResult.length) {
      var jsessionId = matchResult[0];
      if (jsessionId && chavy.getdata(cookieKey)) {
        jsessionId !== chavy.getdata(cookieKey)
          ? (chavy.setdata(jsessionId, cookieKey),
            chavy.msg(`${cookieName}`, "更新jsessionId: 成功", ""))
          : chavy.msg(`${cookieName}`, "目前的jsessionId一致", "");
      } else {
        jsessionId != undefined
          ? (chavy.setdata(jsessionId, cookieKey),
            chavy.msg(`${cookieName}`, "获取jsessionId: 成功", ""))
          : chavy.msg(`${cookieName}`, "获取jsessionId: 失败", "");
      }
    } else {
      chavy.msg(`${cookieName}`, "cookie中匹配jsessionId: 失败", "");
    }
  } else {
    chavy.msg(`${cookieName}`, "获取cookie: 失败", "");
  }
}

function sign() {}

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
