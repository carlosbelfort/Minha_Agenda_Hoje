"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

type FormData = {
  files: FileList;
};

export function UploadAgendaPhotos({ agendaId }: { agendaId: string }) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();

      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });

      await api(`/agendas/${agendaId}/photos`, {
        method: "POST",
        body: formData,
      });

      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border rounded-lg p-4"
    >
      <input
        type="file"
        multiple
        accept="image/*"
        {...register("files", { required: true })}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-primary text-white"
      >
        {loading ? "Enviando..." : "Enviar fotos"}
      </button>

      {success && (
        <p className="text-green-600">Fotos enviadas com sucesso!</p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}