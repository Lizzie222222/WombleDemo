'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import MainChart from '@/components/dashboard/main/cards/MainChart';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineChatBubbleLeftRight, HiOutlineBookOpen, HiOutlineCog, HiUser, HiSparkles, HiPaperAirplane } from 'react-icons/hi2';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChannelContacts from './ChannelContacts';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  channelId: string;
}

export default function ChannelStats({ user, userDetails, channelId }: Props) {
  const [channelName, setChannelName] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [prompt, setPrompt] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [aiModel, setAiModel] = useState('gpt-3.5-turbo');
  const [maxTokens, setMaxTokens] = useState(150);

  useEffect(() => {
    // Fetch channel name based on channelId
    // This is a placeholder, replace with actual data fetching logic
    setChannelName(`Channel ${channelId}`);
  }, [channelId]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatHistory([...chatHistory, `User: ${userInput}`]);
      // Here you would typically send the message to your AI service
      // and then add the AI's response to the chat history
      setUserInput('');
    }
  };

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title={`Channel - ${channelName}`}
      description={`Manage ${channelName}`}
    >
      <div className="h-full w-full">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">{channelName}</h2>
          <Tabs defaultValue="playground" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="analytics" className="flex items-center">
                <HiOutlineChartBar className="mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center">
                <HiOutlineUsers className="mr-2" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="playground" className="flex items-center">
                <HiOutlineChatBubbleLeftRight className="mr-2" />
                Playground
              </TabsTrigger>
              <TabsTrigger value="knowledge-base" className="flex items-center">
                <HiOutlineBookOpen className="mr-2" />
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center">
                <HiOutlineCog className="mr-2" />
                Config
              </TabsTrigger>
            </TabsList>
            <TabsContent value="analytics">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Analytics</h3>
                <MainChart />
              </Card>
            </TabsContent>
            <TabsContent value="contacts">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Contacts</h3>
                <ChannelContacts />
              </Card>
            </TabsContent>
            <TabsContent value="playground" className="mt-6">
              <div className="flex gap-6">
                <Card className="p-4 w-1/3">
                  <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">AI Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">AI Model</label>
                      <Select onValueChange={setAiModel} value={aiModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4-1106-preview">GPT-4 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Temperature</label>
                      <Slider
                        value={[temperature]}
                        onValueChange={(value) => setTemperature(value[0])}
                        max={1}
                        step={0.1}
                      />
                      <span className="text-sm text-zinc-900 dark:text-zinc-100">{temperature}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Max Tokens</label>
                      <Input
                        type="number"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(Number(e.target.value))}
                        min={1}
                        max={4096}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">System Prompt</label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter system prompt..."
                        className="w-full text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100">Knowledge Base</label>
                      <Select onValueChange={setKnowledgeBase} value={knowledgeBase}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select knowledge base" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kb1">Knowledge Base 1</SelectItem>
                          <SelectItem value="kb2">Knowledge Base 2</SelectItem>
                          <SelectItem value="kb3">Knowledge Base 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full" variant="primary">Apply Settings</Button>
                  </div>
                </Card>
                <Card className="p-4 w-2/3">
                  <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Chat</h3>
                  <div className="h-[400px] overflow-y-auto mb-4 p-2 border rounded">
                    {chatHistory.map((message, index) => (
                      <div key={index} className={`mb-4 flex ${message.startsWith("User: ") ? "justify-end" : "justify-start"}`}>
                        {message.startsWith("User: ") ? (
                          <div className="flex items-end">
                            <div className="max-w-[70%] rounded-lg bg-blue-500 p-3 text-white">
                              <p className="text-sm">{message.slice(6)}</p>
                            </div>
                            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                              <HiUser className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-end">
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                              <HiSparkles className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                            </div>
                            <div className="max-w-[70%] rounded-lg border border-zinc-200 bg-white p-3 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                              <p className="text-sm">{message}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-grow text-zinc-900 dark:text-zinc-100"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="px-4 py-2 flex items-center" variant="primary">
                      <HiPaperAirplane className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="knowledge-base">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Knowledge Base</h3>
                {/* Temporary placeholder text */}
                <p className="text-zinc-700 dark:text-zinc-300">Knowledge base management will be displayed here.</p>
                {/* Once implemented, replace the above line with: */}
                {/* <KnowledgeBaseManager channelId={channelId} /> */}
              </Card>
            </TabsContent>
            <TabsContent value="config">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Configuration</h3>
                {/* Add configuration component here */}
                <p>Channel configuration options will be displayed here.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}
