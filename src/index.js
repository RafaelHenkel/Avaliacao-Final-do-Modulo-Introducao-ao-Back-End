import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 8080;
let acc = 1;
const users = [];

app.use(express.json());

app.listen(port, () => console.log(`Server started in port: ${port}`));

// Criar conta
app.post("/signup", async (req, res) => {
  const data = req.body;
  const { mail, pass } = req.body;
  const mailExist = users.find((user) => user.mail === mail);

  if (mailExist) {
    return res
      .status(400)
      .json({ msg: "este usuario ja esta cadastrado! Tente outro cadastro" });
  }

  const hashPass = await bcrypt.hash(pass, 10);

  users.push({
    id: acc,
    name: data.name,
    mail: data.mail,
    pass: hashPass,
  });

  acc++;

  res.status(201).json({ msg: "Cadastro efetuado com sucesso!" });
});

//Login
app.post("/login", async (req, res) => {
  const { name, mail, pass } = req.body;

  const user = users.find((user) => user.name === name);
  const userMail = users.find((user) => user.mail === mail);

  const hashPass = await bcrypt.hash(pass, 10);

  const passMath = await bcrypt.compare(pass, hashPass);

  if (!passMath) {
    return res.status(400).json({ msg: "Credenciais invalidas" });
  } else if (!user) {
    return res.status(400).json({ msg: "Credenciais (nome) invalidas" });
  } else if (!userMail) {
    return res.status(400).json({ msg: "Credenciais (email) invalidas" });
  } else {
    res.status(200).json({ msg: "Login bem sucedido", data: mail });
  }
});

//Mostrar usuarios cadastrados
app.get("/users", (req, res) => {
  return res.status(200).json({ data: users });
});
