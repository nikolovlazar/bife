export default function PrivacyPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-600">
        <strong>Effective Date:</strong> 17 October 2024
      </p>

      <p className="mb-6 text-lg">
        Welcome to Bife! Your privacy is important to us. This Privacy Policy
        outlines how we collect, use, and share your information when you use
        our services. By using Bife, available at{' '}
        <a href="https://bife.sh" className="text-blue-600 hover:underline">
          https://bife.sh
        </a>
        , you agree to the terms outlined in this policy.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        1. Information We Collect
      </h2>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Account Information</h3>
      <p className="mb-3">When you create an account on Bife, we collect:</p>
      <ul className="mb-6 list-disc pl-6">
        <li className="mb-2">
          <strong>Email Address and Password</strong>: If you choose to sign up
          with email.
        </li>
        <li className="mb-2">
          <strong>Social Login Data</strong>: If you sign in through GitHub or
          Google, we collect profile information such as your name and email, as
          permitted by those providers.
        </li>
      </ul>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Cookies</h3>
      <p className="mb-6">
        We use <strong>session cookies</strong> to manage your authentication
        and maintain your session on the site. These cookies are necessary for
        the Service to function properly. We do not use third-party cookies or
        tracking cookies.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        2. How We Use Your Information
      </h2>

      <p className="mb-3">We may use the information we collect from you to:</p>
      <ul className="mb-6 list-disc pl-6">
        <li className="mb-2">
          <strong>Provide the Service</strong>: Allow you to access and use
          Bife, including creating and managing shortened URLs.
        </li>
        <li className="mb-2">
          <strong>Authenticate Users</strong>: Verify your identity when you log
          in.
        </li>
        <li className="mb-2">
          <strong>Improve Security</strong>: Detect and prevent potential
          security threats or fraudulent activity.
        </li>
      </ul>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">3. Cookie Policy</h2>

      <p className="mb-6">
        We use cookies and similar tracking technologies to track the activity
        on our service and hold certain information. Cookies are files with
        small amount of data which may include an anonymous unique identifier.
        You can instruct your browser to refuse all cookies or to indicate when
        a cookie is being sent. However, if you do not accept cookies, you may
        not be able to use some portions of our service.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        4. Data Storage and Third-Party Service Providers
      </h2>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Supabase</h3>
      <p className="mb-6">
        We use <strong>Supabase</strong> for our backend services, including
        database storage. Your data is stored on Supabase&apos;s servers, and
        while we control the data stored, Supabase may have access to this
        information as necessary to operate their services. For details on
        Supabase&apos;s data handling practices, please visit their{' '}
        <a
          href="https://supabase.com/privacy"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <h3 className="mb-3 mt-6 text-xl font-semibold">Sentry</h3>
      <p className="mb-6">
        We use <strong>Sentry</strong> to capture performance metrics and track
        crashes. This helps us maintain and improve the Service. The data sent
        to Sentry includes your email address, which we use to identify and
        track issues specific to your account. This allows us to provide better
        support and more quickly resolve any problems you may encounter. For
        more information on Sentry&apos;s practices, please refer to their{' '}
        <a
          href="https://sentry.io/privacy/"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        5. International Data Transfers
      </h2>

      <p className="mb-6">
        Bife is hosted on Vercel and uses third-party services such as Supabase
        and Sentry that may process and store your data in various locations
        globally. By using our service, you consent to the transfer of your data
        to these services. We strive to ensure that any international data
        transfers comply with applicable laws, but due to the global nature of
        our services, we cannot guarantee compliance with every
        jurisdiction&apos;s data transfer regulations.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        6. Sharing Your Information
      </h2>

      <p className="mb-3">
        We do not sell or trade your information with third parties. We may
        share your information only in the following situations:
      </p>
      <ul className="mb-6 list-disc pl-6">
        <li className="mb-2">
          <strong>With Service Providers</strong>: We share data with Supabase
          for storage and with Sentry for performance monitoring and crash
          reporting.
        </li>
        <li className="mb-2">
          <strong>Legal Compliance</strong>: We may disclose your information to
          comply with applicable laws, regulations, or legal requests.
        </li>
        <li className="mb-2">
          <strong>Protection of Rights</strong>: We may share your information
          if it is necessary to enforce our Terms of Service, or to protect our
          rights, privacy, safety, or property.
        </li>
      </ul>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">7. Data Security</h2>

      <p className="mb-6">
        We implement reasonable security measures to protect your information
        from unauthorized access, loss, or misuse. While we strive to use
        commercially acceptable means to protect your data, no method of
        transmission over the Internet or electronic storage is 100% secure, and
        we cannot guarantee its absolute security.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        8. Your Privacy Choices
      </h2>

      <p className="mb-3">
        You have the following rights regarding your information:
      </p>
      <ul className="mb-6 list-disc pl-6">
        <li className="mb-2">
          <strong>Access</strong>: Request access to the personal information we
          hold about you.
        </li>
        <li className="mb-2">
          <strong>Correction</strong>: Request correction of any inaccurate or
          incomplete information.
        </li>
        <li className="mb-2">
          <strong>Deletion</strong>: Request deletion of your account and
          personal data, subject to certain legal obligations.
        </li>
      </ul>

      <p className="mb-6">
        If you wish to exercise any of these rights, please contact us at
        hello@nikolovlazar.com.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">9. Data Retention</h2>

      <p className="mb-6">
        We retain your information indefinitely. While we may implement soft
        deletions of data upon request, technically the data is never
        permanently deleted from our systems. This allows us to comply with
        legal obligations, resolve disputes, and enforce our agreements as
        needed.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        10. Children&apos;s Privacy
      </h2>

      <p className="mb-6">
        Bife is not intended for use by children under the age of 18. We do not
        knowingly collect personal information from children under 18. If you
        are a parent or guardian and believe that your child has provided us
        with personal information, please contact us. If we become aware that we
        have collected personal information from children without verification
        of parental consent, we take steps to remove that information from our
        servers.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">
        11. Changes to This Privacy Policy
      </h2>

      <p className="mb-6">
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page and, when
        applicable, sending you a notification about significant changes. You
        are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold">12. Contact Us</h2>

      <p className="mb-3">
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
      </p>
      <ul className="mb-6 list-disc pl-6">
        <li className="mb-2">
          <strong>Email</strong>: hello@nikolovlazar.com
        </li>
        <li className="mb-2">
          <strong>Website</strong>:{' '}
          <a href="https://bife.sh" className="text-blue-600 hover:underline">
            https://bife.sh
          </a>
        </li>
      </ul>
    </>
  )
}
