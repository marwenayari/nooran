import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      Welcome to Nooran!
      <br />
      Where arabic never been easier!
    </div>
  );
}

const menu = [];
