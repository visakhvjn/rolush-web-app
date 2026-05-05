import { signOutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-sm text-[#6b5344] underline-offset-4 hover:text-[#2c1810] hover:underline"
      >
        Sign out
      </button>
    </form>
  );
}
