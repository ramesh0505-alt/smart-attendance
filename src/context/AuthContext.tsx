import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  isLoading: boolean;
  login: (user: User) => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAllUsers(data.data);
        // Default to Ramesh Kumar (student) or stored user
        const storedId = localStorage.getItem('smartcampus_user_id');
        const matched = data.data.find((u: User) => u.id === storedId);
        if (matched) {
          setCurrentUser(matched);
        } else {
          const ramesh = data.data.find((u: User) => u.id === 'std_ramesh') || data.data[0];
          setCurrentUser(ramesh);
          localStorage.setItem('smartcampus_user_id', ramesh.id);
        }
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smartcampus_user_id', user.id);
  };

  const switchRole = (role: UserRole) => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('smartcampus_user_id', target.id);
    }
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('smartcampus_user_id', target.id);
    }
  };

  const logout = () => {
    // Return to demo student
    const student = allUsers.find(u => u.id === 'std_ramesh') || allUsers[0];
    if (student) {
      setCurrentUser(student);
      localStorage.setItem('smartcampus_user_id', student.id);
    }
  };

  const updateCurrentUser = async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.data);
        setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? data.data : u)));
      }
    } catch (e) {
      console.error('Failed to update user profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoading,
        login,
        switchRole,
        switchUser,
        logout,
        updateCurrentUser,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
