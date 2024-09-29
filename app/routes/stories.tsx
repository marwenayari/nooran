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
  const story =
    "يُحكى عن أسرة سعيدة تعيش في قرية جميلة بين الجبال والطبيعة الخلابة. كانت هذه الأسرة تتألف من أب وأم وأطفالهما الثلاثة. كانوا يحبون قضاء الوقت معاً واستكشاف المناظر الطبيعية الساحرة حول منزلهم. في يوم من الأيام، قررت العائلة الذهاب في رحلة تسلق إلى قمة جبل قريب. أثناء صعودهم، تعرف الأطفال على أصدقاء جدد كانوا أيضاً يستمتعون بجمال الطبيعة ويستكشفون الجبال. لعبوا معاً وتبادلوا القصص والضحكات تحت أشعة الشمس الدافئة. عندما وصلوا إلى قمة الجبل، استمتعوا بمشاهدة المناظر الخلابة وتبادلوا مشاعر الامتنان لجمال الطبيعة والأصدقاء الجدد الذين تعرفوا عليهم. تعلم الأطفال أهمية الصداقة والتعاون بين الناس وكيف يمكن للطبيعة أن تجمعنا معاً. في طريق عودتهم إلى المنزل، شكر الأطفال والديهم على هذه المغامرة الرائعة ووعدوهم بمشاركة هذه التجربة مع أصدقائهم الجدد. ومنذ ذلك اليوم، أصبحت العائلة وأصدقاؤهم الجدد يجتمعون بانتظام للاستمتاع بجمال الطبيعة وتعزيز روابط الصداقة والمحبة بينهم.";

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
        <div className="mt-4 text-center flex items-center justify-between">
          <p>{actionData.story}</p>
          <p>{actionData.story}</p>
        </div>
      )}

      <div className="mt-4 text-center flex flex-row-reverse items-center justify-between">
        <p className="mx-10 mt-4 text-xl leading-8">{story}</p>
      </div>

      {actionData?.error && <p>Error: {actionData.error}</p>}
    </div>
  );
};

export default StoriesPage;
