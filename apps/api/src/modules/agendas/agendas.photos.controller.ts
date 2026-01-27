import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { Role } from "@prisma/client";
import { cloudinary } from "../../lib/cloudinary";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

const uploadToCloudinary = (
  stream: NodeJS.ReadableStream,
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "minha-agenda-hoje" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResult);
      },
    );

    stream.pipe(uploadStream);
  });
};

export async function uploadAgendaPhotos(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const { sub, role } = request.user as { sub: string; role: Role };

  const agenda = await prisma.agenda.findUnique({
    where: { id },
  });

  if (!agenda) {
    return reply.status(404).send({ message: "Agenda não encontrada" });
  }

  if (role !== Role.ADMIN && agenda.userId !== sub) {
    return reply.status(403).send({ message: "Acesso negado" });
  }

  const files = await request.files();
  const uploadedPhotos = [];

  for await (const file of files) {
    const upload = await uploadToCloudinary(file.file);

    const photo = await prisma.photo.create({
      data: {
        url: upload.secure_url,
        agendaId: id,
      },
    });

    uploadedPhotos.push(photo);
  }

  return reply.status(201).send(uploadedPhotos);
}