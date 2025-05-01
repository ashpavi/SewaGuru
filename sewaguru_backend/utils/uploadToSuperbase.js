import { createClient } from '@supabase/supabase-js';
import { fileTypeFromBuffer } from 'file-type';


const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}


/**
 * 
 * @param {*} allowedMimes `['image/', 'application/pdf']` defaults to `['image/']`
 */
const uploadBufferToSupabase = async (
  buffer,
  folderName = 'uploads',
  fileName = 'file',
  allowedMimes = ['image/']
) => {
  const supabase = getSupabase();

  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType) {
    throw new Error('Could not determine file type');
  }

  const { ext, mime } = fileType;

  const isAllowed = allowedMimes.some(type =>
    type.endsWith('/') ? mime.startsWith(type) : mime === type
  );

  if (!isAllowed) {
    throw new Error(`Unsupported file type: ${mime}`);
  }

  const filePath = `${folderName}/${fileName}.${ext}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, buffer, {
      contentType: mime,
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export { getSupabase, uploadBufferToSupabase };
