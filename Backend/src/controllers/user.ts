import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models/user";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { validateCaptcha } from "../utils/validateCaptcha";



export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, lastname, password, email, credential } = req.body;

    const userUnique = await User.findOne({
      where: {
        [Op.or]: { email, credential }
      }
    });

    if (userUnique) {
      return res.status(400).json({
        msg: `El usuario ya existe con el email ${email} o credencial => ${credential}`
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      lastname,
      password: passwordHash,
      email,
      credential,
      status: 1
    });

    return res.json({
      msg: `Usuario ${name} ${lastname} se creó con éxito`
    });

  } catch (error) {
    return res.status(500).json({
      msg: `Existe un error al crear el usuario.`,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, captchaToken } = req.body;

  const isCaptchaValid = await validateCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return res.status(403).json({ msg: 'Captcha inválido' });
  }

  const userOne: any = await User.findOne({ where: { email } });

  if (!userOne) {
    return res.status(400).json({
      msg: `Usuario no existe con el email => ${email}`
    });
  }


  const passwordValid = await bcrypt.compare(password, userOne.password);
  if (!passwordValid) {
    return res.status(400).json({
      msg: `Password incorrecto => ${password}`
    });
  }

  const token = jwt.sign({ email }, process.env.SECRET_KEY || 'clave-secreta', {});

  return res.json({
    token,
    user: {
      id: userOne.id,
      email: userOne.email,
      name: userOne.name
    }
  });
};
