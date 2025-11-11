import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Context aware chatbots",
      content:
        "This AI-powered SaaS product has transformed the way we work. It's like having a supercharged team member that never sleeps, delivering incredible insights and efficiency gains.",
    },
    {
      id: 2,
      title: "Team Collaboration Platform",
      content:
        "Invite team members to join your organisation and collaborate on chatbot management & improvements.",
    },
    {
      id: 3,
      title: "One-Line Integration",
      content:
        "Deploy intelligent chatbots instantly with a single line of code - no complex setup required.",
    },
    {
      id: 4,
      title: "Domain-Based Security",
      content:
        "Advanced security ensures your chatbot runs only on authorized domains, preventing unauthorized access and misuse.",
    },
    {
      id: 5,
      title: "Complete Behavior Control",
      content:
        "Customize response patterns, conversation flows, and chatbot personality to match your brand and requirements.",
    },
    {
      id: 6,
      title: "Full Theme Customization",
      content:
        "Design your chatbot's appearance with complete control over colors, fonts, positioning, and visual styling.",
    }
  ];

  // Duplicate testimonials for seamless loop
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className="py-10 font-inter bg-[#f1f6ff] rounded-3xl mx-2 px-4 sm:px-8 sm:mx-6 mt-6">

    </section>
  );
};

export default Features;
