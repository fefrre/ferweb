'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
type Solicitud = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget_range: string;
  deadline: string;
  description: string;
  features: string[];
  integrations: string[];
  design_preferences: string;
  target_audience: string;
  existing_website: string;
  hosting_preferences: string;
  additional_comments: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'completed';
};

export default function AdminPanel() {
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Solicitud | null>(null);

  // Obtener solicitudes
  const fetchSolicitudes = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSolicitudes(data || []);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado
  const updateStatus = async (id: string, status: string) => {
    
    try {
      const { error } = await supabase
        .from('solicitudes')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchSolicitudes();
    } catch (err) {
      setError('Error al actualizar');
    }
    
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      setError('Error al cerrar sesión');
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'}`}
            >
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-500 text-white"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Vista principal */}
        {!selectedProject ? (
          <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                  <tr>
                    <th className="px-6 py-3 text-left">Cliente</th>
                    <th className="px-6 py-3 text-left">Proyecto</th>
                    <th className="px-6 py-3 text-left">Presupuesto</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr 
                      key={solicitud.id} 
                      className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{solicitud.name}</p>
                        <p className="text-sm opacity-80">{solicitud.email}</p>
                      </td>
                      <td className="px-6 py-4">{solicitud.project_type}</td>
                      <td className="px-6 py-4">{solicitud.budget_range}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          solicitud.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          solicitud.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {solicitud.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => setSelectedProject(solicitud)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                          Detalles
                        </button>
                        <select
                          value={solicitud.status}
                          onChange={(e) => updateStatus(solicitud.id, e.target.value)}
                          className={`border rounded p-1 text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="reviewed">Revisado</option>
                          <option value="contacted">Contactado</option>
                          <option value="completed">Completado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Vista de detalle del proyecto */
          <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Detalles del Proyecto</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                Volver
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Información Básica</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Cliente:</span> {selectedProject.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedProject.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {selectedProject.phone || 'No especificado'}</p>
                  <p><span className="font-medium">Empresa:</span> {selectedProject.company || 'No especificado'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Detalles Técnicos</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Tipo:</span> {selectedProject.project_type}</p>
                  <p><span className="font-medium">Presupuesto:</span> {selectedProject.budget_range}</p>
                  <p><span className="font-medium">Fecha límite:</span> {selectedProject.deadline || 'No especificada'}</p>
                  <p><span className="font-medium">Hosting:</span> {selectedProject.hosting_preferences || 'No especificado'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {selectedProject.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {selectedProject.design_preferences && (
                <div>
                  <h3 className="font-semibold mb-2">Preferencias de Diseño</h3>
                  <p className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {selectedProject.design_preferences}
                  </p>
                </div>
              )}

              {selectedProject.target_audience && (
                <div>
                  <h3 className="font-semibold mb-2">Público Objetivo</h3>
                  <p className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {selectedProject.target_audience}
                  </p>
                </div>
              )}
            </div>

            {selectedProject.features?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Funcionalidades Requeridas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.features.map((feature, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.integrations?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Integraciones</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.integrations.map((integration, i) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.existing_website && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Sitio Web Existente</h3>
                <a 
                  href={selectedProject.existing_website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-4 rounded block ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-gray-100 text-blue-600'}`}
                >
                  {selectedProject.existing_website}
                </a>
              </div>
            )}

            {selectedProject.additional_comments && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Comentarios Adicionales</h3>
                <p className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {selectedProject.additional_comments}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}