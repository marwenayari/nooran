import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const courses = [
  {
    title: "Arabic 101",
    description: "Learn the basics of Arabic",
    level: "Beginner",
    rate: 4.6,
    price: 0,
    color: "bg-red-200",
  },
  {
    title: "Arabic 201",
    description: "Learn the intermediate level of Arabic",
    level: "Intermediate",
    rate: 4.8,
    price: 0,
    color: "bg-orange-200",
  },
  {
    title: "Arabic 301",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 200,
    color: "bg-violet-200",
  },
  {
    title: "Arabic Verbs",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 90,
    color: "bg-green-200",
  },
  {
    title: "Long Phrases",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 900,
    color: "bg-blue-200",
  },
];
export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json(courses.find((course, idx) => idx === Number(params.id)));
};

const CoursePage = () => {
  let course = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex flex-row w-1/2 justify-between">
        <h1 className="text-2xl">{course.title}</h1>
        <span className="bg-white rounded-xl w-10 text-center">
          {course.rate}
        </span>
      </div>
      <p>{course.description}</p>
    </div>
  );
};

export default CoursePage;
