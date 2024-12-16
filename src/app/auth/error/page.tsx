export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-center mb-4">
        There was a problem confirming your account. Please try again or contact support if the problem persists.
      </p>
      <a 
        href="/signup" 
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Return to Sign Up
      </a>
    </div>
  );
} 