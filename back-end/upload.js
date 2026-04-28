import "dotenv/config";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToSupabase = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("game-uploads")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("game-uploads")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

export const deleteFromSupabase = async (publicUrl) => {
  const fileName = publicUrl.split("/").pop();
  const { error } = await supabase.storage
    .from("game-uploads")
    .remove([fileName]);

  if (error) throw error;
};