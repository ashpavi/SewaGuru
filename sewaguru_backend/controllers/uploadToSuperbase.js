import { createClient } from '@supabase/supabase-js';
import { fileTypeFromBuffer } from 'file-type';


const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}



const uploadBufferToSupabase = async (buffer, folderName = 'uploads', fileName = 'img') => {
  const supabase = getSupabase();

  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !fileType.mime.startsWith('image/')) {
    throw new Error('Unsupported or invalid image format');
  }

  const ext = fileType.ext; // e.g., 'png', 'webp'
  const contentType = fileType.mime; // e.g., 'image/png'


  const filePath = `${folderName}/${fileName}.${ext}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, buffer, {
      contentType: contentType,
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

export { uploadBufferToSupabase, getSupabase };