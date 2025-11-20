import AuthForm from '@/components/AuthForm';

export default function SignInPage() {
  return (
    <section className="auth-page">
      <AuthForm mode="signin" redirectTo="/" />
    </section>
  );
}
