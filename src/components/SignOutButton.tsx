"use client";

export default function SignOutButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const handleSignOut = async () => {
    const baseUrl = window.location.origin;
    await fetch(`${baseUrl}/api/auth/signout`, {
      method: "POST",
      body: new URLSearchParams({ callbackUrl: baseUrl }),
    });
    window.location.href = "/";
  };

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      {children}
    </button>
  );
}
