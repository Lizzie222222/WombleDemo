import { redirect } from 'next/navigation';
import { getUserDetails, getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import ChannelStats from '@/components/dashboard/channels/ChannelStats';

export default async function ChannelPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

  if (!user) {
    return redirect('/dashboard/signin');
  }

  return <ChannelStats user={user} userDetails={userDetails} channelId={params.id} />;
}

