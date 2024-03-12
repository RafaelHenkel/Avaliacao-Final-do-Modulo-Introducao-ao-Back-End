import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import verifyUsers from "./middlewares/verifyUsers";

const app = express();
const port = 8080;
let acc = 1;
let accMsg = 1;
const users = [];
const message = [];

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Server started in port: ${port}`));

//AREA DE LOGIN
// Criar conta
app.post("/signup", verifyUsers, async (req, res) => {
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
  const data = req.body;
  const mail = data.mail;
  const pass = data.pass;

  const userResult = users.find((user) => user.mail === mail);

  if (userResult) {
    const passResult = await bcrypt.compare(pass, userResult.pass);
    if (passResult) {
      res.status(200).json({ msg: "Login bem sucedido", data: mail });
    } else {
      return res.status(400).json({ msg: "Credenciais(senha) invalidas" });
    }
  } else {
    return res.status(400).json({ msg: "Credenciais (email) invalidas" });
  }
});

//Mostrar usuarios cadastrados
app.get("/users", (req, res) => {
  return res.status(200).json({ data: users });
});

//AREA CRUD
//Criar recado
app.post("/userMessage/:mail", (req, res) => {
  const data = req.body;
  const userMail = req.params.mail;
  const existUser = users.findIndex((uMail) => uMail.mail === userMail);

  if (existUser !== -1) {
    message.push({
      userMail: userMail,
      id: accMsg,
      title: data.title,
      description: data.description,
    });

    res.status(200).json({ msg: "Recado criado com sucesso" });
    accMsg++;
  } else {
    res.status(404).json({ msg: "Este email nao existe, tente novamente!" });
  }
});

//Mostrar recados cadastrados
app.get("/userMessage", (req, res) => {
  return res.status(200).json({ data: message });
});

//Atualizar recados
app.put("/userMessage/:messageId", (req, res) => {
  const data = req.body;

  const msgId = Number(req.params.messageId);
  const title = data.title;
  const description = data.description;

  const messageIndex = message.findIndex((msg) => msg.id === msgId);

  if (messageIndex !== -1) {
    const userMessage = message[messageIndex];
    userMessage.description = description;
    userMessage.title = title;

    res.status(200).json({ msg: "Recado atualizado com sucesso!" });
  } else {
    return res
      .status(404)
      .json({ msg: "Este id nao existe, tente novamente!" });
  }
});

//Deletar recados
app.delete("/userMessage/:messageId", (req, res) => {
  const msgId = Number(req.params.messageId);

  const messageIndex = message.findIndex((msg) => msg.id === msgId);

  if (messageIndex !== -1) {
    message.splice(messageIndex, 1);
    res.status(200).json({ msg: "Recado deletado com sucesso!" });
  } else {
    return res
      .status(404)
      .json({ msg: "Este id nao existe, tente novamente!" });
  }
});

//Paginação de recados

app.get("/userMessagePage", (req, res) => {
  try {
    if (message.length === 0) {
      return res
        .status(400)
        .send({ message: "Você deve adicionar ao menos 1 recado" });
    }

    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);

    const itemOffset = offset - 1;

    const msgOffset = message.slice(itemOffset, itemOffset + limit);

    res.status(200).json({ data: msgOffset });
  } catch (error) {
    return res.status(500).send({ message: "erro no servidor" });
  }
});
