import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Failed to fetch users');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: { name: newUserName }
      });
      if (error) throw error;
      setMessage('User created successfully');
      fetchUsers();
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
          <CardDescription>Add a new user to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createUser} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
            <Button type="submit">Create User</Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <Alert className="mb-4">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage existing users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Email Confirmed</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.user_metadata?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    {user.email_confirmed_at ? (
                      <Badge variant="success">Confirmed</Badge>
                    ) : (
                      <Badge variant="destructive">Not Confirmed</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
