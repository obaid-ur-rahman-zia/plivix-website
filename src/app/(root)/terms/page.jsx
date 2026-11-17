import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service — Plivix Technologies",
  description: "The basic terms that apply to using this website and to quotes issued by Plivix Technologies.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    h: { en: "This website", bn: "এই ওয়েবসাইট" },
    p: {
      en: "The content on this site is provided for general information. Starting prices are guides, not offers. A price becomes binding only when it is in a written quote that we have issued and you have accepted.",
      bn: "এই সাইটের কনটেন্ট সাধারণ তথ্যের জন্য। শুরুর মূল্য একটি নির্দেশনা, প্রস্তাব নয়। আমাদের দেওয়া লিখিত কোটেশন আপনি গ্রহণ করলেই কেবল মূল্য বাধ্যতামূলক হয়।",
    },
  },
  {
    h: { en: "Projects", bn: "প্রজেক্ট" },
    p: {
      en: "Scope, timeline, payment milestones and ownership of the delivered work are set out in each project agreement. Unless that agreement says otherwise, you own the source code after final payment.",
      bn: "স্কোপ, সময়সীমা, পেমেন্টের ধাপ এবং হস্তান্তরিত কাজের মালিকানা প্রতিটি প্রজেক্ট চুক্তিতে লেখা থাকে। চুক্তিতে ভিন্ন কিছু না থাকলে চূড়ান্ত পেমেন্টের পর সোর্স কোডের মালিক আপনি।",
    },
  },
  {
    h: { en: "Liability", bn: "দায়" },
    p: {
      en: "We take care to keep this site accurate and available but provide it as is. Our liability on any project is limited as described in the agreement for that project.",
      bn: "আমরা সাইটটি সঠিক ও চালু রাখার চেষ্টা করি, তবে যেমন আছে তেমনভাবে দিই। কোনো প্রজেক্টে আমাদের দায় সেই প্রজেক্টের চুক্তিতে বর্ণিত সীমার মধ্যে।",
    },
  },
  {
    h: { en: "Contact", bn: "যোগাযোগ" },
    p: {
      en: "Questions about these terms: contact@plivix-tech.com.",
      bn: "এই শর্তাবলি নিয়ে প্রশ্ন: contact@plivix-tech.com।",
    },
  },
];

export default function TermsPage() {
  return <LegalPage title={{ en: "Terms of Service", bn: "সেবার শর্তাবলি" }} sections={sections} />;
}
