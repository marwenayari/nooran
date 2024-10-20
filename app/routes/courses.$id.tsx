import { json, LoaderFunctionArgs } from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import { getCourseBgFull } from "~/utils/colors";

const courses = [
  {
    id: 0,
    title: "Arabic 101",
    description: "Learn the basics of Arabic",
    level: "Beginner",
    rate: 4.6,
    price: 0,
    color: "bg-red-200",
  },
  {
    id: 1,
    title: "Arabic 201",
    description: "Learn the intermediate level of Arabic",
    level: "Intermediate",
    rate: 4.8,
    price: 0,
    color: "bg-orange-200",
  },
  {
    id: 2,
    title: "Arabic 301",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 200,
    color: "bg-violet-200",
  },
  {
    id: 3,
    title: "Arabic Verbs",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 90,
    color: "bg-green-200",
  },
  {
    id: 4,
    title: "Long Phrases",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 900,
    color: "bg-blue-200",
  },
];

const lessons = [
  {
    id: 0,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 1,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 2,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 3,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 4,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 5,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 6,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 7,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 8,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
  {
    id: 9,
    title: "Introduction",
    duration: "5:00",
    course_id: 0,
  },
];
export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json(courses.find((course, idx) => course.id === Number(params.id)));
};

const CoursePage = () => {
  let course = useLoaderData<typeof loader>();

  const getBg = (lesson: any) => {
    if (lesson.id == 0) {
      return getCourseBgFull(course.id);
    }
    return "bg-gray-200";
  };

  const getMarginLeft = (index: number) => {
    const mls = ["ml-0 rtl:mr-0", "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]", "ml-[-4rem] rtl:ml-0 rtl:mr-[-4rem]", "ml-[-2rem] rtl:ml-0 rtl:mr-[-2rem]", "ml-0 rtl:mr-0", "ml-[2rem] rtl:ml-0 rtl:mr-[2rem]", "ml-[4rem] rtl:ml-0 rtl:mr-[4rem]"];
    return mls[index  % 6];
  };

  return (
    <section className="flex flex-col items-center">
      <div
        className={`w-2/3 rounded-lg p-2 text-white ${getCourseBgFull(
          course.id
        )}`}
      >
        <div className=" flex items-center">
          <i className="text-xl ri-arrow-left-line"></i>
          {course.title}
        </div>
        <div>{course.description}</div>
      </div>
      <div className="path lessons flex flex-col gap-8 justify-between pt-8 pb-4">
        {lessons.map((lesson, idx) => (
          <Link
              to={`/lessons/${lesson.id}`}
            key={lesson.id}
            className={`flex items-center justify-center shadow-lg shadow-slate-400 rounded-full w-16 h-16 ${getBg(
              lesson
            )} ${getMarginLeft(idx)}`}
          >
            <i className="text-4xl text-white ri-star-fill cursor-pointer"></i>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CoursePage;
