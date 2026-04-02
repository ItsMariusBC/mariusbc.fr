'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { ICON_MAP, ICON_OPTIONS } from '@/lib/dock-icons';
import { 
  Settings, 
  LogOut, 
  Save, 
  Plus, 
  Edit, 
  Trash2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  MousePointer,
  Mail,
} from 'lucide-react';
import type { DockIcon, SiteConfig } from '@prisma/client';

interface AnalyticsData {
  contactClicks: number;
  dockClicks: { name: string; clicks: number }[];
}

function getDomainFromUrl(url: string) {
  try {
    if (url.startsWith('mailto:')) return url.replace('mailto:', '');
    if (url.startsWith('tel:')) return url.replace('tel:', '');
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.substring(4) : domain;
  } catch {
    return url;
  }
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [dockIcons, setDockIcons] = useState<DockIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactUrl, setContactUrl] = useState('');
  const [editingIcon, setEditingIcon] = useState<DockIcon | null>(null);
  const [showAddIcon, setShowAddIcon] = useState(false);
  const [newIcon, setNewIcon] = useState({
    name: '',
    iconName: 'Mail',
    url: '',
    tooltip: '',
  });
  const [analytics, setAnalytics] = useState<AnalyticsData>({ contactClicks: 0, dockClicks: [] });
  const [activeTab, setActiveTab] = useState('analytics');
  const [loadError, setLoadError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadError('');
        const [configData, iconsData, analyticsData] = await Promise.all([
          fetchJson<SiteConfig | null>('/api/site-config'),
          fetchJson<DockIcon[]>('/api/dock-icons?include_inactive=true'),
          fetchJson<AnalyticsData>('/api/analytics')
        ]);

        setSiteConfig(configData);
        setContactUrl(configData?.contactButtonUrl || '');
        setDockIcons(iconsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoadError(error instanceof Error ? error.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadData();
    }
  }, [session]);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/admin');
    }
  }, [session, status, router]);

  useEffect(() => {
    if (status !== 'loading' && session?.user?.role !== 'admin') {
      signOut({ redirect: false }).finally(() => {
        router.push('/admin');
      });
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const updatedConfig = await fetchJson<SiteConfig>('/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactButtonUrl: contactUrl }),
      });

      setSiteConfig(updatedConfig);
      alert('Configuration sauvegardee');
    } catch (error) {
      console.error('Error saving config:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleAddIcon = async () => {
    try {
      const createdIcon = await fetchJson<DockIcon>('/api/dock-icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIcon),
      });

      setDockIcons([...dockIcons, createdIcon]);
      setNewIcon({ name: '', iconName: 'Mail', url: '', tooltip: '' });
      setShowAddIcon(false);
      alert('Icone ajoutee');
    } catch (error) {
      console.error('Error adding icon:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'ajout');
    }
  };

  const handleUpdateIcon = async () => {
    if (!editingIcon) return;
    
    try {
      const updatedIcon = await fetchJson<DockIcon>(`/api/dock-icons/${editingIcon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingIcon),
      });

      setDockIcons(dockIcons.map(icon => 
        icon.id === editingIcon.id ? updatedIcon : icon
      ));
      setEditingIcon(null);
      alert('Icone mise a jour');
    } catch (error) {
      console.error('Error updating icon:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise a jour');
    }
  };

  const handleDeleteIcon = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette icône ?')) return;
    
    try {
      await fetchJson<{ success: boolean }>(`/api/dock-icons/${id}`, {
        method: 'DELETE',
      });

      setDockIcons(dockIcons.filter(icon => icon.id !== id));
      alert('Icone supprimee');
    } catch (error) {
      console.error('Error deleting icon:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleIcon = async (icon: DockIcon) => {
    try {
      const updatedIcon = await fetchJson<DockIcon>(`/api/dock-icons/${icon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...icon, isActive: !icon.isActive }),
      });

      setDockIcons(dockIcons.map(i => i.id === icon.id ? updatedIcon : i));
    } catch (error) {
      console.error('Error toggling icon:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la modification');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center">
        <div className="text-white/90 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl">
              <Settings className="w-6 h-6 text-white/90" />
            </div>
            <SparklesText className="text-3xl font-bold text-white/90">
              Administration
            </SparklesText>
          </div>
          
          <ShinyButton
            onClick={handleLogout}
            className="px-4 py-2"
            style={{
              "--primary": "rgb(239, 68, 68)",
              "--glow-color": "rgba(239, 68, 68, 0.5)"
            } as React.CSSProperties}
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </span>
          </ShinyButton>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'contact', label: 'Contact', icon: Settings },
            { id: 'dock', label: 'Dock Icons', icon: ExternalLink }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80 border border-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {loadError && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {loadError}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Button Analytics */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <MousePointer className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white/90">Bouton Contact</h3>
                  <p className="text-sm text-white/60">Clics total</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-white/90 mb-2">
                {analytics.contactClicks}
              </div>
              <div className="text-sm text-purple-300 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Analytics en temps réel
              </div>
            </div>

            {/* Top Dock Icons Chart */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white/90">Icônes du Dock</h3>
                  <p className="text-sm text-white/60">Clics par icône</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {analytics.dockClicks.slice(0, 6).map((item, index) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-sm font-medium text-white/60">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/90 font-medium">{item.name}</span>
                        <span className="text-white/60">{item.clicks}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ 
                            width: `${Math.max(5, (item.clicks / Math.max(...analytics.dockClicks.map(d => d.clicks))) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {analytics.dockClicks.length === 0 && (
                  <p className="text-white/60 text-center py-8">Aucune donnée disponible</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration du site
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    URL du bouton &quot;Me contacter&quot;
                  </label>
                  <input
                    type="text"
                    value={contactUrl}
                    onChange={(e) => setContactUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="mailto:email@example.com ou https://..."
                  />
                </div>
                
                <ShinyButton
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="px-4 py-2"
                  style={{
                    "--primary": "rgb(34, 197, 94)",
                    "--glow-color": "rgba(34, 197, 94, 0.5)"
                  } as React.CSSProperties}
                >
                  <span className="flex items-center gap-2">
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                    <Save className="w-4 h-4" />
                  </span>
                </ShinyButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dock' && (
          <div className="max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white/90 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Icônes du dock
                </h2>
                <ShinyButton
                  onClick={() => setShowAddIcon(true)}
                  className="px-3 py-1 text-sm"
                  style={{
                    "--primary": "rgb(59, 130, 246)",
                    "--glow-color": "rgba(59, 130, 246, 0.5)"
                  } as React.CSSProperties}
                >
                  <span className="flex items-center gap-2">
                    Ajouter
                    <Plus className="w-4 h-4" />
                  </span>
                </ShinyButton>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {dockIcons.map((icon) => {
                  const IconComponent = ICON_MAP[icon.iconName] || Mail;
                  return (
                    <div key={icon.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white/90" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white/90 truncate">{icon.name}</div>
                        <div className="text-sm text-white/60 truncate">{getDomainFromUrl(icon.url)}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggleIcon(icon)}
                          className={`px-2 py-1 text-xs rounded-lg font-medium ${
                            icon.isActive 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}
                        >
                          {icon.isActive ? 'Actif' : 'Inactif'}
                        </button>
                        
                        <button
                          onClick={() => setEditingIcon(icon)}
                          className="p-1 text-white/60 hover:text-white/90 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteIcon(icon.id)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal pour ajouter une nouvelle icône */}
        {showAddIcon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-2xl">
              <h3 className="text-xl font-semibold text-white/90 mb-6">Ajouter une nouvelle icône</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Nom</label>
                  <input
                    type="text"
                    value={newIcon.name}
                    onChange={(e) => setNewIcon({ ...newIcon, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    placeholder="Ex: GitHub"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Icône</label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                    {ICON_OPTIONS.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setNewIcon({ ...newIcon, iconName: option.name })}
                        className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                          newIcon.iconName === option.name
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90'
                        }`}
                        title={option.label}
                      >
                        <option.component className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">URL</label>
                  <input
                    type="url"
                    value={newIcon.url}
                    onChange={(e) => setNewIcon({ ...newIcon, url: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tooltip</label>
                  <input
                    type="text"
                    value={newIcon.tooltip}
                    onChange={(e) => setNewIcon({ ...newIcon, tooltip: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    placeholder="Voir mon GitHub"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <ShinyButton
                  onClick={handleAddIcon}
                  disabled={!newIcon.name || !newIcon.url}
                  className="px-4 py-2"
                  style={{
                    "--primary": "rgb(34, 197, 94)",
                    "--glow-color": "rgba(34, 197, 94, 0.5)"
                  } as React.CSSProperties}
                >
                  Ajouter
                </ShinyButton>
                <button
                  onClick={() => setShowAddIcon(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/90 rounded-xl border border-white/20 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour éditer une icône */}
        {editingIcon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-2xl">
              <h3 className="text-xl font-semibold text-white/90 mb-6">Modifier l&apos;icône</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editingIcon.name}
                    onChange={(e) => setEditingIcon({ ...editingIcon, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Icône</label>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                    {ICON_OPTIONS.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => setEditingIcon({ ...editingIcon, iconName: option.name })}
                        className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                          editingIcon.iconName === option.name
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white/90'
                        }`}
                        title={option.label}
                      >
                        <option.component className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">URL</label>
                  <input
                    type="url"
                    value={editingIcon.url}
                    onChange={(e) => setEditingIcon({ ...editingIcon, url: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tooltip</label>
                  <input
                    type="text"
                    value={editingIcon.tooltip}
                    onChange={(e) => setEditingIcon({ ...editingIcon, tooltip: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <ShinyButton
                  onClick={handleUpdateIcon}
                  className="px-4 py-2"
                  style={{
                    "--primary": "rgb(34, 197, 94)",
                    "--glow-color": "rgba(34, 197, 94, 0.5)"
                  } as React.CSSProperties}
                >
                  Sauvegarder
                </ShinyButton>
                <button
                  onClick={() => setEditingIcon(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/90 rounded-xl border border-white/20 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
