import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function interpretDream(
  dreamDescription: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'Você é um especialista em interpretação de sonhos. Forneça uma interpretação detalhada e perspicaz para o sonho descrito.',
      },
      { role: 'user', content: `Interprete este sonho: ${dreamDescription}` },
    ],
    max_tokens: 500,
  });

  return (
    response.choices[0].message.content ||
    'Não foi possível interpretar o sonho.'
  );
}

async function translateAndEnhancePrompt(
  text: string,
  imageType: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content:
          'Você é um especialista em criar prompts detalhados para geração de imagens por IA. Sua tarefa é traduzir o texto fornecido para o inglês, aprimorá-lo com detalhes vívidos e criar um prompt abrangente que inclua TODOS os elementos principais da descrição original. É crucial que cada aspecto significativo do sonho seja representado na imagem final. Incorpore o estilo de imagem especificado de forma integrada. Concentre-se na clareza, coerência e evite elementos que possam levar a distorções ou interpretações errôneas pelo modelo de geração de imagens.',
      },
      {
        role: 'user',
        content: `Descrição original: "${text}". Estilo de imagem: ${imageType}. Por favor, forneça um prompt detalhado e coerente que resultará em uma imagem de alta qualidade e sem distorções. Certifique-se de que TODOS os elementos principais da descrição original do sonho sejam incluídos e claramente descritos no prompt. Por exemplo, se o sonho menciona tanto aviões quanto ninjas, certifique-se de que o prompt gerará uma imagem contendo AMBOS aviões E ninjas, não apenas um ou outro.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.choices[0].message.content || text;
}

export async function generateDreamImage(
  dreamDescription: string,
  imageType: string
): Promise<string> {
  let stylePrompt = '';

  switch (imageType) {
    case 'abstrato':
      stylePrompt = 'an abstract painting';
      break;
    case 'anime':
      stylePrompt = 'a Japanese anime scene';
      break;
    case 'aquarela':
      stylePrompt = 'a soft and ethereal watercolor painting';
      break;
    case 'art-nouveau':
      stylePrompt = 'an Art Nouveau style illustration';
      break;
    case 'cartoon':
      stylePrompt = 'a colorful cartoon drawing';
      break;
    case 'cyberpunk':
      stylePrompt =
        'a futuristic cyberpunk scene with neons and advanced technology';
      break;
    case 'pixar':
      stylePrompt = 'a 3D scene in the style of Pixar movies';
      break;
    case 'van-gogh':
      stylePrompt =
        'a post-impressionist painting in the style of Vincent van Gogh';
      break;
    case 'fantasia-medieval':
      stylePrompt = 'a medieval fantasy illustration';
      break;
    case 'minimalista':
      stylePrompt =
        'a minimalist illustration with simple shapes and solid colors';
      break;
    case 'oleo':
      stylePrompt = 'an oil painting with rich textures';
      break;
    case 'pixel-art':
      stylePrompt = 'a 16-bit pixel art image';
      break;
    case 'pop-art':
      stylePrompt = 'a pop art piece in the style of Andy Warhol';
      break;
    case 'realista':
      stylePrompt = 'a photorealistic image';
      break;
    case 'surrealista':
      stylePrompt = 'a surrealist image in the style of Salvador Dalí';
      break;
    default:
      stylePrompt = 'a surreal and artistic image';
  }

  const enhancedPrompt = await translateAndEnhancePrompt(
    dreamDescription,
    stylePrompt
  );

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: '1024x1024',
  });

  const imageUrl = response.data[0].url;
  if (!imageUrl) {
    throw new Error('Failed to generate image');
  }

  const imageResponse = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(imageResponse.data, 'binary');

  const fileName = `dream-oracle-images/${Date.now()}.png`;

  const { error } = await supabase.storage
    .from('dream-oracle-images')
    .upload(fileName, buffer, {
      contentType: 'image/png',
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('dream-oracle-images').getPublicUrl(fileName);

  return publicUrl;
}
