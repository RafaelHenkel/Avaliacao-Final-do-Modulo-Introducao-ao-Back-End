import bcrypt from "bcrypt";

function verifyUsers(req, res, next) {
  const { mail, pass } = req.body;
  if (!mail.includes("@")) {
    return res.status(400).json({ msg: "Seu email deve incluir @" });
  }
  return next();
}

export default verifyUsers;
