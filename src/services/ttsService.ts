import crypto from 'crypto';

// In-memory audio cache: MD5(text) -> MP3 Buffer
const ttsCache = new Map<string, Buffer>();

/**
 * Splits text into natural sentence chunks of <= maxChars, respecting Bangla punctuation and word boundaries
 */
export function chunkBanglaText(text: string, maxChars: number = 150): string[] {
  // Clean text from Markdown or special symbols
  const clean = text
    .replace(/[#*_`~>[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  // Match sentences ending with ।, ?, !, or newlines
  const sentences = clean.match(/[^।?!]+[।?!]?/g) || [clean];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (trimmed.length > maxChars) {
      // Split sentence further by comma or space
      const words = trimmed.split(' ');
      for (const word of words) {
        if ((currentChunk + ' ' + word).trim().length > maxChars) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk = currentChunk ? currentChunk + ' ' + word : word;
        }
      }
    } else {
      if ((currentChunk + ' ' + trimmed).trim().length > maxChars) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = trimmed;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + trimmed : trimmed;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Synthesizes high-fidelity, clear Bengali female newsreader audio
 */
export async function generateBengaliSpeechAudio(fullText: string): Promise<Buffer> {
  // Check cache first
  const hash = crypto.createHash('md5').update(fullText).digest('hex');
  const cached = ttsCache.get(hash);
  if (cached) {
    return cached;
  }

  const chunks = chunkBanglaText(fullText, 160);
  if (chunks.length === 0) {
    throw new Error('কোনো পাঠ্য খুঁজে পাওয়া যায়নি।');
  }

  const audioBuffers: Buffer[] = [];

  // Fetch each sentence audio sequentially with natural pacing
  for (const chunk of chunks) {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=bn&client=tw-ob&q=${encodeURIComponent(chunk)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*',
      },
    });

    if (!response.ok) {
      console.warn(`TTS fetch warning for chunk "${chunk}": HTTP ${response.status}`);
      continue;
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      audioBuffers.push(Buffer.from(arrayBuffer));
    }
  }

  if (audioBuffers.length === 0) {
    throw new Error('অডিও তৈরি করতে ব্যর্থ হয়েছে।');
  }

  const combinedBuffer = Buffer.concat(audioBuffers);

  // Cache for future requests
  ttsCache.set(hash, combinedBuffer);

  return combinedBuffer;
}
