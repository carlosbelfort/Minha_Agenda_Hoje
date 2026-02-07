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

  try {
    const files = await request.files();
    const uploadedPhotos = [];

    for await (const file of files) {
      const upload = await uploadToCloudinary(file.file);

      const photo = await prisma.photo.create({
        data: {
          url: upload.secure_url,
          publicId: upload.public_id,
          agendaId: id,
        },
      });

      uploadedPhotos.push(photo);
    }

    return reply.status(201).send(uploadedPhotos);
  } catch (error) {
    console.error("Erro no upload:", error);
    return reply.status(500).send({
      message: "Erro ao realizar upload das fotos",
    });
  }
}

export async function deleteAgendaPhoto(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { agendaId, photoId } = request.params as {
      agendaId: string;
      photoId: string;
    };

    const { sub, role } = request.user as {
      sub: string;
      role: Role;
    };

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { agenda: true },
    });

    if (!photo) {
      return reply.status(404).send({ message: "Foto não encontrada" });
    }

    // Verifica permissão
    if (role !== Role.ADMIN && photo.agenda.userId !== sub) {
      return reply.status(403).send({ message: "Acesso negado" });
    }

    // Remove do Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Remove do banco
    await prisma.photo.delete({
      where: { id: photoId },
    });

    return reply.send({ success: true });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return reply
      .status(500)
      .send({ message: "Erro ao excluir foto" });
  }
}

