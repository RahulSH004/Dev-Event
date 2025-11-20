'use client';

import { useSession, signOut } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (isPending) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="auth-buttons">
        <span className="text-light-100 text-sm max-sm:hidden">
          {session.user.email}
        </span>
        <button onClick={handleSignOut} className="btn-secondary-small">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-buttons">
      <Link href="/auth/signin" className="btn-secondary-small">
        Sign In
      </Link>
    </div>
  );
}
