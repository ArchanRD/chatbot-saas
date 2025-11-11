import React from "react";

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Context Aware Chatbots",
      content: "AI-powered conversations that understand context and deliver intelligent responses.",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      textColor: "text-white",
      size: "large",
      icon: "🤖"
    },
    {
      id: 2,
      title: "Team Collaboration",
      content: "Work together seamlessly on chatbot development and management.",
      bgColor: "bg-gradient-to-br from-green-400 to-emerald-500",
      textColor: "text-white",
      size: "medium",
      icon: "👥"
    },
    {
      id: 3,
      title: "One-Line Integration",
      content: "Deploy instantly with a single line of code.",
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
      textColor: "text-white",
      size: "small",
      icon: "⚡"
    },
    {
      id: 4,
      title: "Domain Security",
      content: "Advanced security for authorized domains only.",
      bgColor: "bg-gradient-to-br from-purple-400 to-violet-600",
      textColor: "text-white",
      size: "large",
      icon: "🔒"
    },
    {
      id: 5,
      title: "Behavior Control",
      content: "Complete customization of response patterns and conversation flows.",
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      textColor: "text-white",
      size: "large",
      icon: "⚙️"
    },
    {
      id: 6,
      title: "Theme Customization",
      content: "Full control over appearance and styling.",
      bgColor: "bg-gradient-to-br from-teal-400 to-cyan-500",
      textColor: "text-white",
      size: "medium",
      icon: "🎨"
    },
    {
      id: 7,
      title: "Free to Use",
      content: "Powered by Gemini 2.0 PRO - Start building intelligent chatbots at no cost with enterprise-grade AI technology.",
      bgColor: "bg-gradient-to-br from-stone-400 to-stone-500",
      textColor: "text-white",
      size: "small",
      icon: "✨"
    }
  ];

  return (
    <section className="py-16 font-inter bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and manage intelligent chatbots that deliver exceptional user experiences.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[800px]">
          {/* Feature 1 - Large card (spans 2 cols, 2 rows) */}
          <div className={`${features[0].bgColor} rounded-3xl p-8 lg:col-span-2 lg:row-span-2 flex flex-col justify-between min-h-[300px] lg:min-h-0 relative overflow-hidden`}>
            <div className="absolute top-4 right-4 text-6xl opacity-20">
              {features[0].icon}
            </div>
            <div>
              <h3 className={`text-3xl font-bold ${features[0].textColor} mb-4`}>
                {features[0].title}
              </h3>
              <p className={`text-lg ${features[0].textColor} opacity-90 leading-relaxed`}>
                {features[0].content}
              </p>
            </div>
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{features[0].icon}</span>
                </div>
                <div className={`text-sm ${features[0].textColor} opacity-75`}>
                  Smart & Contextual
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Medium card (1 col, 1 row) */}
          <div className={`${features[1].bgColor} rounded-3xl p-6 lg:col-span-1 lg:row-span-1 flex flex-col justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-2 right-2 text-4xl opacity-20">
              {features[1].icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${features[1].textColor} mb-3`}>
                {features[1].title}
              </h3>
              <p className={`text-sm ${features[1].textColor} opacity-90`}>
                {features[1].content}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-2xl">{features[1].icon}</span>
            </div>
          </div>

          {/* Feature 3 - Small card (1 col, 1 row) */}
          <div className={`${features[2].bgColor} rounded-3xl p-6 lg:col-span-1 lg:row-span-1 flex flex-col justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-2 right-2 text-4xl opacity-20">
              {features[2].icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${features[2].textColor} mb-3`}>
                {features[2].title}
              </h3>
              <p className={`text-sm ${features[2].textColor} opacity-90`}>
                {features[2].content}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-2xl">{features[2].icon}</span>
            </div>
          </div>

          {/* Feature 4 - Large card (2 cols, 1 row) */}
          <div className={`${features[3].bgColor} rounded-3xl p-8 lg:col-span-2 lg:row-span-1 flex items-center justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-4 right-4 text-6xl opacity-20">
              {features[3].icon}
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold ${features[3].textColor} mb-4`}>
                {features[3].title}
              </h3>
              <p className={`text-base ${features[3].textColor} opacity-90`}>
                {features[3].content}
              </p>
            </div>
            <div className="ml-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl">{features[3].icon}</span>
              </div>
            </div>
          </div>

          {/* Feature 5 - Large card (spans 2 cols, 1 row) */}
          <div className={`${features[4].bgColor} rounded-3xl p-8 lg:col-span-2 lg:row-span-1 flex items-center justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-4 right-4 text-6xl opacity-20">
              {features[4].icon}
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold ${features[4].textColor} mb-4`}>
                {features[4].title}
              </h3>
              <p className={`text-base ${features[4].textColor} opacity-90`}>
                {features[4].content}
              </p>
            </div>
            <div className="ml-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl">{features[4].icon}</span>
              </div>
            </div>
          </div>

          {/* Feature 6 - Small card (1 col, 1 row) */}
          <div className={`${features[5].bgColor} rounded-3xl p-6 lg:col-span-1 lg:row-span-1 flex flex-col justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-2 right-2 text-4xl opacity-20">
              {features[5].icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${features[5].textColor} mb-3`}>
                {features[5].title}
              </h3>
              <p className={`text-sm ${features[5].textColor} opacity-90`}>
                {features[5].content}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-2xl">{features[5].icon}</span>
            </div>
          </div>

          {/* Feature 7 - Small card (1 col, 1 row) */}
          <div className={`${features[6].bgColor} rounded-3xl p-6 lg:col-span-1 lg:row-span-1 flex flex-col justify-between min-h-[200px] relative overflow-hidden`}>
            <div className="absolute top-2 right-2 text-4xl opacity-20">
              {features[6].icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${features[6].textColor} mb-3`}>
                {features[6].title}
              </h3>
              <p className={`text-sm ${features[6].textColor} opacity-90`}>
                {features[6].content}
              </p>
            </div>
            <div className="mt-4">
              <span className="text-2xl">{features[6].icon}</span>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default Features;
