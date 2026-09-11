const fallbackAnalysis = (matchingSkills, missingSkills) => ({
  strengths: matchingSkills.length
    ? [`Resume contains ${matchingSkills.length} relevant job skill${matchingSkills.length === 1 ? '' : 's'}`]
    : ['Resume text was extracted successfully'],
  weaknesses: missingSkills.length
    ? [`The resume does not mention ${missingSkills.length} important job skill${missingSkills.length === 1 ? '' : 's'}`]
    : ['Add measurable achievements to make experience stronger'],
  suggestions: [
    'Mention measurable results in project or work descriptions',
    ...(missingSkills.length ? [`Add relevant experience with: ${missingSkills.slice(0, 3).join(', ')}`] : [])
  ]
});

const cleanList = (value) => Array.isArray(value) ? value.filter(item => typeof item === 'string').slice(0, 8) : [];

export async function getAiExplanation(resumeText, jobDescription, matchingSkills, missingSkills) {
  const fallback = fallbackAnalysis(matchingSkills, missingSkills);
  if (!process.env.AI_API_KEY) return fallback;

  const prompt = `Analyze this resume against this job description. Return JSON only with arrays: strengths, weaknesses, suggestions. Do not return a score.\n\nRESUME:\n${resumeText.slice(0, 12000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}`;
  try {
    const response = await fetch(process.env.AI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model: process.env.AI_MODEL || 'gpt-4o-mini', temperature: 0.2, messages: [{ role: 'user', content: prompt }] })
    });
    if (!response.ok) throw new Error(`AI request failed: ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonText = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(jsonText);
    return {
      strengths: cleanList(parsed.strengths).length ? cleanList(parsed.strengths) : fallback.strengths,
      weaknesses: cleanList(parsed.weaknesses).length ? cleanList(parsed.weaknesses) : fallback.weaknesses,
      suggestions: cleanList(parsed.suggestions).length ? cleanList(parsed.suggestions) : fallback.suggestions
    };
  } catch (error) {
    console.error('AI explanation unavailable:', error.message);
    return fallback;
  }
}