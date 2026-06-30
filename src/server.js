import express from 'express'
import cors from 'cors'
import {prisma} from "./lib/prisma.ts"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());


app.get("/usuarios", async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        res.status(200).json(users);
    } catch (error){
        res.status(400).json({error: "Não achei os macaquitos"});
    }
})

app.listen(PORT, () => {
    console.log("Server rodando na porta 3000")
})