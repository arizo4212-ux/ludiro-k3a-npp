import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import type { UserProfile } from '../types/shipping';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginDirect: (customName?: string, customRole?: UserProfile['role']) => void;
  loginAsDemo: (roleType: 'admin' | 'fleet' | 'cargo') => void;
  loginWithCredentials: (identifier: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS: Record<string, UserProfile> = {
  admin: {
    uid: 'admin-utama',
    email: 'admin@samudera-maritim.id',
    displayName: 'Bambang Soediro (Direktur Operasional)',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isDemo: true,
  },
  fleet: {
    uid: 'fleet-lead',
    email: 'fleet.mgr@samudera-maritim.id',
    displayName: 'Capt. Aris Nugraha (Fleet Manager)',
    role: 'Fleet Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isDemo: true,
  },
  cargo: {
    uid: 'cargo-lead',
    email: 'cargo.lead@samudera-maritim.id',
    displayName: 'Siti Rahmawati (Manajer Kargo)',
    role: 'Cargo & Logistics Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isDemo: true,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to real Firebase Auth state if user signs in with Google
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || 'user@samudera-maritim.id',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Perwira Maritim',
          role: 'Super Admin',
          avatar: fbUser.photoURL || undefined,
          isDemo: false,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Direct 1-click entrance for any visitor
  const loginDirect = (customName?: string, customRole: UserProfile['role'] = 'Super Admin') => {
    const name = customName?.trim() || 'Admin Operasional';
    setUser({
      uid: `officer-${Date.now()}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@samudera-maritim.id`,
      displayName: name,
      role: customRole,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      isDemo: true,
    });
  };

  const loginAsDemo = (roleType: 'admin' | 'fleet' | 'cargo') => {
    const demoProfile = DEMO_ACCOUNTS[roleType];
    if (demoProfile) {
      setUser(demoProfile);
    }
  };

  const loginWithCredentials = async (
    identifier: string,
    pass: string
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedId = identifier.trim();
    if (!trimmedId) {
      return { success: false, message: 'Silakan isi nama atau email Anda' };
    }

    // Friendly easy login: accepts password or defaults seamlessly
    setUser({
      uid: `officer-${Date.now()}`,
      email: trimmedId.includes('@') ? trimmedId : `${trimmedId.toLowerCase()}@samudera-maritim.id`,
      displayName: trimmedId.includes('@') ? trimmedId.split('@')[0] : trimmedId,
      role: 'Super Admin',
      isDemo: true,
    });
    return { success: true };
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Ignored
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginDirect,
        loginAsDemo,
        loginWithCredentials,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
