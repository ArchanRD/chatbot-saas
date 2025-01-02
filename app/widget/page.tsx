import Script from "next/script";
import React from "react";

const page = () => {
  return (
    <>
      <div>Chatbot page</div>
      <Script src="http://localhost:3000/widget/chatbot.js"></Script>
    </>
  );
};

export default page;
