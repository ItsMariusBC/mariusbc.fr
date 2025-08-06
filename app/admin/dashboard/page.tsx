'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from '@/lib/auth-client';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { 
  Settings, 
  LogOut, 
  Save, 
  Plus, 
  Edit, 
  Trash2,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Twitch,
  MessageCircle,
  Music,
  Globe,
  Download,
  Code,
  Briefcase,
  User,
  MapPin,
  Calendar,
  Camera,
  Video,
  Gamepad2,
  Coffee,
  Heart,
  Star,
  Award,
  BookOpen,
  Headphones,
  Terminal,
  Cpu,
  Palette,
  Zap,
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Cloud,
  Rocket
} from 'lucide-react';
import type { DockIcon, SiteConfig } from '@prisma/client';

// Icon mapping pour l'admin
const IconMap: Record<string, React.ComponentType<any>> = {
  Github,
  Linkedin,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Twitch,
  MessageCircle,
  Music,
  Globe,
  Download,
  Code,
  Briefcase,
  User,
  MapPin,
  Calendar,
  Camera,
  Video,
  Gamepad2,
  Coffee,
  Heart,
  Star,
  Award,
  BookOpen,
  Headphones,
  Terminal,
  Cpu,
  Palette,
  Zap,
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Cloud,
  Rocket,
};

const iconOptions = [
  { name: 'Github', component: Github, label: 'GitHub' },
  { name: 'Linkedin', component: Linkedin, label: 'LinkedIn' },
  { name: 'Instagram', component: Instagram, label: 'Instagram' },
  { name: 'Twitter', component: Twitter, label: 'Twitter/X' },
  { name: 'Facebook', component: Facebook, label: 'Facebook' },
  { name: 'Youtube', component: Youtube, label: 'YouTube' },
  { name: 'Twitch', component: Twitch, label: 'Twitch' },
  { name: 'MessageCircle', component: MessageCircle, label: 'Discord/Chat' },
  { name: 'Music', component: Music, label: 'Spotify/Musique' },
  { name: 'Mail', component: Mail, label: 'Email' },
  { name: 'Phone', component: Phone, label: 'Téléphone' },
  { name: 'MessageSquare', component: MessageSquare, label: 'Message' },
  { name: 'Globe', component: Globe, label: 'Site Web' },
  { name: 'FileText', component: FileText, label: 'CV/Document' },
  { name: 'Download', component: Download, label: 'Téléchargement' },
  { name: 'Code', component: Code, label: 'Code/Portfolio' },
  { name: 'Briefcase', component: Briefcase, label: 'Travail' },
  { name: 'User', component: User, label: 'Profil' },
  { name: 'MapPin', component: MapPin, label: 'Localisation' },
  { name: 'Calendar', component: Calendar, label: 'Calendrier' },
  { name: 'Camera', component: Camera, label: 'Photo' },
  { name: 'Music', component: Music, label: 'Musique' },
  { name: 'Video', component: Video, label: 'Vidéo' },
  { name: 'Gamepad2', component: Gamepad2, label: 'Gaming' },
  { name: 'Coffee', component: Coffee, label: 'Café/Blog' },
  { name: 'Heart', component: Heart, label: 'Favoris' },
  { name: 'Star', component: Star, label: 'Étoile' },
  { name: 'Award', component: Award, label: 'Récompense' },
  { name: 'BookOpen', component: BookOpen, label: 'Livre/Blog' },
  { name: 'Headphones', component: Headphones, label: 'Audio' },
  { name: 'Terminal', component: Terminal, label: 'Terminal' },
  { name: 'Cpu', component: Cpu, label: 'Tech/Hardware' },
  { name: 'Palette', component: Palette, label: 'Design/Art' },
  { name: 'Zap', component: Zap, label: 'Énergie/Rapide' },
  { name: 'Shield', component: Shield, label: 'Sécurité' },
  { name: 'Lock', component: Lock, label: 'Privé' },
  { name: 'Key', component: Key, label: 'Accès' },
  { name: 'Database', component: Database, label: 'Base de données' },
  { name: 'Server', component: Server, label: 'Serveur' },
  { name: 'Cloud', component: Cloud, label: 'Cloud' },
  { name: 'Rocket', component: Rocket, label: 'Lancement/Startup' },
];

