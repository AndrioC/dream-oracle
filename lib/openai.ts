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
          "You are an expert in interpreting dreams and creating precise prompts for AI image generation. Your task is to translate the provided dream description into English and create a prompt that vividly captures the essence and main elements of the dream, while explicitly incorporating the specified image style. Blend the dream's key imagery, emotions, and symbols with the characteristics of the given art style to create a cohesive and visually striking description.",
      },
      {
        role: 'user',
        content: `Dream description: "${text}". 
  Image style: ${imageType}. 
  
  Please create a detailed and evocative prompt based on this dream description and image style. Your prompt should:
  1. Begin with a clear statement of the image style, e.g., "In the style of [image style]," or "A [image style] depiction of..."
  2. Accurately reflect the main elements, atmosphere, and emotions of the described dream.
  3. Translate any non-English elements into English.
  4. Seamlessly integrate the specified image style with the dream's content, describing how key elements of the dream would be represented in this style.
  5. Use language and descriptors that are characteristic of the specified art style.
  6. Avoid adding excessive details not present in the original description.
  7. Focus on clarity and precision to prevent misinterpretations by the image generation model.
  8. Aim for a coherent and vivid description that will result in a high-quality, dream-like image in the specified style.
  
  Ensure your prompt stays true to the dreamer's vision while fully embodying the chosen artistic style, making it suitable for AI image generation.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 250,
  });

  return response.choices[0].message.content || text;
}

export async function generateDreamImage(
  dreamDescription: string,
  imageType: string
): Promise<string> {
  let stylePrompt = '';

  switch (imageType) {
    case 'abstract':
      stylePrompt = 'an abstract painting with bold shapes and colors';
      break;
    case 'anime':
      stylePrompt =
        'a Japanese anime scene with vibrant colors and expressive characters';
      break;
    case 'watercolor':
      stylePrompt =
        'a soft and ethereal watercolor painting with delicate brush strokes';
      break;
    case 'art-nouveau':
      stylePrompt =
        'an Art Nouveau piece with ornate, nature-inspired designs and flowing lines';
      break;
    case 'cartoon':
      stylePrompt =
        'a colorful cartoon scene with exaggerated features and lively expressions';
      break;
    case 'cyberpunk':
      stylePrompt =
        'a futuristic cyberpunk scene with neon lights, advanced technology, and urban dystopia';
      break;
    case 'pixar':
      stylePrompt =
        'a Pixar-style 3D animated scene with vibrant colors and charming characters';
      break;
    case 'van-gogh':
      stylePrompt =
        'a post-impressionist painting in the style of Van Gogh with bold brushstrokes and vivid colors';
      break;
    case 'medieval-fantasy':
      stylePrompt =
        'a medieval fantasy scene with castles, mythical creatures, and magical elements';
      break;
    case 'minimalist':
      stylePrompt =
        'a minimalist design with simple shapes, limited color palette, and lots of negative space';
      break;
    case 'oil':
      stylePrompt =
        'a richly textured oil painting with deep colors and visible brush strokes';
      break;
    case 'pixel-art':
      stylePrompt =
        'a retro-style pixel art scene with distinct, blocky pixels and limited color palette';
      break;
    case 'pop-art':
      stylePrompt =
        'a bold pop art piece inspired by Roy Lichtenstein with bright colors and comic-like elements';
      break;
    case 'realistic':
      stylePrompt =
        'a highly detailed, photorealistic image with accurate lighting and textures';
      break;
    case 'surrealist':
      stylePrompt =
        'a surrealist painting in the style of Salvador Dalí with dreamlike and impossible elements';
      break;
    default:
      stylePrompt = 'a surreal and artistic image';
  }

  const enhancedPrompt = await translateAndEnhancePrompt(
    dreamDescription,
    stylePrompt
  );

  console.log('Enhanced prompt:', enhancedPrompt);
  console.log('stylePrompt:', stylePrompt);

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
