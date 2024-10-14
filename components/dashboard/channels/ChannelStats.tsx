'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import MainChart from '@/components/dashboard/main/cards/MainChart';
import { lineChartDataMain, lineChartOptionsMain } from '@/variables/charts';
import { useState, useEffect } from 'react';

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
      title={`Channel Stats - ${channelName}`}
      description={`View statistics for ${channelName}`}
    >
      <div className="h-full w-full">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{channelName} Statistics</h2>
          <MainChart />
        </Card>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Interactions Over Time</h3>
          <div className="h-[350px]">
            {/* You can customize this chart as needed */}
            <MainChart />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
