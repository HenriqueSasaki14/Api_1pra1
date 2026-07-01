import express from 'express'
import cors from 'cors'
import { prisma } from "./lib/prisma.ts"
import { create } from 'node:domain';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


app.get("/usuarios", async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: "Não achei os macaquitos" });
    }
})


app.post("/usuarios", async (req, res) => {
    try {
        const { email, senha, bio, fotoUrl } = req.body;
        const novoUsuario = await prisma.usuario.create({
            data: {
                email,
                senha,
                perfil: {
                    create: {
                        bio,
                        fotoUrl
                    }
                }
            },
            include: { perfil: true }
        });
        res.status(200).json(novoUsuario)
    } catch (error) {
        res.status(500).json("Erro ao criar o usuário")
    }
});

app.put("/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { email, senha, bio, fotoUrl } = req.body;

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: {
                email,
                senha,
                perfil: {
                    upsert: {
                        create: { bio, fotoUrl },
                        update: { bio, fotoUrl }
                    }
                },
            }
        });
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar o usuário", detalhe: error.message });
    }
})

app.patch("/usuarios/id:", async (req, res) => {
    const { id } = req.params

    const { email, senha, bio, fotoUrl } = req.body

    const dadosAtualizados = {
        email,
        senha,
        perfil: (bio || fotoUrl) ? {
            update: { bio, fotoUrl }
        } : undefined
    }
    Object.keys(dadosAtualizados).forEach(key => dadosAtualizados[key] === undefined && delete dadosAtualizados[key])
    const usuario = await prisma.usuario.update({
        where: {id: Number(id)},
        data: dadosAtualizados,
        include: (perfil: true)
    })
})


app.listen(PORT, () => {
    console.log("Server rodando na porta 3000")
})