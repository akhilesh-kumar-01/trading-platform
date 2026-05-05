/* eslint-disable no-unused-vars */
import "./Auth.css";
import { Button } from "@/components/ui/button";

import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordForm from "./ForgotPassword";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import SocialLogin from "./SocialLogin";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import CustomeToast from "@/components/custome/CustomeToast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const { toast } = useToast();

  const [animate, setAnimate] = useState(false);

  const handleNavigation = (path) => {
    // setAnimate(true);
    // setTimeout(() => {
    navigate(path);
    //   setAnimate(false);
    // }, 500);
    // Adjust the delay as needed to match your animation duration
    // setAnimate(false)
  };

  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

console.log("---------- ",auth.error)


  return (
    <div className={`authContainer h-screen relative overflow-hidden`}>
      {/* Dark overlay — always visible, z-index sits above the css ::before gradient */}
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/60 z-10"></div>

      <div
        className={`bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center py-10 px-8 w-[30rem] rounded-xl z-50 border shadow-2xl`}
        style={{ background: 'rgba(17, 19, 24, 0.92)', borderColor: 'rgba(30,32,40,0.8)' }}
      >
         <CustomeToast show={auth.error} message={auth.error?.error}/>
     

        <h1 className="text-5xl font-bold pb-8 text-white tracking-tight">
          <span className="text-blue-400 font-mono">ZOS</span> Trading
        </h1>
        {/* <Avatar>
          <AvatarImage src="https://cdn.pixabay.com/photo/2019/04/15/20/42/bitcoin-4130299_1280.png"/>
          <AvatarFallback>BTC</AvatarFallback>
        </Avatar> */}

        {location.pathname == "/signup" ? (
          <section
            className={`w-full login  ${animate ? "slide-down" : "slide-up"}`}
          >
            <div className="w-full px-6 space-y-5">
              <SignupForm />
              <SocialLogin />
              <div className="flex items-center justify-center text-white/70 text-sm">
                <span>Already have an account?</span>
                <Button onClick={() => handleNavigation("/signin")} variant="ghost" className="text-blue-400 hover:text-blue-300 pl-1">
                  Sign In
                </Button>
              </div>
            </div>
          </section>
        ) : location.pathname == "/forgot-password" ? (
          <section className="p-5 w-full">
            <ForgotPasswordForm />
            <div className="flex items-center justify-center mt-5 text-white/70 text-sm">
              <span>Back to login?</span>
              <Button onClick={() => navigate("/signin")} variant="ghost" className="text-blue-400 hover:text-blue-300 pl-1">
                Sign In
              </Button>
            </div>
          </section>
        ) : (
          <>
            <section className="w-full">
              <div className="w-full px-6 space-y-5">
                <LoginForm />
                <SocialLogin />
                <div className="flex items-center justify-center text-white/70 text-sm">
                  <span>Don't have an account?</span>
                  <Button onClick={() => handleNavigation("/signup")} variant="ghost" className="text-blue-400 hover:text-blue-300 pl-1">
                    Sign Up
                  </Button>
                </div>
                <Button
                  onClick={() => navigate("/forgot-password")}
                  variant="ghost"
                  className="w-full py-2 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-sm"
                >
                  Forgot Password?
                </Button>
              </div>
            </section>
          </>
        )}


      </div>
      
    

    </div>
  );
};

export default Auth;
