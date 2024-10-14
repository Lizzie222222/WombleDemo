import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiOutlineUser } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Contact {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  interactions: number;
  dailyStreak: number;
  lastOnline: string;
  dateJoined: string;
}

const generateContacts = (): Contact[] => {
  const contacts: Contact[] = [];
  for (let i = 1; i <= 25; i++) {
    contacts.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      avatarUrl: `https://i.pravatar.cc/150?img=${i}`,
      interactions: Math.floor(Math.random() * 1000),
      dailyStreak: Math.floor(Math.random() * 30),
      lastOnline: ['Just now', '5 minutes ago', '1 hour ago', '1 day ago'][Math.floor(Math.random() * 4)],
      dateJoined: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    });
  }
  return contacts;
};

const SkeletonRow = () => (
  <TableRow>
    <TableCell><Skeleton className="h-12 w-12 rounded-full" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
  </TableRow>
);

export default function ChannelContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContacts(generateContacts());
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Name</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Interactions</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Daily Streak</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Last Online</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Date Joined</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)
        ) : (
          contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{contact.name}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{contact.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.interactions}</TableCell>
              <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.dailyStreak} days</TableCell>
              <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.lastOnline}</TableCell>
              <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.dateJoined}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="text-zinc-900 dark:text-zinc-100">
                  <HiOutlineUser className="mr-2 h-4 w-4" />
                  See Profile
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
