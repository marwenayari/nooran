import { FC } from "react";
const Auth: FC = () => {
 
  return (
    <main className="">
       <div className="">
        <div className="login-box bg-white dark:bg-slate-600 dark:text-white p-8 rounded-2xl shadow-lg w-80 text-center">
            <div className="text-center  flex justify-center">
                <img className="w-12 h-12" src="/logo.png" alt="" />
            </div>
            <h2 className="text-2xl mb-3 dark:text-white">Sign in with email</h2>
            <span className="mb-6 dark:text-white">Make a new doc to bring your words, data, and teams together. For free</span>
            <div>
                <input className="my-1" type="email" placeholder="Email" required></input>
                <input type="password" placeholder="Password" required></input>
                <div className="mb-5 text-right">
                    <span className=" dark:text-white" >Forgot password?</span>
                </div>
                <button className="p-2 bg-slate-600 text-white rounded-md" type="submit">Get Started</button>
            </div>
            <div className="flex flex-col items-center justify-center h-16">
                <span className="mb-2">Or sign in with</span>
                <div className="flex justify-between w-1/2 ">
                <i className="ri-google-fill cursor-pointer  hover:bg-slate-200 p-1 rounded-sm"></i>
                <i className="ri-apple-fill cursor-pointer  hover:bg-slate-200 p-1 rounded-sm"></i>
                <i className="ri-twitter-x-fill cursor-pointer hover:bg-slate-200 p-1 rounded-sm"></i>
                    
                </div>
            </div>
        </div>
    </div>
    
    </main> 

  );
};

export default Auth;
