

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import Image from "next/image";
import Button from "@/components/common/Button";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUnverifiedModal, setShowUnverifiedModal] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.push("/");
    });
  }, [router]);

  // Password strength calculator
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password))
        strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  const validatePasswords = () => {
    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    }
    if (mode === "signup" && password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // Check if email is already registered with Google OAuth
  const checkExistingGoogleUser = async (email) => {
    try {
      // Try to sign in with a temporary password to check if user exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: "temp_check_12345", // This will fail but tells us if user exists
      });

      // If error message indicates invalid credentials but user exists with OAuth
      if (error && error.message.includes("Invalid login credentials")) {
        // Check if this might be a Google user by attempting password recovery
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: window.location.origin,
          }
        );

        // If reset fails with "User not found", then user doesn't exist
        // If it succeeds or fails with different error, user might exist with OAuth
        return resetError && !resetError.message.includes("User not found");
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  async function handleAuth(e) {
    if (e) e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        // First check if user exists with Google OAuth
        const isGoogleUser = await checkExistingGoogleUser(email);
        if (isGoogleUser) {
          setMessage(
            "This email is already registered with Google. Please sign in with Google or use a different email."
          );
          setLoading(false);
          return;
        }

        // Regular signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            setMessage(
              "This email is already registered. Please sign in instead or use a different email."
            );
          } else {
            setMessage(error.message);
          }
        } else if (data?.user) {
          setMessage(
            "Account created successfully! Please check your email to verify your account."
          );
          setShowUnverifiedModal(true);
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setMessage(error.message);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  }

  // Remove OTP-related functions
  // async function handleOtpVerification() { ... }
  // async function handleResendOtp() { ... }

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage("Google sign-in failed. Please try again.");
    }

    setLoading(false);
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  // Remove OTP step completely - only show auth form and modal
  return (
    <>
      {/* Unverified Account Modal */}
      {showUnverifiedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-primary-white rounded-xl border border-slate-700 p-8 max-w-md w-full">
            <div className="text-center">
              {/* Warning Icon */}
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-dark-blue mb-3">
                Account Not Verified
              </h3>
              <p className="text-slate-500 mb-6">
                Your account has been created but is not yet verified. Please
                check your email and click the verification link to activate
                your account.
              </p>

              {/* <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowUnverifiedModal(false);
                    setMode("login");
                    setMessage("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Go to Sign In
                </Button>

                <Button
                  variant="glass"
                  onClick={() => setShowUnverifiedModal(false)}
                  className="w-full py-3 text-slate-400 hover:text-white transition-colors duration-200 border border-slate-600 rounded-lg hover:border-slate-500"
                >
                  Close
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-primary-white  flex">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <div className=" w-32 mx-auto">
              <Image src={"/images/logo/logo-transparent-2.png"} alt="Logo Image" width={100} height={100} className="w-full h-full"/>
              </div>
              {/* <h1 className="text-4xl font-bold text-white mb-4">
                {mode === "signup" ? "Create Account" : "Welcome Back"}
              </h1> */}
              <p className="text-slate-600 my-3 text-lg">
                {mode === "signup"
                  ? "Sign up to get started with your account"
                  : "Sign in to your account to continue"}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuth} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-300 border border-slate-600 rounded-lg text-dark-blue placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-dark-blue mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-300 border border-slate-600 rounded-lg text-dark-blue placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {mode === "signup" && password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-primary">
                        Password Strength
                      </span>
                      <span className="text-xs text-primary">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-dark-blue mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-300 border border-slate-600 rounded-lg text-dark-blue placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div className="mt-2 flex items-center">
                      {password === confirmPassword ? (
                        <div className="flex items-center text-green-400">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">Passwords match</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm">Passwords don't match</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    {mode === "signup"
                      ? "Creating Account..."
                      : "Signing In..."}
                  </div>
                ) : mode === "signup" ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-lg text-center ${
                  message.includes("check your email") ||
                  message.includes("created successfully")
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : message.includes("successfully")
                    ? "bg-green-900/50 text-green-300 border border-green-700"
                    : message.includes("already registered")
                    ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                    : "bg-red-900/50 text-red-300 border border-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="px-4 text-slate-400 text-sm font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Google Login */}
            <Button
              variant="glass"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
            >
              <div className="w-5 h-5 mr-3 bg-white rounded p-0.5">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              Continue with Google
            </Button>

            {/* Mode Toggle */}
            <div className="mt-8 flex items-center justify-center text-xs md:text-base gap-4 text-center">
              <p className="text-slate-400">
                {mode === "signup"
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "login" : "signup");
                  setMessage("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-primary hover:text-dark-blue font-semibold transition-colors duration-200 underline"
              >
                {mode === "signup" ? "Sign In Instead" : "Create New Account"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-12 bg-dark-blue border-l border-slate-700">
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <div className=" w-96 mx-auto my-8">
              <Image src={"/images/logo/logo-black-full-svg.svg"} alt="Logo Image" width={100} height={100} className="w-full h-full"/>
              </div>
              <h2 className="text-4xl !font-primary text-white mb-6">
                {mode === "signup" ? "Join Our Platform" : "Welcome Back"}
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                {mode === "signup"
                  ? "Create your account and start your journey with us today."
                  : "Sign in to access your account and continue where you left off."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
