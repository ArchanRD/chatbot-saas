import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tab';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Working = () => {
  const tabsData = [
    {
      id: 'create-organisation',
      title: 'Create Organisation',
      content: {
        title: 'Create Organisation',
        description: 'Create an organisation to manage your AI models and data. This feature enables users to fine-tune AI models to their specific business needs. It provides tools and interfaces for data labeling, model training, and evaluation. Users can adapt AI algorithms to their unique datasets, improving accuracy and relevance.',
      },
      img: "/steps/create-org.png"
    },
    {
      id: 'generete-api-key',
      title: 'Generete API Key',
      content: {
        title: 'Generete API Key',
        description: 'Generete an API key to access our AI models and data. This will be used to integrate chatbot widget in your website. This is an identity for your chatbot. Incase of any issue, you can regenerate the api key.',
      },
      img: "/steps/generate-api-key.png"
    },
    {
      id: 'chatbot-widget',
      title: 'Chatbot Widget',
      content: {
        title: 'Chatbot Widget',
        description: 'Integrate our chatbot widget in your website to provide a seamless experience to your users. This widget will be used to provide a seamless experience to your users.',
      },
      img: "/steps/create-chatbot.png"
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      content: {
        title: 'Knowledge Base',
        description: 'Add your knowledge base to your chatbot. This will be used to provide a seamless experience to your users.',
      },
      img: "/steps/knowledge-base.png"
    },
    {
      id: 'integration',
      title: 'Integration',
      content: {
        title: 'Integration',
        description: 'Integrate our chatbot widget in your website to provide a seamless experience to your users. This widget will be used to provide a seamless experience to your users.',
      },
      img: "/steps/integration.png"
    }
  ];

  return (
    <section className="py-10 font-inter bg-[#f1f6ff] rounded-3xl mx-2 px-4 sm:px-8 sm:mx-6 mt-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight sm:mb-8">
              How It Works?
              </h1>
            </div>
            <div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform streamlines AI adoption through six simple steps. No technical expertise needed - just intuitive tools that transform complex machine learning into powerful business solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12">
          <Tabs defaultValue="create-organisation" className="w-full">
            {/* Horizontal Tabs List */}
            <TabsList className="w-full bg-transparent p-0 mb-0 h-auto">
              <div className="flex flex-wrap gap-1 w-full justify-center sm:justify-start">
                {tabsData.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="px-4 py-3 w-full lg:w-52 bg-transparent !shadow-none text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-t-lg rounded-b-none border-0 font-medium"
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>

            {/* Content Cards */}
            {tabsData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0 bg-white p-10 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Information Card */}
                  <Card className="bg-white border-0 shadow-none p-8">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-3xl font-medium text-gray-900">
                        {tab.content.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <CardDescription className="text-lg text-gray-600 leading-relaxed mb-8">
                        {tab.content.description}
                      </CardDescription>
                    </CardContent>
                  </Card>

                  {/* Visual Element */}
                  <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-md lg:max-w-lg h-96 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl relative overflow-hidden">
                      <img src={tab.img} alt="card image" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Working;