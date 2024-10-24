export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy for Lift Log</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>Welcome to Lift Log. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Lift Log application.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <h3 className="text-lg font-medium mt-2">2.1 Personal Information:</h3>
        <ul className="list-disc list-inside ml-4">
          <li>Email address</li>
          <li>Full name</li>
          <li>Authentication data</li>
        </ul>
        <h3 className="text-lg font-medium mt-2">2.2 Workout Data:</h3>
        <ul className="list-disc list-inside ml-4">
          <li>Workout dates</li>
          <li>Muscle groups exercised</li>
          <li>Exercise details (name, sets, reps, weights)</li>
          <li>Feelings associated with workouts</li>
          <li>Workout images (if uploaded)</li>
        </ul>
        <h3 className="text-lg font-medium mt-2">2.3 Usage Data:</h3>
        <ul className="list-disc list-inside ml-4">
          <li>App interaction data</li>
          <li>Performance data</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p>We use your personal information for:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Account creation and management</li>
          <li>Providing and improving our services</li>
          <li>Communicating with you</li>
          <li>Analyzing usage patterns</li>
        </ul>
        <p className="mt-2">We use your workout data to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Track your fitness progress</li>
          <li>Provide personalized insights and recommendations</li>
          <li>Improve our exercise database and app functionality</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Storage and Security</h2>
        <p>We use Supabase for data storage and authentication. Your data is stored securely and protected by industry-standard encryption methods. For more details on Supabase&apos;s security measures, please refer to their privacy policy.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal information. We may share your information in the following situations:</p>
        <ul className="list-disc list-inside ml-4">
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights, privacy, safety, or property</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Data Protection Rights</h2>
        <p>Under GDPR and UK data protection law, you have the right to:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Request restriction of processing your personal information</li>
          <li>Request transfer of your personal information</li>
          <li>Withdraw consent</li>
        </ul>
        <p className="mt-2">To exercise these rights, please contact us using the details provided at the end of this policy.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
        <p>We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. You can request deletion of your account and associated data at any time.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Children&apos;s Privacy</h2>
        <p>Our service is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &apos;Last updated&apos; date.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Third-Party Services</h2>
        <p>Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party services you use.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <p>tryliftlog@gmail.com</p>
      </section>
    </div>
  )
}
