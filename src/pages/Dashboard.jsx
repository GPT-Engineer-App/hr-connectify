import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to TSVGlobal HRMS</CardTitle>
          <CardDescription>You are logged in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is your dashboard. More features coming soon!</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
