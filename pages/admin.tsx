import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import AdminPanel from '../components/AdminPanel';
import Head from 'next/head';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        router.push('/login');
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <Head>
        <title>Panel de Administración</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <AdminPanel />
      </div>
    </>
  );
}