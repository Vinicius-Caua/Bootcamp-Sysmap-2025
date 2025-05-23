import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { createBucket, uploadImage } from "../src/service/s3Service";

const prisma = new PrismaClient();

// Upload default avatar to LocalStack
async function uploadDefaultAvatar() {
  const defaultAvatarPath = path.join(
    __dirname,
    "../assets/default-avatar.png"
  );
  const fileBuffer = fs.readFileSync(defaultAvatarPath);

  const file = {
    originalname: "default-avatar.png",
    buffer: fileBuffer,
    mimetype: "image/png",
  } as Express.Multer.File;

  // Ensure the bucket exists before uploading
  await createBucket();

  const avatarUrl = await uploadImage(file);
  console.log(`Default avatar uploaded to: ${avatarUrl}`);
  return avatarUrl;
}

// Upload activity images to S3 and return their URLs
async function uploadActivityImages() {
  const images = [
    "futebol-de-praia.jpg",
    "caminhada.png",
    "corrida-ao-ar-livre.jpg",
    "ciclismo-de-Estrada.jpg",
    "volei-de-praia.jpg",
    "escalada.jpg",
  ];

  const imageUrls: { [key: string]: string } = {};

  for (const imageName of images) {
    const imagePath = path.join(__dirname, "../assets", imageName);
    const fileBuffer = fs.readFileSync(imagePath);

    const file = {
      originalname: imageName,
      buffer: fileBuffer,
      mimetype: `image/${path.extname(imageName).substring(1)}`,
    } as Express.Multer.File;

    const imageUrl = await uploadImage(file);
    imageUrls[imageName] = imageUrl;
    console.log(`Image ${imageName} uploaded to: ${imageUrl}`);
  }

  return imageUrls;
}

// Create activity types
async function createActivityTypes(imageUrls: { [key: string]: string }) {
  return await prisma.activityType.createMany({
    data: [
      {
        name: "Futebol de Praia",
        description: "Partidas de futebol realizadas na areia da praia",
        image: imageUrls["futebol-de-praia.jpg"],
      },
      {
        name: "Caminhada",
        description: "Atividades de caminhada em trilhas ou parques",
        image: imageUrls["caminhada.png"],
      },
      {
        name: "Corrida ao Ar Livre",
        description: "Corridas realizadas em parques ou ruas",
        image: imageUrls["corrida-ao-ar-livre.jpg"],
      },
      {
        name: "Ciclismo de Estrada",
        description: "Passeios e competições de ciclismo em estradas",
        image: imageUrls["ciclismo-de-Estrada.jpg"],
      },
      {
        name: "Vôlei de Praia",
        description: "Partidas de vôlei realizadas na areia da praia",
        image: imageUrls["volei-de-praia.jpg"],
      },
      {
        name: "Escalada",
        description: "Atividades de escalada em rochas ou paredes artificiais",
        image: imageUrls["escalada.jpg"],
      },
    ],
  });
}

// Create achievements
async function createAchievements() {
  const achievements = [
    { name: "Primeiro Login", criterion: "Primeiro login no sistema" },
    {
      name: "Primeiro Check-in",
      criterion: "Primeira confirmação de presença em atividade",
    },
    {
      name: "A Primeira de Muitas",
      criterion: "Criou uma atividade pela primeira vez.",
    },
    {
      name: "Criador de Atividades",
      criterion: "Criou 3 atividades diferentes",
    },
    {
      name: "Tudo que Começa tem um Fim",
      criterion: "Encerrou (concluiu) uma atividade pela primeira vez",
    },
    { name: "Nível 5", criterion: "Alcançou o nível 5 de experiência" },
    { name: "Nível 10", criterion: "Alcançou o nível 10 de experiência" },
    {
      name: "Participante Frequente",
      criterion: "Fez o check-in em 5 atividades",
    },
    {
      name: "Estou bonito hoje",
      criterion: "Atualizou o avatar pela primeira vez.",
    },
    { name: "Sou exigente", criterion: "Definiu a sua primeira preferência." },
    { name: "Rei das Conquistas", criterion: "Já tem mais de 5 conquistas." },
  ];

  // Insert achievements into the database
  await prisma.achievement.createMany({
    data: achievements,
    skipDuplicates: true, // Avoid inserting duplicates
  });
}

async function main() {
  try {
    console.log("Iniciando o seed...");

    // Upload default avatar to LocalStack
    const defaultAvatarUrl = await uploadDefaultAvatar();
    console.log(`Avatar padrão enviado para o S3: ${defaultAvatarUrl}`);

    // Upload activity images
    const imageUrls = await uploadActivityImages();

    // Create activity types and achievements
    await createActivityTypes(imageUrls);
    console.log("Tipos de atividades criados com sucesso.");

    await createAchievements();
    console.log("Conquistas criadas com sucesso.");

    console.log("Seed concluído com sucesso!");
  } catch (error) {
    console.error("Erro durante o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
