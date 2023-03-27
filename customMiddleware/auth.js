exports.requiresLogin = (req, res, next) => {
  // console.log("======================");
  // console.log("req.session:", req.session);
  // console.log("req.headers.cookie:", req.headers.cookie);
  // console.log("======================");

  const reqCookie = req.headers.cookie;
  console.log("req.headers:", req.headers);
  const userId = reqCookie.split(";")[1].split("=")[1];
  const token = reqCookie.split(";")[0].split("=")[1];

  if (req.session && userId && token) {
    return next();
  } else {
    var err = new Error("You must be logged in to view this page.");
    err.status = 401;
    return next(err);
  }
};
