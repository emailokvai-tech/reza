/**
 * @file rewrite-news.ts
 * Client-side action wrapper to communicate with the secure server-side Gemini API.
 * This completely prevents exposing any secret API keys to the browser.
 */

export interface RewrittenNewsResult {
  title: string;
  excerpt: string;
  body: string;
  quote: string;
}

export async function rewriteNewsAction(rawText: string): Promise<RewrittenNewsResult> {
  if (!rawText || rawText.trim() === "") {
    throw new Error("সংবাদের মূল খসড়া বা টেক্সট প্রদান করা আবশ্যক।");
  }

  const response = await fetch('/api/rewrite-news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rawText })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'এআই সংবাদ পুনর্লিখন সম্পন্ন করতে ব্যর্থ হয়েছে।');
  }

  return {
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    quote: data.quote
  };
}
