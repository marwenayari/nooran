import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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
    price: 0,
  },
  {
    title: "Arabic 201",
    description: "Learn the intermediate level of Arabic",
    level: "Intermediate",
    price: 0,
  },
  {
    title: "Arabic 301",
    description: "Learn the advanced level of Arabic",
    level: "Advanced",
    price: 0,
  },
];
export default function Index() {
  return (
    <div className="h-full w-screen p-8">
      <h1 className="font-thin text-6xl w-1/2 mb-8">
        Arabic Never Been Easier
      </h1>
      <div className="flex flex-col my-4">
        <div className="flex flex-row">
          {categories.map((category) => (
            <div
              key={category.title}
              className="mr-4 p-4 bg-dark-beige rounded-xl"
            >
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="font-thin text-3xl my-4">Recent</h2>
        <div className="flex flex-row">
          {courses.map((course) => (
            <div
              className="course-card mr-4 p-4 bg-dark-beige rounded-xl"
              key={course.title}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>{course.level}</p>
              <p>{course.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
