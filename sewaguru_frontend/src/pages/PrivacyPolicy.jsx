import Footer from "../components/Footer";
import Header from "../components/header";
import {
  FaInfoCircle,
  FaUserShield,
  FaRegListAlt,
  FaHandshake,
  FaClipboardCheck,
  FaMoneyCheckAlt,
  FaGavel,
  FaEnvelopeOpenText,
} from "react-icons/fa";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />

      
      <section className="relative w-[300px] h-[300px] sm:h-[400px]">
        <img
          src="/worker.png"
          alt="Worker"
          className="w-[30px] h-full object-cover rounded-b-3xl"
        />
        <div className="absolute inset-0 bg-black/40 rounded-b-3xl flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Privacy Policy</h1>
          <p className="text-orange-400 text-lg sm:text-xl font-semibold mt-2">
            Terms and Conditions
          </p>
        </div>
      </section>

      <main className="flex-grow py-10 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <Section icon={<FaInfoCircle />} title="Information Collected on This Web Application">
            <p>
              SewaGuru collects personal information such as your name, phone number, email address,
              and location details. We may also gather service preferences and feedback to enhance
              offerings.
            </p>
          </Section>

          <Section icon={<FaUserShield />} title="Why We Collect Your Personal Information">
            <BulletList items={[
              "To process service requests",
              "To register service providers",
              "To enhance user communication and experience",
            ]} />
            <p>
              We do not share your personal data unless required by law or service fulfillment.
            </p>
          </Section>

          <Section icon={<FaRegListAlt />} title="How the Information Will Be Used">
            <BulletList items={[
              "Send email confirmations and updates",
              "Connect customers with verified service providers",
              "Access customer locations for inspections",
              "Improve platform security and analyze service trends",
            ]} />
          </Section>

          <Section icon={<FaHandshake />} title="Joining SewaGuru as a Service Provider">
            <p>
              All service providers must submit valid documents during registration to maintain trust.
            </p>
            <h3 className="font-semibold mt-4">Mandatory Verification Documents:</h3>
            <BulletList items={[
              "National Identity Card (NIC)",
              "Gramasevaka Certificate",
              "Police Clearance Certificate",
              "Licenses or certifications (if applicable)",
            ]} />
          </Section>

          <Section icon={<FaClipboardCheck />} title="Service Quality & Compliance">
            <BulletList items={[
              "Follow SewaGuru’s Terms & Conditions",
              "Respect customer privacy and platform rules",
              "Deliver high-quality services",
            ]} />
            <p>
              Misuse, dishonesty, or poor service may result in termination.
            </p>
          </Section>

          <Section icon={<FaMoneyCheckAlt />} title="Quotations, Payment, and Service Confirmation">
            <BulletList items={[
              "Site visits may be required to assess jobs",
              "Quotations valid for 30 days",
              "Jobs confirmed via email or advance payment",
              "Advance required for jobs over LKR 30,000",
              "Accepted methods: cash, bank transfer, or online",
              "Invoices must be settled within 14 days",
            ]} />
          </Section>

          <Section icon={<FaGavel />} title="Respecting Our Terms & Conditions">
            <p>
              Using SewaGuru confirms your agreement to our Privacy Policy and Terms. Updates may
              occur to improve our services and security.
            </p>
          </Section>

          <Section icon={<FaEnvelopeOpenText />} title="Contacting SewaGuru">
            <p>
              For any concerns or questions, contact us via{" "}
              <a href="mailto:sewaguru@gmail.com" className="text-blue-600 underline font-medium">
                sewaguru@gmail.com
              </a>{" "}
              or through our Contact Us page.
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="mb-10 border-b pb-6">
      <div className="flex items-center mb-4">
        <div className="text-2xl text-blue-500 mr-2">{icon}</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="text-gray-700 space-y-3 leading-relaxed text-justify text-sm sm:text-base">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
  );
}
