import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Banknote,
  CalendarRange,
  Clock3,
  FileUp,
  IdCard,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
} from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { savePanditRegistration } from '../lib/pandits';

const specializations = [
  'Vedic Astrology',
  'Numerology',
  'Palmistry',
  'Tarot Reading',
  'Vastu Shastra',
];

const services = [
  'Horoscope Reading',
  'Marriage Matching',
  'Career Guidance',
  'Kundali Analysis',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function SectionHeading({ index, title, description }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron">
        Section {index}
      </p>
      <h3 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>
    </div>
  );
}

function TextField({ label, icon: Icon, type = 'text', placeholder, name, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
        {Icon ? <Icon className="h-5 w-5 text-saffron" /> : null}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>
    </label>
  );
}

function getFileName(value) {
  return value instanceof File && value.name ? value.name : '';
}

function getFileNames(values) {
  return values
    .filter((value) => value instanceof File && value.name)
    .map((file) => file.name);
}

export default function PanditRegistrationPage({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get('password') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');

    if (password !== confirmPassword) {
      setError('Password and confirm password must match.');
      setLoading(false);
      return;
    }

    const entry = {
      id: String(Date.now()),
      fullName: String(data.get('fullName') || ''),
      gender: String(data.get('gender') || ''),
      dob: String(data.get('dob') || ''),
      profilePhoto: getFileName(data.get('profilePhoto')),
      mobile: String(data.get('mobile') || ''),
      email: String(data.get('email') || ''),
      city: String(data.get('city') || ''),
      state: String(data.get('state') || ''),
      country: String(data.get('country') || ''),
      address: String(data.get('address') || ''),
      experience: String(data.get('experience') || ''),
      specialization: String(data.get('specialization') || ''),
      languages: String(data.get('languages') || ''),
      bio: String(data.get('bio') || ''),
      services: data.getAll('services').map(String),
      certifications: getFileNames(data.getAll('certifications')),
      availableDays: data.getAll('availableDays').map(String),
      timeSlots: String(data.get('timeSlots') || ''),
      mode: String(data.get('mode') || ''),
      price: String(data.get('price') || ''),
      freeConsultation: String(data.get('freeConsultation') || ''),
      username: String(data.get('username') || ''),
      password: password,
      idProof: getFileName(data.get('idProof')),
      selfie: getFileName(data.get('selfie')),
      upiId: String(data.get('upiId') || ''),
      bankAccount: String(data.get('bankAccount') || ''),
      ifscCode: String(data.get('ifscCode') || ''),
    };

    try {
      await savePanditRegistration(entry);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vedaura-session-changed'));
      }
      form.reset();
      onNavigate('Home');
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4df_0%,#fffaf2_38%,#fff_100%)] pb-20 pt-32">
      <section className="mx-auto max-w-4xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Breadcrumb currentPage="Pandit Registration" homeLabel="Home" />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-[#f0dfbf] bg-white p-8 shadow-[0_26px_80px_-46px_rgba(212,175,55,0.48)] md:p-10"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-white shadow-[0_20px_35px_-20px_rgba(255,153,51,0.65)]">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-saffron">Pandit Registration</p>
              <h2 className="font-spiritual text-3xl font-bold text-gray-900">Complete Registration Form</h2>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="1"
                title="Basic Personal Details"
                description="Start with your identity and profile information."
              />
              <div className="mt-6 space-y-5">
                <TextField label="Full Name" icon={User} name="fullName" placeholder="Enter your full name" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Gender</span>
                  <div className="rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4">
                    <select name="gender" className="w-full bg-transparent text-gray-800 outline-none">
                      <option>Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </label>
                <TextField label="Date of Birth" icon={CalendarRange} type="date" name="dob" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Profile Photo</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#e4c58d] bg-[#fffaf2] px-4 py-4">
                    <FileUp className="h-5 w-5 text-saffron" />
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      className="w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-saffron file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="2"
                title="Contact Information"
                description="Add mobile, email, and location details for contact and verification."
              />
              <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">Mobile Number</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                      <Phone className="h-5 w-5 text-saffron" />
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="+91 98765 43210"
                        required
                        className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    <button type="button" className="rounded-full bg-saffron px-4 py-2 text-xs font-semibold text-white hover:bg-saffron/90">
                      Verify OTP
                    </button>
                  </div>
                </label>
                <TextField label="Email ID" icon={Mail} type="email" name="email" placeholder="you@example.com" required />
                <TextField label="City" icon={MapPin} name="city" placeholder="Enter city" required />
                <TextField label="State" icon={MapPin} name="state" placeholder="Enter state" required />
                <TextField label="Country" icon={MapPin} name="country" placeholder="Enter country" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Address</span>
                  <textarea
                    rows="4"
                    name="address"
                    placeholder="House number, street, area, landmark"
                    className="w-full rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-saffron focus:ring-2 focus:ring-saffron/20"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="3"
                title="Professional Details"
                description="Tell visitors what you specialize in and how many years you have practiced."
              />
              <div className="mt-6 space-y-5">
                <TextField label="Years of Experience" icon={Clock3} type="number" name="experience" placeholder="e.g. 8" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Specialization</span>
                  <div className="rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4">
                    <select name="specialization" className="w-full bg-transparent text-gray-800 outline-none">
                      <option>Select specialization</option>
                      {specializations.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <TextField label="Languages Known" name="languages" placeholder="Telugu, Hindi, English, etc." />
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="4"
                title="Expertise and Skills"
                description="Share your story, services, and any supporting certifications."
              />
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Short Bio / About Yourself</span>
                  <textarea
                    rows="4"
                    name="bio"
                    placeholder="Tell clients about your background, approach, and experience."
                    className="w-full rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 text-gray-800 outline-none placeholder:text-gray-400 focus:border-saffron focus:ring-2 focus:ring-saffron/20"
                  />
                </label>
                <div>
                  <span className="mb-3 block text-sm font-medium text-gray-700">Services Offered</span>
                  <div className="space-y-3">
                    {services.map((service) => (
                      <label key={service} className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-white px-4 py-4">
                        <input type="checkbox" name="services" value={service} className="h-4 w-4 accent-saffron" />
                        <span className="text-sm font-medium text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Certifications</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#e4c58d] bg-[#fffaf2] px-4 py-4">
                    <FileUp className="h-5 w-5 text-saffron" />
                    <input
                      type="file"
                      name="certifications"
                      multiple
                      className="w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-saffron file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="5"
                title="Availability"
                description="Choose your working days, hours, and service mode."
              />
              <div className="mt-6 space-y-5">
                <div>
                  <span className="mb-3 block text-sm font-medium text-gray-700">Available Days</span>
                  <div className="space-y-3">
                    {days.map((day) => (
                      <label key={day} className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-white px-4 py-4">
                        <input type="checkbox" name="availableDays" value={day} className="h-4 w-4 accent-saffron" />
                        <span className="text-sm font-medium text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <TextField label="Time Slots" icon={Clock3} name="timeSlots" placeholder="10 AM - 6 PM" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Online / Offline / Both</span>
                  <div className="rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4">
                    <select name="mode" className="w-full bg-transparent text-gray-800 outline-none">
                      <option>Select mode</option>
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Both</option>
                    </select>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="6"
                title="Pricing Details"
                description="Set your consultation price and whether you want to offer a free first consultation."
              />
              <div className="mt-6 space-y-5">
                <TextField label="Price per minute / session" icon={Banknote} type="number" name="price" placeholder="e.g. 50" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Free Consultation</span>
                  <div className="rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4">
                    <select name="freeConsultation" className="w-full bg-transparent text-gray-800 outline-none">
                      <option>Select option</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="7"
                title="Account and Security"
                description="Create your login details for future access."
              />
              <div className="mt-6 space-y-5">
                <TextField label="Username" icon={UserCheck} name="username" placeholder="Choose a username" required />
                <TextField label="Password" type="password" name="password" placeholder="Create password" required />
                <TextField label="Confirm Password" type="password" name="confirmPassword" placeholder="Confirm password" required />
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="8"
                title="Verification"
                description="Upload identity documents and optional selfie verification."
              />
              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">ID Proof (Aadhar / PAN)</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#e4c58d] bg-[#fffaf2] px-4 py-4">
                    <IdCard className="h-5 w-5 text-saffron" />
                    <input
                      type="file"
                      name="idProof"
                      className="w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-saffron file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">Selfie Verification</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-[#e4c58d] bg-[#fffaf2] px-4 py-4">
                    <UserCheck className="h-5 w-5 text-saffron" />
                    <input
                      type="file"
                      name="selfie"
                      accept="image/*"
                      className="w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-saffron file:px-4 file:py-2 file:text-white"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="9"
                title="Bank / Payment Details"
                description="These fields are optional, but useful if you want direct payout setup."
              />
              <div className="mt-6 space-y-5">
                <TextField label="UPI ID" icon={Banknote} name="upiId" placeholder="name@upi" />
                <TextField label="Bank Account Number" icon={Banknote} name="bankAccount" placeholder="Account number" />
                <TextField label="IFSC Code" icon={Banknote} name="ifscCode" placeholder="IFSC code" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#f4e4c9] bg-[#fffdf8] p-6">
              <SectionHeading
                index="10"
                title="Terms and Agreement"
                description="Please confirm the policies before submitting."
              />
              <div className="mt-6 space-y-4">
                <label className="flex items-start gap-3 rounded-2xl border border-[#edd9b6] bg-white px-4 py-4">
                  <input type="checkbox" name="terms" value="accepted" required className="mt-1 h-4 w-4 accent-saffron" />
                  <span className="text-sm leading-6 text-gray-700">I accept the Terms and Conditions.</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-[#edd9b6] bg-white px-4 py-4">
                  <input type="checkbox" name="privacyPolicy" value="accepted" required className="mt-1 h-4 w-4 accent-saffron" />
                  <span className="text-sm leading-6 text-gray-700">I agree to the Privacy Policy.</span>
                </label>
              </div>
            </section>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button type="submit" className="btn-primary w-full py-4 text-base" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        </motion.section>
      </section>
    </main>
  );
}
