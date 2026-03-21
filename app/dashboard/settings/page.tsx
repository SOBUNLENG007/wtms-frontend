"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Pencil,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, restoreSession } = useAuth();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    restoreSession();
    setHydrated(true);
  }, [restoreSession]);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  const splitName = useMemo(() => {
    if (!user?.name) return { firstName: "", lastName: "" };

    const parts = user.name.trim().split(" ");
    return {
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
    };
  }, [user]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFirstName(splitName.firstName);
    setLastName(splitName.lastName);
    setEmail(user.email ?? "");
    setAddress(user.department ?? "");
    setPhone("");
  }, [user, splitName]);

  const handleSaveProfile = () => {
    const payload = {
      firstName,
      lastName,
      email,
      birthDate,
      gender,
      address,
      phoneNumber: phone,
    };

    console.log("Save profile payload:", payload);
  };

  const handleChangePassword = () => {
    const payload = {
      currentPassword,
      newPassword,
    };

    console.log("Change password payload:", payload);
  };

  if (!hydrated) return null;
  if (!user) return null;

  return (
    <div className="w-full animate-in fade-in pb-10 duration-500">
      <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
        <span className="text-slate-400">Setting</span> {">"}{" "}
        <span className="text-slate-700">User</span>
      </div>

      <div className="mb-10 flex items-center gap-5">
        <div className="relative">
          <div className="size-20 overflow-hidden rounded-full border border-slate-100 bg-[#FFE4E6] flex items-center justify-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf"
              alt="Profile Avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-[#1f6fff] p-1.5 text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>

        <div>
          <h1 className="text-[22px] font-bold text-[#1f6fff]">Profile</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Manage your Profile setting
          </p>
          <p className="mt-1 text-[13px] font-medium text-slate-700">
            {user.name}
          </p>
          <p className="mt-1 text-[12px] text-slate-500 capitalize">
            {user.role}
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="mb-5">
            <h2 className="text-[18px] font-bold text-[#1f6fff]">
              Basic information
            </h2>
            <p className="mt-0.5 text-[13px] text-slate-500">
              Tell us your Basic info details
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081743267"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Birth
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Gender
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11.5 appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 text-[14px] text-slate-700 outline-none transition-all focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[13px] font-medium text-slate-700">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-[18px] font-bold text-[#1f6fff]">Password</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">
              Modify your current password
            </p>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showCurrent ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full h-11.5 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-[14px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f6fff] focus:ring-2 focus:ring-[#1f6fff]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showNew ? (
                    <EyeOff className="size-4.5" />
                  ) : (
                    <Eye className="size-4.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleChangePassword}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            Change Password
          </button>
        </section>

        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-[14px] font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveProfile}
            className="rounded-xl bg-[#1f6fff] px-8 py-2.5 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}