import { createSupabaseServerClient } from "./upabase.server";

export const fetchUserJourney = async (userId: string, request: Request) => {
  const { supabase } = createSupabaseServerClient(request);

  // Fetch all lessons the user has finished
  const { data: userJourney, error: journeyError } = await supabase
    .from("user_journey")
    .select("lesson_id")
    .eq("user_id", userId);

  if (journeyError) throw new Error(journeyError.message);

  const lessonIds = userJourney.map(
    (journey: { lesson_id: number }) => journey.lesson_id
  );

  // Fetch the covered words in those lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("covered_words")
    .in("id", lessonIds);

  if (lessonsError) throw new Error(lessonsError.message);

  // Combine all covered words from the finished lessons
  const coveredWords = lessons.reduce(
    (allWords: string[], lesson: { covered_words: string[] }) => {
      return [...allWords, ...lesson.covered_words];
    },
    []
  );

  return coveredWords;
};
