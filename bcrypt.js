import bcrypt from "bcrypt";

async function getSenha() {
    const senha = "123456";
    const hashedPassword = await bcrypt.hash(senha, 10);
    console.log(hashedPassword);
}

getSenha();