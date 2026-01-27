"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAgendaPhotos = uploadAgendaPhotos;
const prisma_1 = require("../../lib/prisma");
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../../lib/cloudinary");
const uploadToCloudinary = (stream) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({ folder: "minha-agenda-hoje" }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        stream.pipe(uploadStream);
    });
};
async function uploadAgendaPhotos(request, reply) {
    const { id } = request.params;
    const { sub, role } = request.user;
    const agenda = await prisma_1.prisma.agenda.findUnique({
        where: { id },
    });
    if (!agenda) {
        return reply.status(404).send({ message: "Agenda não encontrada" });
    }
    if (role !== client_1.Role.ADMIN && agenda.userId !== sub) {
        return reply.status(403).send({ message: "Acesso negado" });
    }
    const files = await request.files();
    const uploadedPhotos = [];
    for await (const file of files) {
        const upload = await uploadToCloudinary(file.file);
        const photo = await prisma_1.prisma.photo.create({
            data: {
                url: upload.secure_url,
                agendaId: id,
            },
        });
        uploadedPhotos.push(photo);
    }
    return reply.status(201).send(uploadedPhotos);
}
