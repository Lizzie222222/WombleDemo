'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

const contacts: Contact[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 234 567 892', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, name: 'Eva Wilson', email: 'eva@example.com', phone: '+1 234 567 895', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, name: 'Frank Miller', email: 'frank@example.com', phone: '+1 234 567 896', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, name: 'Grace Lee', email: 'grace@example.com', phone: '+1 234 567 897', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
  { id: 9, name: 'Henry Taylor', email: 'henry@example.com', phone: '+1 234 567 898', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
  { id: 10, name: 'Ivy Clark', email: 'ivy@example.com', phone: '+1 234 567 899', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
];

export default function Contacts(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Contacts"
      description="Manage your contacts"
    >
      <div className="h-full w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm">
                  <HiOutlinePhone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <HiOutlineMail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

