"use client";
import { useState, useEffect } from "react";
import {
  LogIn,
  Building2,
  UserCog,
  User,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Hash,
  KeyRound,
  Crown,
  Gem,
  Stars,
  Fingerprint,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth, UserRoleType } from "@/providers/AuthProvider";
import { UserRole } from "@/lib/api";

export default function LoginPage() {
  const { login, verifyOtp, isAuthenticated, isLoading } = useAuth();
  const [userId, setUserId] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [detectedRole, setDetectedRole] = useState<UserRole>(null);
  const [biometricAvailable] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    userId?: string;
    phone?: string;
    password?: string;
  }>({});

  // Detect if current user input suggests Super Admin
  const isSuperAdminPreview = userId.toUpperCase().startsWith("SA");
  const isOfficeUserPreview =
    userId.toUpperCase().startsWith("OU") ||
    userId.toUpperCase().startsWith("CO");
  const isClientPreview = userId.toUpperCase().startsWith("CL");

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  // Real-time validation
  useEffect(() => {
    const errors: typeof validationErrors = {};

    if (userId && userId.length > 0) {
      const userIdPattern = /^(SA|CO|CL|OU)[-]?\d{4}[-]?\d{0,4}$/i;
      if (!userIdPattern.test(userId) && userId.length > 3) {
        errors.userId = "Format: SA-2026-001, CO-2026-001, or CL-2026-001";
      }
    }

    if (telephone && telephone.length > 0) {
      const phonePattern = /^\+254\d{9}$/;
      if (!phonePattern.test(telephone)) {
        errors.phone = "Format: +254XXXXXXXXX";
      }
    }

    setValidationErrors(errors);
  }, [userId, telephone]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // const handleBiometricLogin = () => {
  //   toast.success("Biometric authentication successful!");
  //   setTimeout(() => {
  //     onLogin("super-admin", "Sarah Anderson");
  //   }, 1000);
  // };
  const getRoleTypeFromUserId = (id: string): UserRoleType => {
    const upperCode = id.toUpperCase();
    if (upperCode.startsWith("SA")) return "super-admin";
    if (upperCode.startsWith("CO") || upperCode.startsWith("OU"))
      return "office-user";
    if (upperCode.startsWith("CL")) return "client";
    return "client";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ALL users need code, phone, and password
    if (!userId || !telephone || !password) {
      toast.error(
        "Please fill in all fields (User ID, Phone Number, and Password)"
      );
      return;
    }

    const roleType = getRoleTypeFromUserId(userId);

    setIsSubmitting(true);
    const loadingToast = toast.loading("Verifying credentials...");

    try {
      // Use unified login - password required for ALL users
      const result = await login(userId, telephone, password);
      toast.dismiss(loadingToast);

      if (result.success) {
        if (result.requiresOtp) {
          // SA/OU need OTP verification
          setDetectedRole(roleType);
          setOtpStep(true);
          toast.success("OTP sent to your WhatsApp!");
        } else {
          // Client login successful
          toast.success("Welcome back!");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Verifying OTP...");

    try {
      // Pass user code, phone, and OTP code
      const result = await verifyOtp(userId, telephone, otpCode);
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Welcome back!");
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    // Resend OTP by calling login again with password
    const result = await login(userId, telephone, password);

    if (result.success && result.requiresOtp) {
      toast.success("OTP resent to your WhatsApp!");
      setOtp(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("otp-0");
      firstInput?.focus();
    } else {
      toast.error(result.message);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Premium Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Animated Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1616611213095-58abb651f70c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYW5raW5nJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NzkzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Premium Animated Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-full blur-3xl opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 60, 0],
              y: [0, 40, 0],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-30"
            animate={{
              scale: [1, 1.4, 1],
              x: [0, -60, 0],
              y: [0, -40, 0],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <motion.div
                className="w-14 h-14 bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 backdrop-blur-sm" />
                <div className="w-8 h-8 bg-gradient-to-br from-violet-300 to-indigo-300 relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-400 opacity-0"
                  whileHover={{ opacity: 0.3 }}
                />
              </motion.div>
              <span className="text-3xl font-bold tracking-tight">Sarif</span>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-6 h-6 text-violet-400" />
              </motion.div>
            </div>

            <h1 className="text-6xl font-bold leading-tight mb-6 bg-gradient-to-br from-white via-violet-100 to-purple-200 bg-clip-text text-transparent">
              Exchange & Account
              <br />
              Management Platform
            </h1>
            <p className="text-xl text-slate-300 max-w-md leading-relaxed">
              Trusted by offices worldwide for secure, fast, and reliable
              financial operations.
            </p>
          </motion.div>

          {/* Premium Features */}
          <div className="space-y-6 mb-8">
            {[
              {
                icon: Shield,
                text: "Bank-grade security & encryption",
                color: "from-violet-400 to-purple-400",
                delay: 0.3,
              },
              {
                icon: Zap,
                text: "Real-time transaction processing",
                color: "from-purple-400 to-fuchsia-400",
                delay: 0.4,
              },
              {
                icon: TrendingUp,
                text: "Advanced analytics & reporting",
                color: "from-fuchsia-400 to-pink-400",
                delay: 0.5,
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: feature.delay }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-center gap-4 cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 bg-white/5 border-2 border-white/10 flex items-center justify-center backdrop-blur-sm relative overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  />
                  <feature.icon className="w-7 h-7 text-violet-300 relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-slate-200 text-lg group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            className="text-slate-500 text-sm flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-1 h-1 rounded-full bg-violet-500" />
            <span>© 2026 Sarif. All rights reserved.</span>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Ultra Premium Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 relative overflow-hidden">
        {/* Subtle animated background */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <motion.div
            className="lg:hidden mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl">
                <div className="w-7 h-7 bg-white/90" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Sarif
              </span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!otpStep ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Premium Card with Glass Morphism */}
                <div className="bg-white/80 backdrop-blur-2xl shadow-2xl border-2 border-slate-200/50 p-10 relative overflow-hidden">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 ${
                      isSuperAdminPreview
                        ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500"
                        : isOfficeUserPreview
                        ? "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
                        : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                    }}
                  />

                  {/* Role Badge */}
                  <AnimatePresence>
                    {isSuperAdminPreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: -20 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                          <Crown className="w-4 h-4" />
                          <span>SUPER ADMIN</span>
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </motion.div>
                    )}
                    {isOfficeUserPreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: -20 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                          <Building2 className="w-4 h-4" />
                          <span>OFFICE USER</span>
                        </div>
                      </motion.div>
                    )}
                    {isClientPreview && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: -20 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg backdrop-blur-sm">
                          <User className="w-4 h-4" />
                          <span>CLIENT</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Header */}
                  <div className="text-center mb-10 relative z-10">
                    <motion.div
                      className={`w-24 h-24 flex items-center justify-center mx-auto mb-6 relative ${
                        isSuperAdminPreview
                          ? "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600"
                          : isOfficeUserPreview
                          ? "bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600"
                          : "bg-gradient-to-br from-violet-600 to-purple-600"
                      } shadow-2xl`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      {/* Animated glow */}
                      <motion.div
                        className={`absolute inset-0 ${
                          isSuperAdminPreview
                            ? "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400"
                            : isOfficeUserPreview
                            ? "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400"
                            : "bg-gradient-to-br from-violet-400 to-purple-400"
                        } blur-xl opacity-50`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                      {isSuperAdminPreview ? (
                        <Crown className="w-12 h-12 text-white relative z-10" />
                      ) : isOfficeUserPreview ? (
                        <Building2 className="w-12 h-12 text-white relative z-10" />
                      ) : (
                        <Lock className="w-12 h-12 text-white relative z-10" />
                      )}
                    </motion.div>
                    <motion.h2
                      className="text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-violet-900 to-purple-900 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isSuperAdminPreview
                        ? "Super Admin Access"
                        : isOfficeUserPreview
                        ? "Office Portal"
                        : "Secure Login"}
                    </motion.h2>
                    <motion.p
                      className="text-slate-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {isSuperAdminPreview
                        ? "Premium platform management portal"
                        : isOfficeUserPreview
                        ? "Transaction & client management"
                        : "Enter your credentials to access your account"}
                    </motion.p>
                  </div>

                  {/* Biometric Login Option */}
                  {/* <AnimatePresence>
                    {isSuperAdminPreview && biometricAvailable && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6"
                      >
                        <motion.button
                          type="button"
                          onClick={handleBiometricLogin}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-4 bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300 text-violet-900 font-bold flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                          <motion.div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Fingerprint className="w-6 h-6 relative z-10" />
                          <span className="relative z-10">
                            Quick Login with Biometric
                          </span>
                          <Sparkles className="w-4 h-4 relative z-10" />
                        </motion.button>

                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-slate-200" />
                          <span className="text-xs text-slate-500 font-semibold">
                            OR USE CREDENTIALS
                          </span>
                          <div className="flex-1 h-px bg-slate-200" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence> */}

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    {/* User ID Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-violet-600" />
                        User ID
                        {isSuperAdminPreview && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-xs px-2 py-1 bg-violet-100 text-violet-700 font-bold"
                          >
                            ADMIN
                          </motion.span>
                        )}
                      </label>
                      <div className="relative group">
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          value={userId}
                          onChange={(e) =>
                            setUserId(e.target.value.toUpperCase())
                          }
                          className={`w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 transition-all duration-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white font-mono text-lg ${
                            validationErrors.userId
                              ? "border-red-300 focus:border-red-500"
                              : isSuperAdminPreview
                              ? "border-violet-300 focus:border-violet-600 focus:shadow-lg focus:shadow-violet-200/50"
                              : isOfficeUserPreview
                              ? "border-blue-300 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-200/50"
                              : "border-slate-200 focus:border-violet-500 focus:shadow-lg focus:shadow-violet-100/50"
                          }`}
                          placeholder="CO-2026-001"
                          required
                          disabled={isLoading}
                        />
                        {/* Real-time validation icon */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {userId && !validationErrors.userId && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </motion.div>
                          )}
                          {validationErrors.userId && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <XCircle className="w-5 h-5 text-red-500" />
                            </motion.div>
                          )}
                          {isSuperAdminPreview && !validationErrors.userId && (
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                              }}
                            >
                              <Gem className="w-5 h-5 text-violet-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      {validationErrors.userId && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.userId}
                        </motion.p>
                      )}
                      {!validationErrors.userId && (
                        <p
                          className={`text-xs mt-2 font-medium ${
                            isSuperAdminPreview
                              ? "text-violet-600"
                              : isOfficeUserPreview
                              ? "text-blue-600"
                              : "text-slate-500"
                          }`}
                        >
                          {isSuperAdminPreview
                            ? "✨ Super Admin detected - Enhanced security enabled"
                            : isOfficeUserPreview
                            ? "🏢 Office User - Standard OTP verification"
                            : isClientPreview
                            ? "👤 Client - Direct access (No OTP required)"
                            : "Examples: SA001 (Super Admin), OU001 (Office), CL001 (Client)"}
                        </p>
                      )}
                    </motion.div>

                    {/* Telephone Field */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-violet-600" />
                        Telephone Number
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="tel"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          className={`w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 transition-all duration-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white ${
                            validationErrors.phone
                              ? "border-red-300 focus:border-red-500"
                              : isSuperAdminPreview
                              ? "border-violet-300 focus:border-violet-600 focus:shadow-lg focus:shadow-violet-200/50"
                              : isOfficeUserPreview
                              ? "border-blue-300 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-200/50"
                              : "border-slate-200 focus:border-violet-500 focus:shadow-lg focus:shadow-violet-100/50"
                          }`}
                          placeholder="+254712345678"
                          required
                          disabled={isLoading}
                        />
                        {telephone && !validationErrors.phone && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </motion.div>
                        )}
                        {validationErrors.phone && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <XCircle className="w-5 h-5 text-red-500" />
                          </motion.div>
                        )}
                      </div>
                      {validationErrors.phone && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.phone}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Password Field with Strength Meter */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-violet-600" />
                        Password
                        {password && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`ml-auto text-xs px-2 py-1 font-bold ${
                              passwordStrength < 40
                                ? "bg-red-100 text-red-700"
                                : passwordStrength < 70
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {getPasswordStrengthText()}
                          </motion.span>
                        )}
                      </label>
                      <div className="relative">
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-5 py-4 bg-white/50 backdrop-blur-sm border-2 transition-all duration-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white pr-14 ${
                            isSuperAdminPreview
                              ? "border-violet-300 focus:border-violet-600 focus:shadow-lg focus:shadow-violet-200/50"
                              : isOfficeUserPreview
                              ? "border-blue-300 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-200/50"
                              : "border-slate-200 focus:border-violet-500 focus:shadow-lg focus:shadow-violet-100/50"
                          }`}
                          placeholder="Enter your password"
                          required
                          disabled={isLoading}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-violet-100 rounded-lg transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-slate-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-slate-600" />
                          )}
                        </motion.button>
                      </div>

                      {/* Password Strength Meter */}
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3"
                        >
                          <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  i < passwordStrength / 25
                                    ? getPasswordStrengthColor()
                                    : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 mt-2 font-medium">
                            {passwordStrength < 40 &&
                              "Add uppercase, numbers and special characters"}
                            {passwordStrength >= 40 &&
                              passwordStrength < 70 &&
                              "Good! Add more characters for better security"}
                            {passwordStrength >= 70 &&
                              "✓ Excellent password strength"}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Premium Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !!validationErrors.userId ||
                        !!validationErrors.phone
                      }
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{
                        scale: isSubmitting ? 1 : 1.02,
                        y: isSubmitting ? 0 : -2,
                      }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full py-5 font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 group shadow-2xl relative overflow-hidden ${
                        isSuperAdminPreview
                          ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"
                          : isOfficeUserPreview
                          ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"
                          : "bg-gradient-to-r from-violet-600 to-purple-600"
                      } ${
                        isSubmitting ||
                        validationErrors.userId ||
                        validationErrors.phone
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-violet-500/50"
                      }`}
                    >
                      {/* Animated shine effect */}
                      {!isSubmitting &&
                        !validationErrors.userId &&
                        !validationErrors.phone && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                          />
                        )}

                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                          />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          {isSuperAdminPreview ? (
                            <Crown className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          ) : isOfficeUserPreview ? (
                            <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          ) : (
                            <Lock className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          )}
                          <span>Sign In Securely</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Last Login Info */}
                  {/* <AnimatePresence>
                    {userId &&
                      users[userId as keyof typeof users] &&
                      !validationErrors.userId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`mt-6 p-4 backdrop-blur-sm border-2 ${
                            isSuperAdminPreview
                              ? "bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200/50"
                              : isOfficeUserPreview
                              ? "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border-blue-200/50"
                              : "bg-gradient-to-br from-slate-50/80 to-slate-100/80 border-slate-200/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock
                              className={`w-4 h-4 ${
                                isSuperAdminPreview
                                  ? "text-violet-600"
                                  : isOfficeUserPreview
                                  ? "text-blue-600"
                                  : "text-slate-600"
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-700">
                              Last Login Activity
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600">
                              <span className="font-semibold">Time:</span>{" "}
                              {users[userId as keyof typeof users].lastLogin}
                            </p>
                            <p className="text-xs text-slate-600">
                              <span className="font-semibold">Device:</span>{" "}
                              {users[userId as keyof typeof users].device}
                            </p>
                            <p className="text-xs text-slate-600">
                              <span className="font-semibold">
                                Total Logins:
                              </span>{" "}
                              {users[
                                userId as keyof typeof users
                              ].loginCount.toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      )}
                  </AnimatePresence> */}

                  {/* Premium Security Notice */}
                  <motion.div
                    className={`mt-6 p-5 backdrop-blur-sm border-2 relative overflow-hidden ${
                      isSuperAdminPreview
                        ? "bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200/50"
                        : isOfficeUserPreview
                        ? "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border-blue-200/50"
                        : "bg-slate-50/80 border-slate-200/50"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-start gap-4 relative z-10">
                      <div
                        className={`p-2 rounded-lg ${
                          isSuperAdminPreview
                            ? "bg-violet-100"
                            : isOfficeUserPreview
                            ? "bg-blue-100"
                            : "bg-slate-200"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 flex-shrink-0 ${
                            isSuperAdminPreview
                              ? "text-violet-600"
                              : isOfficeUserPreview
                              ? "text-blue-600"
                              : "text-slate-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 leading-relaxed mb-2 font-medium">
                          Your connection is secure and encrypted end-to-end. We
                          never store your password in plain text.
                        </p>
                        <p
                          className={`text-sm font-bold flex items-center gap-2 ${
                            isSuperAdminPreview
                              ? "text-violet-700"
                              : isOfficeUserPreview
                              ? "text-blue-700"
                              : "text-violet-600"
                          }`}
                        >
                          <Fingerprint className="w-4 h-4" />
                          {isSuperAdminPreview
                            ? "Enhanced Super Admin Security: Biometric + OTP verification"
                            : isOfficeUserPreview
                            ? "Office Security: SMS OTP verification required"
                            : isClientPreview
                            ? "Client Access: Direct login (No OTP required)"
                            : "Super Admin & Office Users: OTP verification required"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={() => {
                    setOtpStep(false);
                    setOtp(["", "", "", "", "", ""]);
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900 mb-8 flex items-center gap-2 group font-semibold"
                  whileHover={{ x: -5 }}
                >
                  <ArrowRight className="w-4 h-4 rotate-180 transition-transform" />
                  Back to login
                </motion.button>

                {/* Premium OTP Card */}
                <div className="bg-white/80 backdrop-blur-2xl shadow-2xl border-2 border-slate-200/50 p-10 relative overflow-hidden">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 ${
                      detectedRole === "super-admin"
                        ? "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500"
                        : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
                    }`}
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 0],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                    }}
                  />

                  {/* Role Badge */}
                  {detectedRole === "super-admin" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 z-20"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg">
                        <Crown className="w-4 h-4" />
                        <span>SUPER ADMIN</span>
                        <Stars className="w-3 h-3" />
                      </div>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-10 relative z-10">
                    <motion.div
                      className={`w-24 h-24 flex items-center justify-center mx-auto mb-6 relative ${
                        detectedRole === "super-admin"
                          ? "bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600"
                          : "bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600"
                      } shadow-2xl`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      {/* Animated glow */}
                      <motion.div
                        className={`absolute inset-0 ${
                          detectedRole === "super-admin"
                            ? "bg-gradient-to-br from-violet-400 via-purple-400 to-fuchsia-400"
                            : "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400"
                        } blur-xl opacity-50`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0.9, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}
                      />
                      <KeyRound className="w-12 h-12 text-white relative z-10" />
                    </motion.div>
                    <h2
                      className={`text-3xl font-bold mb-2 ${
                        detectedRole === "super-admin"
                          ? "bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 bg-clip-text text-transparent"
                          : "text-slate-900"
                      }`}
                    >
                      {detectedRole === "super-admin"
                        ? "Super Admin OTP"
                        : "Enter OTP"}
                    </h2>
                    <p className="text-slate-600 mb-3">
                      We've sent a 6-digit code to your phone
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 ${
                        detectedRole === "super-admin"
                          ? "bg-violet-100 text-violet-700"
                          : "bg-blue-100 text-blue-700"
                      } font-mono font-bold`}
                    >
                      <Phone className="w-4 h-4" />
                      {telephone}
                    </div>
                  </div>

                  {/* OTP Form */}
                  <form
                    onSubmit={handleOtpSubmit}
                    className="space-y-8 relative z-10"
                  >
                    <div>
                      <div className="flex gap-3 justify-center">
                        {otp.map((digit, index) => (
                          <motion.input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(
                                index,
                                e.target.value.replace(/\D/g, "")
                              )
                            }
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className={`w-14 h-16 text-center text-3xl font-bold bg-white/50 backdrop-blur-sm border-2 transition-all duration-300 ${
                              detectedRole === "super-admin"
                                ? "border-violet-300 focus:border-violet-600 focus:shadow-lg focus:shadow-violet-200/50 text-violet-900"
                                : "border-blue-300 focus:border-blue-600 focus:shadow-lg focus:shadow-blue-200/50 text-blue-900"
                            } focus:outline-none focus:bg-white focus:scale-110`}
                            required
                            disabled={isLoading}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: index * 0.08, type: "spring" }}
                            whileFocus={{ scale: 1.15 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Premium Verify Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{
                        scale: isLoading ? 1 : 1.02,
                        y: isLoading ? 0 : -2,
                      }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className={`w-full py-5 font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 group shadow-2xl relative overflow-hidden ${
                        detectedRole === "super-admin"
                          ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:shadow-violet-500/50"
                          : "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:shadow-blue-500/50"
                      } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {/* Animated shine effect */}
                      {!isLoading && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      )}

                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                          />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <CheckCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          <span>Verify & Sign In</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    {/* Resend OTP */}
                    <div className="text-center">
                      <motion.button
                        type="button"
                        onClick={resendOtp}
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-sm font-bold transition-colors disabled:opacity-50 ${
                          detectedRole === "super-admin"
                            ? "text-violet-600 hover:text-violet-700"
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        Didn't receive code?{" "}
                        <span className="underline">Resend OTP</span>
                      </motion.button>
                    </div>
                  </form>

                  {/* Info Notice */}
                  <motion.div
                    className={`mt-8 p-5 backdrop-blur-sm border-2 ${
                      detectedRole === "super-admin"
                        ? "bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200/50"
                        : "bg-gradient-to-br from-blue-50/80 to-cyan-50/80 border-blue-200/50"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          detectedRole === "super-admin"
                            ? "bg-violet-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 flex-shrink-0 ${
                            detectedRole === "super-admin"
                              ? "text-violet-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium mb-2">
                          For demo purposes, enter any 6-digit code. In
                          production, you'll receive a real OTP via SMS with
                          5-minute expiry.
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          OTP expires in 5:00 minutes • Max 3 attempts
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
