import React from 'react';
import { Button } from '@/components/ui/button';

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    // Redirect the entire window to the Spring Boot OAuth2 entry point
    window.location.href = "http://localhost:5454/login/google";
  };

  return (
    <div className="w-full pt-4">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-dim"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-surface px-2 text-text-muted font-medium tracking-wider">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full h-11 border-border-dim hover:bg-bg-elevated/50 text-text-primary font-bold flex items-center justify-center gap-3 transition-all"
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className="w-5 h-5"
        />
        Sign in with Google
      </Button>
    </div>
  );
};

export default SocialLogin;
