"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("1");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            departmentId: Number(departmentId),
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      onSwitchToLogin();
    } catch (err) {
      setError("Something went wrong. Cannot connect to WTMS backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
  mx-auto w-full max-w-3xl
  rounded-4xl
  bg-white
  border border-blue-200
  p-12
  shadow-[0_20px_60px_rgba(37,99,235,0.15)]
"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600 tracking-wide uppercase">
          Registration
        </h2>
        <p className="text-sm text-slate-500">
          Create an account and get started with WTMS
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-slate-600">
              First name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 bg-slate-50/50 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-slate-600">
              Last name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 bg-slate-50/50 pl-10"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-600">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-slate-50/50 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-600">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Input password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-slate-50/50 pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-600">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Input password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11 bg-slate-50/50 pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-base font-medium shadow-sm transition-all hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </Button>

        <div className="pt-2 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}



// "use client";

// import { useState } from "react";
// import { User, Mail, Lock, Eye, EyeOff, Phone, MapPin, Building2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // 1. Define the Zod Schema matching your Spring Boot DTO exactly
// const registerSchema = z
//   .object({
//     firstName: z
//       .string()
//       .min(1, "First name is required")
//       .max(120, "Cannot exceed 120 characters")
//       .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
//     lastName: z
//       .string()
//       .min(1, "Last name is required")
//       .max(120, "Cannot exceed 120 characters")
//       .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed"),
//     email: z
//       .string()
//       .min(1, "Email is required")
//       .max(150, "Cannot exceed 150 characters")
//       .regex(/^[A-Za-z0-9._%+-]+@gmail\.com$/, "Must be a valid @gmail.com address"),
//     phoneNumber: z
//       .string()
//       .min(1, "Phone number is required")
//       .regex(/^\+?[0-9]{8,15}$/, "Invalid phone format (e.g., +855...)"),
//     address: z
//       .string()
//       .min(1, "Address is required")
//       .max(255, "Cannot exceed 255 characters"),
//     departmentId: z.coerce.number().min(1, "Department ID is required"),
//     password: z
//       .string()
//       .min(1, "Password is required")
//       .regex(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//         "8+ chars, upper, lower, number, special char required"
//       ),
//     confirmPassword: z.string().min(1, "Please confirm your password"),
//   })
//   // 2. Custom validation to ensure passwords match
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"], // Attach the error to the confirmPassword field
//   });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// export function RegisterForm({
//   onSwitchToLogin,
// }: {
//   onSwitchToLogin: () => void;
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [apiError, setApiError] = useState("");

//   // 3. Initialize React Hook Form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//       address: "",
//       departmentId: 1, // Defaulting to 1 as per your original code
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // 4. Handle Form Submission
//   async function onSubmit(data: RegisterFormValues) {
//     setApiError("");

//     try {
//       const response = await fetch("http://localhost:8080/api/v1/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           phoneNumber: data.phoneNumber,
//           address: data.address,
//           departmentId: data.departmentId,
//           password: data.password,
//         }),
//       });

//       const result = await response.json();

//       if (!result.success && !response.ok) {
//         setApiError(result.message || "Registration failed. Email might already exist.");
//         return;
//       }

//       // Success! Switch back to login view
//       onSwitchToLogin();
//     } catch (err) {
//       setApiError("Something went wrong. Cannot connect to WTMS backend.");
//     }
//   }

//   return (
//     <div className="mx-auto w-full max-w-3xl rounded-4xl bg-white border border-blue-200 p-10 sm:p-12 shadow-[0_20px_60px_rgba(37,99,235,0.15)]">
//       <div className="mb-8 text-center">
//         <h2 className="text-3xl font-bold text-blue-600 tracking-wide uppercase">
//           Registration
//         </h2>
//         <p className="text-sm text-slate-500">
//           Create an account and get started with WTMS
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
//         {/* API Error Alert */}
//         {apiError && (
//           <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
//             {apiError}
//           </div>
//         )}

//         {/* FIRST & LAST NAME */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="firstName" className="text-slate-600">First name</Label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="firstName"
//                 placeholder="First name"
//                 {...register("firstName")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.firstName ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="lastName" className="text-slate-600">Last name</Label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="lastName"
//                 placeholder="Last name"
//                 {...register("lastName")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.lastName ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
//           </div>
//         </div>

//         {/* EMAIL & PHONE */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="email" className="text-slate-600">Email</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Example@gmail.com"
//                 {...register("email")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.email ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phoneNumber" className="text-slate-600">Phone Number</Label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="phoneNumber"
//                 placeholder="+855 12 345 678"
//                 {...register("phoneNumber")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.phoneNumber ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
//           </div>
//         </div>

//         {/* ADDRESS & DEPARTMENT */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="address" className="text-slate-600">Address</Label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="address"
//                 placeholder="Phnom Penh, Cambodia"
//                 {...register("address")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.address ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="departmentId" className="text-slate-600">Department ID</Label>
//             <div className="relative">
//               <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="departmentId"
//                 type="number"
//                 placeholder="1"
//                 {...register("departmentId")}
//                 className={`h-11 bg-slate-50/50 pl-10 ${errors.departmentId ? "border-red-500" : ""}`}
//               />
//             </div>
//             {errors.departmentId && <p className="text-xs text-red-500">{errors.departmentId.message}</p>}
//           </div>
//         </div>

//         {/* PASSWORDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="password" className="text-slate-600">Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 {...register("password")}
//                 className={`h-11 bg-slate-50/50 pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//               >
//                 {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//               </button>
//             </div>
//             {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword" className="text-slate-600">Confirm Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
//               <Input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm password"
//                 {...register("confirmPassword")}
//                 className={`h-11 bg-slate-50/50 pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//               >
//                 {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//               </button>
//             </div>
//             {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
//           </div>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <Button
//           type="submit"
//           disabled={isSubmitting}
//           className="mt-4 h-12 w-full rounded-xl bg-blue-600 text-base font-medium shadow-sm transition-all hover:bg-blue-700"
//         >
//           {isSubmitting ? (
//             <span className="flex items-center justify-center gap-2">
//               <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//               Registering...
//             </span>
//           ) : (
//             "Register"
//           )}
//         </Button>

//         <div className="pt-2 text-center text-sm text-slate-500">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={onSwitchToLogin}
//             className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
//           >
//             Log in
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }