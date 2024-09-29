import { FC } from "react";
const Auth: FC = () => {
  return (
    <main className="flex items-center justify-center h-screen w-screen bg-cloud bg-cover">
      <div
        className="flex items-center justify-center h-screen w-screen
                bg-gradient-to-b from-red-300 to-red-100/10"
      >
        <div className="login-box bg-white dark:bg-slate-600 dark:text-white p-8 rounded-2xl shadow-lg w-80 text-center">
          <div className="text-center  flex justify-center">
            <img className="w-12 h-12" src="/logo.png" alt="" />
          </div>
          <h2 className="text-2xl mb-3 dark:text-white">Sign in with email</h2>
          <h3 className="mb-6 dark:text-white">
            Start learning the 380 million speakers language with the easiest
            way
          </h3>
          <div>
            <input
              className="my-1 w-full p-2 rounded-md bg-red-50/50"
              type="email"
              placeholder="Email"
              required
            ></input>
            <input
              className="my-1 w-full p-2 rounded-md bg-red-50/50"
              type="password"
              placeholder="Password"
              required
            ></input>
            <div className="mb-5 text-right">
              <h3 className="dark:text-white cursor-pointer">
                Forgot password?
              </h3>
            </div>
            <button
              className="p-2 bg-slate-600 text-white rounded-md w-full"
              type="submit"
            >
              Get Started
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-20">
            <span className="mb-2 text-slate-500">Or sign in with</span>
            <div className="flex justify-between w-1/2 ">
              <i className="ri-google-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10"></i>
              <i className="ri-apple-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10"></i>
              <i className="ri-twitter-x-fill cursor-pointer hover:bg-slate-200 p-1 rounded-md w-10"></i>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
