import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Nooran" },
    { name: "description", content: "Welcome to Nooran!" },
  ];
};
const categories = [
  {
    title: "All",
    key: 0,
  },
  {
    title: "Letters",
    key: 1,
  },
  {
    title: "Words",
    key: 2,
  },
  {
    title: "Verbs",
    key: 3,
  },
  {
    title: "Phrases",
    key: 4,
  },
];
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
    title: "Arabic 401",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 90,
    color: "bg-green-200",
  },
  {
    title: "ASRAR ..",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    rate: 4.8,
    price: 900,
    color: "bg-blue-200",
  },
];
export default function Index() {
  let selected = 0;
  function selectCategory(key: number) {
    selected = key;
  }

  return (
    <div className="h-full w-screen p-8">
      <h1 className="font-thin text-6xl w-1/2 mb-8">
        Arabic Never Been Easier
      </h1>
      <div className="flex flex-col my-4">
        <div className="flex flex-row">
          {categories.map((category) => (
            <div
              onClick={() => {
                selectCategory(category.key);
              }}
              key={category.title}
              className="mr-4 p-4 bg-dark-beige rounded-xl cursor-pointer"
            >
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="font-thin text-2xl my-3">Recent</h2>
        <div className="flex flex-row flex-wrap">
          {courses.map((course) => (
            <div
              className={`flex flex-col justify-between  p-4 rounded-xl h-40 w-1/3 m-4 ${course.color}`}
              key={course.title}
            >
              <div className="flex justify-between">
                <span className="uppercase text-sm">{course.level} </span>
                <span className="bg-white rounded-xl w-10 text-center">
                  {course.rate}
                </span>
              </div>
              <div>
                <h3 className="text-lg">{course.title}</h3>
                <span>{course.description}</span>
              </div>
              <div className="flex justify-between">
                <span></span>
                <span>{course.price == 0 ? "Free" : "$" + course.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
