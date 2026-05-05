import { signOutAction } from "@/actions/auth";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={
          className ||
          "text-sm text-[#6b5344] underline-offset-4 hover:text-[#2c1810] hover:underline"
        }
      >
        Sign out
      </button>
    </form>
  );
}
