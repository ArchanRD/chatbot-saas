const features = [
  {
    title: "Retrieval-Augmented Generation (RAG)",
    description:
      "Vector-based semantic search across your knowledge base. Real-time document embedding and indexing. Relevance scoring for accurate information retrieval",
  },
  {
    title: "Intelligent chatbots",
    description:
      "Powered by Google's Gemini 2.0 Flash for sub-second response times. Context-aware conversation management with memory persistence. Natural language understanding with intent recognition and entity extraction.",
  },
  {
    title: "24/7 availability",
    description:
      "Our chatbots operate with 99.99% uptime, ensuring your customers always get the support they need. Reliable performance even during high traffic periods with automatic scaling and load balancing.",
  },
];

export default function ProductivityCard() {
  return (
    <div className="py-10 font-inter bg-[#f1f6ff] rounded-3xl mx-2 px-4 sm:px-8 sm:mx-6 mt-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-left mb-10 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight">
              SaaS Productivity Improvement
            </h1>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Smart Task Automation with CTA */}
            <div className="flex">
              <div className="bg-white backdrop-blur-sm rounded-3xl p-8 border border-white/20 transition-shadow duration-300 h-full w-full flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
                  {features[0].title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                  {features[0].description}
                </p>
              </div>
            </div>

            {/* Right Column - Other Features */}
            <div className="space-y-8">
              {features.slice(1).map((feature, index) => (
                <div
                  key={index}
                  className="bg-white backdrop-blur-sm rounded-3xl p-8  border border-white/20 transition-shadow duration-300"
                >
                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
