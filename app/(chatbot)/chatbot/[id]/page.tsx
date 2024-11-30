import React from "react";

const page = ({ params }) => {
  return (
    <div>
      Chatbot with id: {params.id} <br /> The settings can be edited here
    </div>
  );
};

export default page;
