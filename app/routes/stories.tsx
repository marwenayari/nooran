import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Stories() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1>Where arabic stories exist!</h1>
    </div>
  );
}

const menu = [];
