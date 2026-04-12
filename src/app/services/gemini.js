export async function callGeminiAPI(prompt) {
  const apiKey = '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i <= 5; i += 1) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      if (i === 5) {
        throw new Error('عذراً، فشل الاتصال بخدمة الذكاء الاصطناعي بعد عدة محاولات. يرجى المحاولة لاحقاً.');
      }
      await new Promise((resolve) => {
        setTimeout(resolve, delays[i]);
      });
    }
  }

  return '';
}
