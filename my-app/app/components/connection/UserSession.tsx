"use client";
import SignIn from "./SignIn";
import SignOutButton from "./SignOutButton";
import SignUp from "./SignUp";
import { CircleUserRound } from "lucide-react";
import FormModal from "../Formulaire/FormModal";
import { UserSessionData } from "@/app/types";

export default function UserSession({ session }: { session: UserSessionData }) {
  if (!session) {
    return (
      <div className="flex gap-4">
        <SignIn />
        <SignUp />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className=" flex items-center gap-2 border border-ada-red px-3 py-1 rounded-full text-ada-red font-Oswald-medium">
        <CircleUserRound className="w-6 h-6 text-ada-red" />
        <span>{session.name}</span>
      </div>
      <FormModal />
      <SignOutButton />
    </div>
  );
}
