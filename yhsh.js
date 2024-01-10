const cookieName = "永辉生活";
const cookieKey = "yhsh_cookie";
const tokenKey = "yhsh_token";
const taskIdKey = "task_id";
const shopIdKey = "shop_id";
const taskCodeKey = "task_code";
const chavy = init();

var hasCookie = chavy.getdata(cookieKey);
var hasToken = chavy.getdata(tokenKey);
var hasTaskId = chavy.getdata(taskIdKey);
var hasShopId = chavy.getdata(shopIdKey);
var hasTaskCode = chavy.getdata(taskCodeKey);

let isGetCookie = typeof $request !== "undefined";

if (isGetCookie) {
  getcookie();
} else {
  sign();
}

function getcookie() {
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

  var urlVal = $request.url;
  if (urlVal) {
    var matchResult = urlVal.match(/(?<=access_token=).*(?=&)/gi);
    if (0 !== matchResult.length) {
      var matchToken = matchResult[0];
      if (matchToken && hasToken) {
        matchToken !== hasToken
          ? (chavy.setdata(matchToken, tokenKey),
            chavy.msg(`${cookieName}`, "更新token: 成功", ""))
          : chavy.log(`${cookieName}：目前的token一致`);
      } else {
        matchToken != undefined
          ? (chavy.setdata(matchToken, tokenKey),
            chavy.msg(`${cookieName}`, "获取token: 成功", ""))
          : chavy.msg(`${cookieName}`, "获取token: 失败", "");
      }
    } else {
      chavy.msg(`${cookieName}`, "url中匹配token: 失败", "");
    }
  }
  var bodyValStr = $reponse.body;
  if (bodyValStr) {
    try {
      const bodyVal = JSON.parse(bodyValStr);
      if (result.code === 0) {
        var matchTaskId = bodyVal.data.subTasks[0].taskId;
        if (matchTaskId && hasTaskId) {
          matchTaskId !== hasTaskId
            ? (chavy.setdata(matchTaskId, taskIdKey),
              chavy.msg(`${cookieName}`, "更新taskId: 成功", ""))
            : chavy.log(`${cookieName}：目前的taskId一致`);
        } else {
          matchTaskId != undefined
            ? (chavy.setdata(matchTaskId, taskIdKey),
              chavy.msg(`${cookieName}`, "获取taskId: 成功", ""))
            : chavy.msg(`${cookieName}`, "获取taskId: 失败", "");
        }

        var matchShopId = bodyVal.data.shopId;
        if (matchShopId && hasShopId) {
          matchShopId !== hasShopId
            ? (chavy.setdata(matchShopId, shopIdKey),
              chavy.msg(`${cookieName}`, "更新shopId: 成功", ""))
            : chavy.log(`${cookieName}：目前的shopId一致`);
        } else {
          matchShopId != undefined
            ? (chavy.setdata(matchShopId, shopIdKey),
              chavy.msg(`${cookieName}`, "获取shopId: 成功", ""))
            : chavy.msg(`${cookieName}`, "获取shopId: 失败", "");
        }

        var matchTaskCode = bodyVal.data.taskCode;
        if (matchTaskCode && hasTaskCode) {
          matchTaskCode !== hasTaskCode
            ? (chavy.setdata(matchTaskCode, taskCodeKey),
              chavy.msg(`${cookieName}`, "更新taskCode: 成功", ""))
            : chavy.log(`${cookieName}：目前的taskCode一致`);
        } else {
          matchTaskCode != undefined
            ? (chavy.setdata(matchTaskCode, taskCodeKey),
              chavy.msg(`${cookieName}`, "获取taskCode: 成功", ""))
            : chavy.msg(`${cookieName}`, "获取taskCode: 失败", "");
        }
      } else {
        chavy.msg(`${cookieName}`, "body的code不为0", "");
      }
    } catch (err) {
      chavy.msg(`${cookieName}`, "转换body: 成功", "");
    }
  } else {
    chavy.msg(`${cookieName}`, "没有获得body", "");
  }

  chavy.done();
}

function sign() {
  const title = `${cookieName}`;
  let subTitle = ``;
  let detail = ``;

  chavy.log(`token: ${hasToken}`);
  chavy.log(`taskId: ${hasTaskId}`);
  chavy.log(`shopId: ${hasShopId}`);
  chavy.log(`taskCode: ${hasTaskCode}`);

  if (!hasToken || !hasTaskId || !hasShopId || !hasTaskCode) {
    subTitle = `请先获取cookie`;
    chavy.msg(title, subTitle, detail);
    chavy.done();
  }

  const url = `https://api.yonghuivip.com/web/member/task/doTask?channel=ios&platform=ios&access_token=${hasToken}`;

  const headers = {
    'Accept' : `application/json`,
    'Origin' : `yhwebcachehttps://m.yonghuivip.com`,
    'Accept-Encoding' : `gzip, deflate, br`,
    'Connection' : `keep-alive`,
    'Content-Type' : `application/json`,
    'Host' : `api.yonghuivip.com`,
    'X-YH-Context' : `origin=h5&morse=1`,
    'User-Agent' : `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 YhStore/9.10.0(client/phone; iOS 15.6; iPhone14,2)`,
    'X-YH-Biz-Params' : `ncjkdy=,*!$&nzggzmdy=(&xdotdy=_&gib=--'0+(!!$(&gvo=+,0)-,_)(`,
    'Accept-Language' : `zh-CN,zh-Hans;q=0.9`
  };
  const body = `{"taskId":${hasTaskId},"shopId":${hasShopId},"taskCode":${hasTaskCode}}`;

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
      chavy.log(`签到失败，error：${error}`);
      chavy.done();
    }
    if (undefined === data) {
      subTitle = `签到结果: 失败`;
      detail = `cookie失效`;
      chavy.msg(title, subTitle, detail);
    } else {
      try {
        const result = JSON.parse(data);
        if (result.code === 0) {
          subTitle = `签到结果: 成功`;
          detail = `获得积分: ${result.data}`;
        } else {
          subTitle = `签到结果: 失败`;
          detail = `${result.message}`;
        }
        chavy.msg(title, subTitle, detail);
      } catch (err) {
        subTitle = `签到结果: 失败`;
        detail = `详情请查看日志1`;
        chavy.msg(title, subTitle, detail);
        chavy.log(`签到失败1，error：${err}`);
      } finally {
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
