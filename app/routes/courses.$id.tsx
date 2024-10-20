import { json, LoaderFunctionArgs } from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import {createSupabaseServerClient} from "~/services/upabase.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const {supabase} = createSupabaseServerClient(request);
  const {data} = await supabase.from('courses').select('id, title, color, lessons(id, title)').match({id: Number(params['id'])}).single();
  return json(data);
};

const CoursePage = () => {
  const course = useLoaderData();


  const getMarginLeft = (index: number) => {
    const mls = ["ml-0 rtl:mr-0", "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]", "ml-[-4rem] rtl:ml-0 rtl:mr-[-4rem]", "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]", "ml-0 rtl:mr-0", "ml-[2rem] rtl:ml-0 rtl:mr-[2rem]", "ml-[4rem] rtl:ml-0 rtl:mr-[4rem]"];
    return mls[index  % 6];
  };

  return (
    <section className="flex flex-col items-center">
      <div
        className={`w-2/3 rounded-lg p-2 text-white`}
        style={{
          backgroundColor: course.color
        }}
      >
        <div className=" flex items-center">
          <Link to={`/`}>
            <i className="text-xl ri-arrow-left-line"></i>

          </Link>
          {course.title}
        </div>
        <div>{course.description}</div>
      </div>
      <div className="path lessons flex flex-col gap-8 justify-between pt-8 pb-4">
        {course.lessons.map((lesson, idx) => (
          <Link
              to={`/lessons/${lesson.id}`}
            key={lesson.id}
            className={`flex items-center justify-center shadow-lg shadow-slate-400 rounded-full w-16 h-16 ${getMarginLeft(idx)}`}
              style={{
                backgroundColor: course.color
              }}
          >
            <i className="text-4xl text-white ri-star-fill cursor-pointer"></i>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CoursePage;
