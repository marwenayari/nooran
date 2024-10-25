import {
  useActionData,
  Form,
  useNavigate,
  useSearchParams,
  useLoaderData,
  useNavigation,
  Link,
  ShouldRevalidateFunction,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import {
  json,
  ActionFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { loadStory } from "~/services/watsonx.server";
import { createSupabaseServerClient } from "~/services/upabase.server";
import { arraysHaveCommonElements } from "~/utils/keywordsSimilarity";
import { getSession } from "~/services/session.server";
import { useProfile } from "~/context/ProfileContext";
import { Story } from "~/types";
import { getStoryCover } from "~/utils/colors";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
  formAction,
  formMethod,
}) => {
  if (formAction || formMethod) {
    return true;
  }
  return nextUrl.pathname != currentUrl.pathname;
};

export const action: ActionFunction = async ({ request }) => {
  const words = ["عمل", "اتقان", "تحدي", "فرح", "تعلم", "سعادة", "تعاون"];
  const age = 12;

  const session = await getSession(request.headers.get("Cookie"));
  const profileId = session.get("profileId");

  if (!profileId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const story = await loadStory(words, age);
    const { supabase } = createSupabaseServerClient(request);
    const storyObject = JSON.parse(story);
    const { error } = await supabase.from("stories").insert([
      {
        title: storyObject.title,
        title_en: storyObject.title_en,
        brief: storyObject.brief,
        brief_en: storyObject.brief_en,
        content: storyObject.content,
        content_en: storyObject.content_en,
        user_id: profileId,
        keywords: words,
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    return redirect("/stories");
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient(request);
  const session = await getSession(request.headers.get("Cookie"));
  const profileId = session.get("profileId");

  const { data: stories, error: userStoriesError } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (userStoriesError) {
    console.error("Error fetching user stories:", userStoriesError.message);
    return json({ error: "Failed to load stories" }, { status: 500 });
  }

  const userKeywords = stories.flatMap((story) => story.keywords);

  const { data: otherStories, error: otherStoriesError } = await supabase
    .from("stories")
    .select("*")
    .neq("user_id", profileId);

  if (otherStoriesError) {
    console.error("Error fetching other stories:", otherStoriesError.message);
    return json({ error: "Failed to load other stories" }, { status: 500 });
  }

  const storiesForYou = otherStories.filter((story) =>
    arraysHaveCommonElements(story.keywords, userKeywords)
  );

  return json({ stories, storiesForYou });
};

const StoriesPage = () => {
  const profile = useProfile();
  let { t } = useTranslation("stories");
  const { stories, storiesForYou, error }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state !== "idle";

  if (error) {
    return <div>Error: {error}</div>;
  }
  const name = profile?.display_name.split(" ")[0];
  const forYou = storiesForYou;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = parseInt(searchParams.get("type") || "-1");
  const selected = parseInt(searchParams.get("selected") || "-1");

  function selectStory(type: number, key: number) {
    navigate("/stories?type=" + type + "&selected=" + key);
    // use client side navigation to /stories?type=" + type + "&selected=" + keylike if using <Link> in html
  }

  function getStory(key: number) {
    if (type === 0) {
      return stories[key];
    } else {
      return forYou[key];
    }
  }

  return (
    <section className="flex ">
      <section className="flex flex-col gap-10 w-3/5">
        <h1 className="text-5xl w-80 text-slate-800  ">
          {t("happy-reading", { name: name })}
        </h1>
        <p className="text-slate-800 w-1/2 ">{t("achievements-celebrate")}</p>
        <Form method="post" className="flex flex-col gap-4">
          <button
            className="w-40 rounded-full bg-slate-800 text-white h-10"
            disabled={loading}
            type="submit"
          >
            <span className="loader"></span>
            {t("generate-story")}{" "}
          </button>
        </Form>

        <h2 className="text-3xl text-slate-800">{t("latest-stories")}</h2>
        <div className="flex gap-10  overflow-x-scroll w-screen/2">
          {loading ? (
            <div className="h-40 w-28 min-w-28">
              <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto mb-3 h-40">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right relative pt-2">
                <div className="h-3 bg-slate-200 rounded col-span-2 w-2/3 right-0 absolute"></div>
              </div>
            </div>
          ) : (
            ""
          )}
          {stories.length ? (
            stories.map((story: Story, idx: number) => (
              <div key={story.id}>
                <div
                  onClick={() => {
                    selectStory(0, idx);
                  }}
                  className={`cover cursor-pointer shadow-xl h-40 w-28 rounded-md  ${getStoryCover(
                    idx
                  )} text-center p-2 text-white mb-3`}
                >
                  <h4>{story.title}</h4>
                </div>
                <Link
                  to={"/stories?type=0" + "&selected=" + idx}
                  className="cursor-pointer w-28 rtl"
                >
                  {story.title.length <= 15
                    ? story.title
                    : "..." + story.title.substring(0, 15)}
                </Link>
              </div>
            ))
          ) : (
            <div>
              <h2>{t("no-stories")}</h2>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-3xl text-slate-800">{t("for-you")}</h2>
          <h2 className="text-md mt-[-5px] text-slate-600">
            | {t("stories-by-others")}
          </h2>
        </div>
        <div className="flex gap-10  overflow-x-scroll w-full">
          {forYou.map((story: Story, idx: number) => (
            <div
              key={story.id}
              onClick={() => {
                selectStory(1, idx);
              }}
            >
              <div
                className={`cover cursor-pointer shadow-xl rounded-md h-40 w-28 ${getStoryCover(
                  idx
                )} text-center p-2 text-white mb-3`}
              >
                <h4>{story.title}</h4>
              </div>
              <h4 className="cursor-pointer w-28">{story.title}</h4>
            </div>
          ))}
        </div>

        {/* {actionData?.story && (
          <div className="mt-4">
            <p>{actionData.story}</p>
          </div>
        )} */}

        {/* {actionData?.error && <p>Error: {actionData.error}</p>} */}
      </section>
      {selected != -1 ? (
        <section className="w-2/5 fixed ltr:right-0 rtl:left-0 top-0 bg-white h-full p-16">
          <div className="flex gap-4">
            <div
              className={`cover ltr:ml-[-7rem]  rtl:mr-[-7rem] cursor-pointer rounded-md shadow-xl min-w-28 h-40 w-28 ${getStoryCover(
                selected
              )} text-center p-2 text-white`}
            >
              <h2>{getStory(selected).title}</h2>
            </div>
            <div className="h-40 flex flex-col justify-between">
              <h2 className="text-3xl text-slate-800">
                {getStory(selected).title}
              </h2>
              <p className="text-slate-800 ">{getStory(selected).brief}</p>
              <button className="w-40 rounded-full bg-slate-800 text-white h-10">
                {t("read-story")}
              </button>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
    </section>
  );
};

export default StoriesPage;
