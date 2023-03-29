exports.requiresLogin = (req, res, next) => {
  // console.log("======================");
  // console.log("req.session:", req.session);
  // console.log("req.headers.cookie:", req.headers.cookie);
  // console.log("======================");

  // cookie: 'cookieUserId=640019ad61461d5338f49051; cookieRoole=admin; cookieToken=0f69d926-dfe2-42f3-828b-a9eb3eec49909',
  console.log("req.session:", req.session);
  console.log("session id:", req.sessionID);
  console.log("req.headers:", req.headers);
  let reqCookie = req.headers.cookie.split(";");
  let userId;
  let token;
  reqCookie.forEach((cookie) => {
    if (cookie.includes("cookieUserId")) {
      userId = cookie.split("=")[1];
    }
    if (cookie.includes("cookieToken")) {
      token = cookie.split("=")[1];
    }
  });

  if (userId && token) {
    return next();
  } else {
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    return next(err);
  }
};
