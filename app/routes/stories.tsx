// routes/stories.tsx
import { useActionData, Form } from "@remix-run/react";
import { json, ActionFunction } from "@remix-run/node";
import { loadStory } from "~/utils/watsonx.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const words = formData.get("words") as string;
  const subject = formData.get("subject") as string;

  try {
    const story = await loadStory(words.split(","), subject);
    return json({ story });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

const StoriesPage = () => {
  const actionData: any | undefined = useActionData();

  return (
    <div>
      <h1>Generate a Kid's Story</h1>
      <Form method="post">
        <div>
          <label htmlFor="words">Words (comma separated):</label>
          <input type="text" id="words" name="words" required />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" required />
        </div>
        <button type="submit">Generate Story</button>
      </Form>

      {actionData?.story && (
        <div>
          <p>{actionData.story}</p>
        </div>
      )}

      {actionData?.error && <p>Error: {actionData.error}</p>}
    </div>
  );
};

export default StoriesPage;
