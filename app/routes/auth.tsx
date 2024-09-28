import { FC } from "react";
const Auth: FC = () => {
 
  return (
    <div className="profile-settings">
       <div className="login-container">
        <div className="login-box bg-white dark:bg-slate-600 dark:text-white p-8 rounded-2xl shadow-lg w-80 text-center">
            <div className="login-icon">
                <i className="fas fa-sign-in-alt"></i>
            </div>
            <h2 className=" dark:text-white">Sign in with email</h2>
            <p className=" dark:text-white">Make a new doc to bring your words, data, and teams together. For free</p>
            <div>
                <input type="email" placeholder="Email" required></input>
                <input type="password" placeholder="Password" required></input>
                <div className="mb-5 text-right">
                    <a className=" dark:text-white" href="#">Forgot password?</a>
                </div>
                <button type="submit">Get Started</button>
            </div>
            <div className="social-sign-in">
                <p>Or sign in with</p>
                <div className="social-buttons">
                    
                </div>
            </div>
        </div>
    </div>
    
    </div> 

  );
};

export default Auth;
