const cookieName = "cksk";
const cookieKey = "cksk_cookie";
const brandIdKey = "brand_Id";
const customIdKey = "custom_Id";
const chavy = init();

var hasCookie = chavy.getdata(cookieKey);
var hasBrandId = chavy.getdata(brandIdKey);
var hasCustomId = chavy.getdata(customIdKey);

let isGetCookie = typeof $request !== "undefined";

if (isGetCookie) {
  getcookie();
} else {
  sign();
}

function getcookie() {
  var urlVal = $request.url;
  if (urlVal) {
    var matchBrandIdResult = urlVal.match(/(?<=brandId=)\d*/gi);
    if (0 !== matchBrandIdResult.length) {
      var matchBrandId = matchBrandIdResult[0];
      if (matchBrandId && hasBrandId) {
        matchBrandId !== hasBrandId
          ? (chavy.setdata(matchBrandId, brandIdKey),
            chavy.msg(`${cookieName}`, "更新brandId: 成功", ""))
          : chavy.log(`${cookieName}：目前的brandId一致`);
      } else {
        matchBrandId != undefined
          ? (chavy.setdata(matchBrandId, brandIdKey),
            chavy.msg(`${cookieName}`, "获取brandId: 成功", ""))
          : chavy.msg(`${cookieName}`, "获取brandId: 失败", "");
      }
    } else {
      chavy.msg(`${cookieName}`, "url中匹配brandId: 失败", "");
    }
    var matchCustomIdResult = urlVal.match(/(?<=customId=)\d*/gi);
    if (0 !== matchCustomIdResult.length) {
      var matchCustomId = matchCustomIdResult[0];
      if (matchCustomId && hasCustomId) {
        matchCustomId !== hasCustomId
          ? (chavy.setdata(matchCustomId, customIdKey),
            chavy.msg(`${cookieName}`, "更新customId: 成功", ""))
          : chavy.log(`${cookieName}：目前的customId一致`);
      } else {
        matchCustomId != undefined
          ? (chavy.setdata(matchCustomId, customIdKey),
            chavy.msg(`${cookieName}`, "获取customId: 成功", ""))
          : chavy.msg(`${cookieName}`, "获取customId: 失败", "");
      }
    } else {
      chavy.msg(`${cookieName}`, "url中匹配customId: 失败", "");
    }
  }
  var cookieVal = $request.headers["Cookie"];
  if (cookieVal) {
    if (cookieVal && hasCookie) {
      cookieVal !== hasCookie
        ? (chavy.setdata(cookieVal, cookieKey),
          chavy.msg(`${cookieName}`, "更新cookie: 成功", ""))
        : chavy.log(`${cookieName}: 目前的cookie一致`);
    } else {
      cookieVal != undefined
        ? (chavy.setdata(cookieVal, cookieKey),
          chavy.msg(`${cookieName}`, "获取cookie: 成功", ""))
        : chavy.msg(`${cookieName}`, "获取cookie: 失败", "");
    }
  } else {
    chavy.msg(`${cookieName}`, "获取cookie: 失败", "");
  }
  chavy.done();
}

function sign() {
  const title = `${cookieName}`;
  let subTitle = ``;
  let detail = ``;

  chavy.log(`cookie: ${hasCookie}`);
  chavy.log(`brandId: ${hasBrandId}`);
  chavy.log(`customId: ${hasCustomId}`);

  if (!hasCookie || !hasBrandId || !hasCustomId) {
    subTitle = `请先获取cookie`;
    chavy.msg(title, subTitle, detail);
    chavy.done();
  }

  const url = `https://wx5e52d9bcd5773888-mall.m.dianplus.cn/rs/crm/check_in/checkin_add_records.do`;

  const headers = {
    "X-Requested-With": `XMLHttpRequest`,
    "Connection": `keep-alive`,
    "Accept-Encoding": `gzip, deflate, br`,
    "Content-Type": `application/x-www-form-urlencoded; charset=utf-8`,
    "Origin": `https://wx5e52d9bcd5773888-mall.m.dianplus.cn`,
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.42(0x18002a31) NetType/4G Language/zh_CN`,
    "Traceid": `-83cb1556-c297-465e-8059-9a8a3450c3fb-1698832862379`,
    "Host": `wx5e52d9bcd5773888-mall.m.dianplus.cn`,
    "Referer": `https://wx5e52d9bcd5773888-mall.m.dianplus.cn/`,
    "Cookie": hasCookie,
    "Accept-Language": `zh-CN,zh-Hans;q=0.9`,
    "Accept": `*/*`,
  };
  const body = `brandId=${parseInt(hasBrandId)}$&customId=${parseInt(hasCustomId)}$`;

  const myRequest = {
    url: url,
    headers: headers,
    body: body,
  };

  chavy.post(myRequest, (error, response, data) => {
    chavy.log(`${cookieName}, data: ${data}`);
    if (error) {
      subTitle = `签到结果: 失败`;
      detail = `详情请查看日志`;
      chavy.msg(title, subTitle, detail);
      chavy.log(`签到失败，error：${error}`)
      chavy.done();
    }
    if (undefined === data) {
      subTitle = `签到结果: 失败`;
      detail = `cookie失效`;
      chavy.msg(title, subTitle, detail);
    } else {
      try{
        const result = JSON.parse(data);
        if (result.status === "success") {
          subTitle = `签到结果: 成功`;
          detail = `获得积分: ${result.resultObject.checkCredit}`;
        } else {
          subTitle = `签到结果: 失败`;
          detail = `${result.exceptionMessage}`;
        }
        chavy.msg(title, subTitle, detail);
      }catch(err){
        subTitle = `签到结果: 失败`;
        detail = `详情请查看日志1`;
        chavy.msg(title, subTitle, detail);
        chavy.log(`签到失败1，error：${err}`)
      }finally{
        chavy.done();
      }
    }
  });
}

function init() {
  isSurge = () => {
    return undefined !== this.$httpClient;
  };
  isQuanX = () => {
    return undefined !== this.$task;
  };
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key);
    if (isQuanX()) return $prefs.valueForKey(key);
  };
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val);
    if (isQuanX()) return $prefs.setValueForKey(key, val);
  };
  msg = (title, subtitle = "", body = "") => {
    if (isSurge()) $notification.post(title, subtitle, body);
    if (isQuanX()) $notify(title, subtitle, body);
  };
  log = (msg) => {
    console.log(`${msg}\n`);
  };
  get = (options, callback) => {
    if (isQuanX()) {
      if (typeof options == "string") options = { url: options };
      options["method"] = "GET";
      return $task.fetch(options).then(
        (response) => {
          response["status"] = response.statusCode;
          callback(null, response, response.body);
        },
        (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge()) return $httpClient.get(options, callback);
  };
  post = (options, callback) => {
    if (isQuanX()) {
      if (typeof options == "string") options = { url: options };
      options["method"] = "POST";
      $task.fetch(options).then(
        (response) => {
          response["status"] = response.statusCode;
          callback(null, response, response.body);
        },
        (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge()) $httpClient.post(options, callback);
  };
  done = (value = {}) => {
    $done(value);
  };
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done };
}