// Fonction pour extraire le domaine d'une URL
const getDomainFromUrl = (url: string): string => {
  try {
    if (url.startsWith('mailto:')) {
      return url.replace('mailto:', '');
    }
    if (url.startsWith('tel:')) {
      return url.replace('tel:', '');
    }
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

export default function AdminDashboard() {
  const { data: session, isPending } = useSession();
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
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [configResponse, iconsResponse] = await Promise.all([
          fetch('/api/site-config'),
          fetch('/api/dock-icons?include_inactive=true')
        ]);
        
        const configData = await configResponse.json();
        const iconsData = await iconsResponse.json();
        
        setSiteConfig(configData);
        setContactUrl(configData?.contactButtonUrl || '');
        setDockIcons(iconsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      loadData();
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center">
        <div className="text-white/90 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/admin');
    return null;
  }

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactButtonUrl: contactUrl })
      });
      alert('Configuration sauvegardée !');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIcon = async (iconData: typeof newIcon) => {
    try {
      if (editingIcon) {
        await fetch(`/api/dock-icons/${editingIcon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(iconData)
        });
      } else {
        await fetch('/api/dock-icons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(iconData)
        });
      }
      
      // Recharger les données
      const response = await fetch('/api/dock-icons?include_inactive=true');
      const iconsData = await response.json();
      setDockIcons(iconsData);
      
      setEditingIcon(null);
      setShowAddIcon(false);
      setNewIcon({ name: '', iconName: 'Mail', url: '', tooltip: '' });
    } catch (error) {
      console.error('Error saving icon:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteIcon = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette icône ?')) {
      try {
        await fetch(`/api/dock-icons/${id}`, { method: 'DELETE' });
        const response = await fetch('/api/dock-icons?include_inactive=true');
        const iconsData = await response.json();
        setDockIcons(iconsData);
      } catch (error) {
        console.error('Error deleting icon:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleIcon = async (icon: DockIcon) => {
    try {
      await fetch(`/api/dock-icons/${icon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !icon.isActive })
      });
      const response = await fetch('/api/dock-icons?include_inactive=true');
      const iconsData = await response.json();
      setDockIcons(iconsData);
    } catch (error) {
      console.error('Error toggling icon:', error);
      alert('Erreur lors de la modification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] flex items-center justify-center">
        <div className="text-white/90 text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1116] via-[#1a1b26] to-[#0f1116] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_65%)]" />
      
      <div className="relative max-w-6xl mx-auto">
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
            onClick={() => signOut()}
            className="px-4 py-2"
            style={{
              "--primary": "rgb(239, 68, 68)",
              "--glow-color": "rgba(239, 68, 68, 0.5)"
            } as React.CSSProperties}
          >
            <span className="flex items-center gap-2">
              Déconnexion
              <LogOut className="w-4 h-4" />
            </span>
          </ShinyButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration du site */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white/90 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration du site
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  URL du bouton "Me contacter"
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

          {/* Gestion des icônes du dock */}
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
                const IconComponent = IconMap[icon.iconName] || Mail;
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

        {/* Modal d'ajout/édition d'icône */}
        {(showAddIcon || editingIcon) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white/90 mb-4">
                {editingIcon ? 'Modifier l\'icône' : 'Ajouter une icône'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Nom</label>
                  <input
                    type="text"
                    value={editingIcon ? editingIcon.name : newIcon.name}
                    onChange={(e) => {
                      if (editingIcon) {
                        setEditingIcon({ ...editingIcon, name: e.target.value });
                      } else {
                        setNewIcon({ ...newIcon, name: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="GitHub"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Icône</label>
                  <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 border border-white/20 rounded-xl">
                    {iconOptions.map((option) => {
                      const IconComponent = option.component;
                      const isSelected = (editingIcon ? editingIcon.iconName : newIcon.iconName) === option.name;
                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => {
                            if (editingIcon) {
                              setEditingIcon({ ...editingIcon, iconName: option.name });
                            } else {
                              setNewIcon({ ...newIcon, iconName: option.name });
                            }
                          }}
                          className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                            isSelected 
                              ? 'bg-purple-500/30 border border-purple-500/50 text-white' 
                              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white/90'
                          }`}
                          title={option.label}
                        >
                          <IconComponent className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">URL</label>
                  <input
                    type="text"
                    value={editingIcon ? editingIcon.url : newIcon.url}
                    onChange={(e) => {
                      if (editingIcon) {
                        setEditingIcon({ ...editingIcon, url: e.target.value });
                      } else {
                        setNewIcon({ ...newIcon, url: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://github.com/username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tooltip</label>
                  <input
                    type="text"
                    value={editingIcon ? editingIcon.tooltip : newIcon.tooltip}
                    onChange={(e) => {
                      if (editingIcon) {
                        setEditingIcon({ ...editingIcon, tooltip: e.target.value });
                      } else {
                        setNewIcon({ ...newIcon, tooltip: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="GitHub"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <ShinyButton
                  onClick={() => {
                    setEditingIcon(null);
                    setShowAddIcon(false);
                    setNewIcon({ name: '', iconName: 'Mail', url: '', tooltip: '' });
                  }}
                  className="flex-1 py-2 text-sm"
                  style={{
                    "--primary": "rgb(107, 114, 128)",
                    "--glow-color": "rgba(107, 114, 128, 0.5)"
                  } as React.CSSProperties}
                >
                  Annuler
                </ShinyButton>
                
                <ShinyButton
                  onClick={() => handleSaveIcon(editingIcon || newIcon)}
                  className="flex-1 py-2 text-sm"
                  style={{
                    "--primary": "rgb(34, 197, 94)",
                    "--glow-color": "rgba(34, 197, 94, 0.5)"
                  } as React.CSSProperties}
                >
                  Sauvegarder
                </ShinyButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}