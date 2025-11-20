import AuthForm from '@/components/AuthForm';

export default function SignUpPage() {
  return (
    <section className="auth-page">
      <AuthForm mode="signup" redirectTo="/" />
    </section>
  );
}
