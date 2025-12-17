import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      grade, 
      goal, 
      exams, 
      targetYear, 
      language = "ru",
      englishLevel,
      ieltsScore,
      entScore,
      satScore,
      gpa,
      specialty,
      needScholarship,
      specificGoal
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const yearsUntilTarget = targetYear - currentYear;
    const monthsUntilTarget = yearsUntilTarget * 12 - currentMonth;

    const langText = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";

    const systemPrompt = `You are an expert university admission counselor specializing in helping students from Kazakhstan apply to universities.

IMPORTANT: Respond ONLY with valid JSON, no markdown or explanations.

The response must be a JSON object with this exact structure:
{
  "milestones": [
    {
      "id": "unique-id-1",
      "title": "Short milestone title",
      "description": "1-2 sentence explanation with specific actions",
      "status": "not_started",
      "category": "category name",
      "order": 1
    }
  ],
  "currentStage": "Current stage description",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "warnings": [
    "Common mistake to avoid 1",
    "Common mistake to avoid 2", 
    "Common mistake to avoid 3"
  ],
  "expectedProgressByMonth": {
    "1": 5,
    "3": 15,
    "6": 35,
    "9": 55,
    "12": 80
  }
}

Categories to use: "preparation", "exams", "documents", "applications", "final"
Status must always be "not_started" for new milestones.
Generate 10-15 milestones that are realistic, specific and actionable.
Include specific deadlines and dates where applicable.

Recommendations should be personalized based on the student's scores and goals.
Warnings should highlight common mistakes students make in this specific situation.
expectedProgressByMonth shows what % of milestones should be done by each month (from now).

Language for ALL content: ${langText}`;

    const userPrompt = `Create a detailed admission path for a student with these details:

PROFILE:
- Grade: ${grade}
- Goal region: ${goal === "local" ? "Kazakhstan universities" : "International universities (USA, Europe, Asia)"}
- Specific goal: ${specificGoal || "Not specified"}
- Main exams: ${exams.join(", ")}
- Target intake year: ${targetYear} (${yearsUntilTarget} year${yearsUntilTarget > 1 ? "s" : ""}, ~${monthsUntilTarget} months from now)

SCORES:
- English level: ${englishLevel || "Not specified"}
- IELTS: ${ieltsScore || "Not taken yet"}
- ENT: ${entScore || "Not taken yet"}
- SAT: ${satScore || "Not taken yet"}
- GPA (out of 5): ${gpa || "Not specified"}

PREFERENCES:
- Specialty: ${specialty || "Not decided"}
- Need scholarship: ${needScholarship ? "Yes, looking for financial aid" : "No, can self-fund"}

Generate a comprehensive plan with:
1. Milestones covering exam preparation, score improvement, document preparation, university research, applications, and final steps
2. 5 personalized recommendations based on their current scores and goals
3. 5 common mistakes to avoid specific to their situation
4. Expected progress timeline

${needScholarship ? "IMPORTANT: Include scholarship application milestones and deadlines." : ""}
${ieltsScore && parseFloat(ieltsScore) < 6.5 ? "IMPORTANT: Student needs significant IELTS improvement - include intensive preparation milestones." : ""}
${specificGoal?.toLowerCase().includes("ivy") || specificGoal?.toLowerCase().includes("grant") ? "IMPORTANT: Student has ambitious goals - include competitive positioning strategies and backup options." : ""}`;

    console.log("Generating comprehensive path with Lovable AI...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");
    
    // Clean and parse JSON
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const pathData = JSON.parse(cleanedContent);
    
    console.log("Path generated successfully with", pathData.milestones?.length, "milestones");
    console.log("Recommendations:", pathData.recommendations?.length);
    console.log("Warnings:", pathData.warnings?.length);

    return new Response(
      JSON.stringify(pathData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating path:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
