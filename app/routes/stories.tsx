import { useActionData, Form } from "@remix-run/react";
import { json, ActionFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { loadStory } from "~/services/watsonx.server";

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
  let { t } = useTranslation("story");

  return (
    <div>
      <Form method="post" className="flex flex-col gap-4">
        <div>
          <label htmlFor="words">{t("words")}: </label>
          <input type="text" id="words" name="words" required />
        </div>
        <div>
          <label htmlFor="subject">{t("subject")}: </label>
          <input type="text" id="subject" name="subject" required />
        </div>
        <button
          className="w-40 rounded-md border-solid border-2 border-cyan-000"
          type="submit"
        >
          {t("generate-story")}{" "}
        </button>
      </Form>

      {actionData?.story && (
        <div className="mt-4 text-center">
          <p>{actionData.story}</p>
        </div>
      )}

      {actionData?.error && <p>Error: {actionData.error}</p>}
    </div>
  );
};

export default StoriesPage;
