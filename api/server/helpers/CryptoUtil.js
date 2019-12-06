const jwt = require("jsonwebtoken");
const config = require("../../config/config");

async function isLoggedIn(req, res, next) {
  let token = req.headers["x-access-token"];
  console.debug("CryptoUtil.isLoggedIn.token:", token);
  if (!token)
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  else {
    let userid = req.params.userid || req.body.userid || req.query.userid;
    let secretKey = config.jwtSecret;
    console.debug("userid:", userid, ", secretKey:", secretKey);
    try {
      let decoded = await jwt.decode(token, secretKey);
      console.debug("CryptoUtil.isLoggedIn.decoded:", decoded);

      if (decoded.userid != userid)
        return res
          .status(404)
          .json({ success: false, message: "Token not valid." });
      else if (decoded.regDate <= Date.now()) {
        return res
          .status(404)
          .json({ success: false, message: "Token expired." });
      } else next();
    } catch (err) {
      return res.status(401).json({ success: false, message: err });
    }
  }
}

module.exports = { isLoggedIn };
