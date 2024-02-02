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
  const email = data.email;
  const pass = data.pass;
  const emailExist = users.find((user) => user.email === email);

  if (emailExist) {
    return res
      .status(400)
      .json({ msg: "este usuario ja esta cadastrado! Tente outro cadastro" });
  }

  const hashPassword = await bcrypt.hash(pass, 10);
  console.log(hashPassword);
  users.push({
    id: acc,
    user: data.user,
    email: data.email,
    pass: hashPassword,
  });

  acc++;

  res.status(201).json({ msg: "Cadastro efetuado com sucesso!" });
});

app.get("/users", (req, res) => {
  return res.status(200).json({ data: users });
});
