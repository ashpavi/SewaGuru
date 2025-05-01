import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';


const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, key);
}



const uploadBufferToSupabase = async (buffer, folderName = 'uploads', filePrefix = 'img') => {
  const supabase = getSupabase();
  const fileName = `${folderName}/${filePrefix}_${uuidv4()}.jpg`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

export { uploadBufferToSupabase, getSupabase };