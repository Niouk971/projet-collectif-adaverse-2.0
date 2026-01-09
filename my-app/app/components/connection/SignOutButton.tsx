
import { signout } from "@/app/actions/connect";

export default function SignOutButton() {

  return (
    <>
    <form action={signout}>
      <button type="submit"
        className="bg-ada-red hover:bg-ada-coral text-white font-Oswald-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      >
        SE DECONNECTER
      </button>
</form>
    </>
  );
}