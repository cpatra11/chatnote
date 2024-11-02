import React from "react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

const AIChatButton = () => {
  const [chatboxOpen, setChatboxOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setChatboxOpen(true)}>
        <Bot size={20} className="mr-20" />
        AI Chat
      </Button>
      <AIChatBox open={chatboxOpen} onClose={() => setChatboxOpen(false)} />
    </>
  );
};

export default AIChatButton;
