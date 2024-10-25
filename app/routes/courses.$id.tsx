import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/services/upabase.server";
import { CourseDetails, toCourseDetails } from "~/models/CourseDetails";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient(request);
  const { data } = await supabase
    .from("courses")
    .select("id, title, description, progress_color, lessons(id, title)")
    .match({ id: Number(params["id"]) })
    .single();
  return json(toCourseDetails(data));
};

const CoursePage = () => {
  const course = useLoaderData<CourseDetails>();
  const getMarginLeft = (index: number) => {
    const mls = [
      "ml-0 rtl:mr-0",
      "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]",
      "ml-[-4rem] rtl:ml-0 rtl:mr-[-4rem]",
      "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]",
      "ml-0 rtl:mr-0",
      "ml-[2rem] rtl:ml-0 rtl:mr-[2rem]",
      "ml-[4rem] rtl:ml-0 rtl:mr-[4rem]",
    ];
    return mls[index % 6];
  };

  return (
    <section className="flex flex-col items-center">
      <div
        className={`w-2/3 rounded-lg p-2 text-white`}
        style={{
          backgroundColor: course.progressColor,
        }}
      >
        <div className=" flex items-center uppercase opacity-70">
          <Link to={`/`}>
            <i className="text-xl ri-arrow-left-line mr-2 my-2"></i>
          </Link>
          {course.title}
        </div>
        <div>{course.description}</div>
      </div>
      <div className="path lessons flex flex-col gap-8 justify-between items-center pt-8 pb-4">
        {course.lessons.map((lesson, idx) => (
          <Link
            to={`/lessons/${lesson.id}`}
            key={lesson.id}
            className={`flex items-center justify-center shadow-lg shadow-slate-400 rounded-full w-16 h-16 ${getMarginLeft(
              idx
            )}`}
            style={{
              backgroundColor: course.progressColor,
            }}
          >
            <i className="text-4xl text-white ri-star-fill cursor-pointer"></i>
          </Link>
        ))}
        {/* <img
          className="w-56"
          src="https://d35aaqx5ub95lt.cloudfront.net/images/pathCharacters/locked/bf1a9ccba05390a74cf13a0f7c9a665d.svg"
        ></img> */}
        <img className="w-56" src="/img/trophy.png"></img>
      </div>
    </section>
  );
};

export default CoursePage;
