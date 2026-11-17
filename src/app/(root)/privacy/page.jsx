import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy — Plivix Technologies",
  description: "How Plivix Technologies collects, uses and protects the information you send us.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    h: { en: "What we collect", bn: "আমরা কী তথ্য নিই" },
    p: {
      en: "When you use our contact form we receive your name, email, optional phone number, company, budget range and the message you write. We also use basic analytics (page views, device type, country) if analytics is enabled on the site.",
      bn: "যোগাযোগ ফর্ম ব্যবহার করলে আমরা আপনার নাম, ইমেইল, ঐচ্ছিক ফোন নম্বর, কোম্পানি, বাজেটের পরিসর এবং আপনার লেখা বার্তা পাই। সাইটে অ্যানালিটিক্স চালু থাকলে পেজ ভিউ, ডিভাইসের ধরন ও দেশের মতো সাধারণ তথ্যও ব্যবহার করি।",
    },
  },
  {
    h: { en: "How we use it", bn: "কীভাবে ব্যবহার করি" },
    p: {
      en: "Only to reply to your enquiry, prepare a quote and improve the site. We do not sell your information and we do not send marketing email you did not ask for.",
      bn: "শুধু আপনার অনুসন্ধানের উত্তর দিতে, কোটেশন তৈরি করতে এবং সাইট উন্নত করতে। আমরা আপনার তথ্য বিক্রি করি না এবং না চাইলে মার্কেটিং ইমেইল পাঠাই না।",
    },
  },
  {
    h: { en: "Services we rely on", bn: "যেসব সেবা ব্যবহার করি" },
    p: {
      en: "Form messages are delivered through an email service (EmailJS) and site content is stored with Supabase. Those providers process data on our behalf.",
      bn: "ফর্মের বার্তা ইমেইল সেবা (EmailJS) এর মাধ্যমে পৌঁছায় এবং সাইটের কনটেন্ট Supabase এ রাখা হয়। এই সেবাদাতারা আমাদের পক্ষে তথ্য প্রক্রিয়া করে।",
    },
  },
  {
    h: { en: "Your choices", bn: "আপনার সিদ্ধান্ত" },
    p: {
      en: "You can ask us to see, correct or delete what we hold about you by writing to contact@plivix-tech.com.",
      bn: "contact@plivix-tech.com এ লিখে আপনার সম্পর্কে আমাদের কাছে থাকা তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলতে বলতে পারেন।",
    },
  },
];

export default function PrivacyPage() {
  return <LegalPage title={{ en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }} sections={sections} />;
}
