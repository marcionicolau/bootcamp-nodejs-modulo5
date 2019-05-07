const { User } = require("../models");

const Mail = require("../services/MailService");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    await Mail.send({
      from: "Marcio Nicolau <nicolau.3g@gmail.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Novo acesso a sua conta",
      text: "Olá"
    });

    return res.json({
      token: await user.generateToken()
    });
  }
}

module.exports = new SessionController();
