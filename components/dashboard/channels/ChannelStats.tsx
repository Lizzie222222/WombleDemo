'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import MainChart from '@/components/dashboard/main/cards/MainChart';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineChatBubbleLeftRight, HiOutlineBookOpen, HiOutlineCog } from 'react-icons/hi2';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  channelId: string;
}

export default function ChannelStats({ user, userDetails, channelId }: Props) {
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    // Fetch channel name based on channelId
    // This is a placeholder, replace with actual data fetching logic
    setChannelName(`Channel ${channelId}`);
  }, [channelId]);

  return (
    <DashboardLayout
      user={user}
      userDetails={userDetails}
      title={`Channel - ${channelName}`}
      description={`Manage ${channelName}`}
    >
      <div className="h-full w-full">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{channelName}</h2>
          <Tabs defaultValue="analytics" className="w-full">
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
                <h3 className="text-xl font-semibold mb-4">Contacts</h3>
                {/* Add contacts component here */}
                <p>Contacts list and management will be displayed here.</p>
              </Card>
            </TabsContent>
            <TabsContent value="playground">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Playground</h3>
                {/* Add AI chat playground component here */}
                <p>AI chat playground will be displayed here.</p>
              </Card>
            </TabsContent>
            <TabsContent value="knowledge-base">
              <Card className="p-4">
                <h3 className="text-xl font-semibold mb-4">Knowledge Base</h3>
                {/* Add knowledge base component here */}
                <p>Knowledge base management will be displayed here.</p>
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
