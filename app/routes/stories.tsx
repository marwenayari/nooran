import {
  useActionData,
  Form,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { json, ActionFunction } from "@remix-run/node";
import { loadStory } from "~/services/watsonx.server";

export const action: ActionFunction = async ({ request }) => {
  const words = ["صداقة", "عائلة", "أهل", "محبة"];
  const age = 9;

  try {
    const story = await loadStory(words, age);
    return json({ story });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};

const StoriesPage = () => {
  const actionData: any | undefined = useActionData();

  let { t } = useTranslation("story");
  const displayName = "Marwen";
  const colors = [
    "bg-amber-300",
    "bg-sky-300",
    "bg-emerald-300",
    "bg-red-200",
    "bg-lime-400",
    "bg-teal-800",
  ];
  const stories = [
    {
      title: "My Last Story",
      brief: "This is the last story I wrote",
      id: 0,
    },
    {
      title: "Second One",
      brief: "This is the second story I wrote",
      id: 1,
    },
    {
      title: "The Start!",
      brief:
        "This is the start of imagination, this is the start of creativity!",
      id: 2,
    },
  ];
  const forYou = [
    {
      title: "Chosen Story 1",
      id: 0,
      brief: "This is the first of the chosen stories",
    },
    {
      title: "Second of Chosen!",
      id: 1,
      brief: "This is the second of the chosen stories",
    },
    {
      title: "Another Chosen Story",
      id: 2,
      brief: "This is the third of the chosen stories",
    },
    {
      title: "Best of Chosen Story",
      id: 3,
      brief: "This is the fourth of the chosen stories",
    },
    {
      title: "The Last of All",
      id: 4,
      brief: "This is the last of the chosen stories",
    },
  ];

  if (actionData) {
    stories.unshift({
      title: "Generated Story",
      brief: actionData.story,
      id: 2,
    });
  }

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = parseInt(searchParams.get("type") || "0");
  const selected = parseInt(searchParams.get("selected") || "0");

  function selectStory(type: number, key: number) {
    navigate("/stories?type=" + type + "&selected=" + key);
  }

  function getStory(key: number) {
    if (type === 0) {
      return stories[key];
    } else {
      return forYou[key];
    }
  }

  return (
    <div className="flex ">
      <div className="flex flex-col gap-10 w-3/5">
        <h1 className="text-5xl w-80 text-slate-800  ">
          Happy reading, {displayName}
        </h1>
        <p className="text-slate-800 w-1/2 ">
          Wow!, You've achieved a lot today, let's celebrate by generating a
          story with the words you learned so far.
        </p>
        <Form method="post" className="flex flex-col gap-4">
          <button
            className="w-40 rounded-full bg-slate-800 text-white h-10"
            type="submit"
          >
            {t("generate-story")}{" "}
          </button>
        </Form>

        <h2 className="text-3xl text-slate-800">Your Latest Stories</h2>
        <div className="flex gap-10  overflow-x-scroll w-screen/2">
          {stories.map((story, idx) => (
            <div
              key={idx}
              onClick={() => {
                selectStory(0, story.id);
              }}
            >
              <div
                className={`cover cursor-pointer shadow-xl h-40 w-28  ${
                  colors[idx % 6]
                } text-center p-2 text-white mb-3`}
              >
                <h4>{story.title}</h4>
              </div>
              <h4 className="cursor-pointer w-28">{story.title}</h4>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-3xl text-slate-800">For You!</h2>
          <h2 className="text-md mt-[-5px] text-slate-600">
            | Stories By Others
          </h2>
        </div>
        <div className="flex gap-10  overflow-x-scroll w-full">
          {forYou.map((story, idx) => (
            <div
              key={idx}
              onClick={() => {
                selectStory(1, story.id);
              }}
            >
              <div
                className={`cover cursor-pointer shadow-xl h-40 w-28 ${
                  colors[idx % 6]
                } text-center p-2 text-white mb-3`}
              >
                <h4>{story.title}</h4>
              </div>
              <h4 className="cursor-pointer w-28">{story.title}</h4>
            </div>
          ))}
        </div>

        {actionData?.story && (
          <div className="mt-4">
            <p>{actionData.story}</p>
          </div>
        )}

        {actionData?.error && <p>Error: {actionData.error}</p>}
      </div>
      {selected != null ? (
        <div className="w-2/5 fixed right-0 top-0 bg-white h-full p-16">
          <div className="flex gap-4">
            <div
              className={`cover ml-[-7rem] cursor-pointer shadow-xl h-40 w-28 ${
                colors[selected % 6]
              } text-center p-2 text-white`}
            >
              <h2>{getStory(selected).title}</h2>
            </div>
            <div className="h-40 flex flex-col justify-between">
              <h2 className="text-3xl text-slate-800">
                {getStory(selected).title}
              </h2>
              <p className="text-slate-800 ">{getStory(selected).brief}</p>
              <button
                className="w-40 rounded-full bg-slate-800 text-white h-10"
                type="submit"
              >
                Read Story
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default StoriesPage;
