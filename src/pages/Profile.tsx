import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { BeachCard } from '@/components/beach/BeachCard';
import { beaches } from '@/data/mockBeaches';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Star,
  Bell,
  History,
  Settings,
  LogIn,
  LogOut,
  Mail,
  Lock,
  UserPlus,
} from 'lucide-react';

type TabType = 'favorites' | 'notifications' | 'history' | 'settings';
type AuthMode = 'login' | 'signup';

const Profile = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  const favoriteIds = ['1', '3', '5'];
  const favoriteBeaches = beaches.filter((b) => favoriteIds.includes(b.id));
  const historyBeaches = beaches.slice(0, 4);

  const [notifications, setNotifications] = useState({
    favorites: true,
    alerts: true,
    weather: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada com sucesso!');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Você saiu da sua conta');
  };

  const tabs = [
    { id: 'favorites' as TabType, icon: Star, label: 'Favoritos' },
    { id: 'notifications' as TabType, icon: Bell, label: 'Alertas' },
    { id: 'history' as TabType, icon: History, label: 'Histórico' },
    { id: 'settings' as TabType, icon: Settings, label: 'Config' },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="p-4 max-w-md mx-auto">
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-gradient-ocean flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Bem-vindo ao Orla
            </h1>
            <p className="text-muted-foreground mb-6">
              {authMode === 'login' 
                ? 'Faça login para salvar suas praias favoritas e receber alertas personalizados.'
                : 'Crie sua conta para curtir praias e receber alertas personalizados.'}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {authMode === 'login' ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Criar Conta
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Aguarde...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
                </Button>
              </form>

              <Separator className="my-4" />

              <p className="text-center text-sm text-muted-foreground">
                {authMode === 'login' ? (
                  <>
                    Não tem conta?{' '}
                    <button
                      className="text-primary font-medium hover:underline"
                      onClick={() => setAuthMode('signup')}
                    >
                      Criar conta
                    </button>
                  </>
                ) : (
                  <>
                    Já tem conta?{' '}
                    <button
                      className="text-primary font-medium hover:underline"
                      onClick={() => setAuthMode('login')}
                    >
                      Fazer login
                    </button>
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-2">
              Benefícios de criar conta:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-status-warning" />
                Curta suas praias favoritas
              </li>
              <li className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Receba alertas personalizados
              </li>
              <li className="flex items-center gap-2">
                <History className="w-4 h-4 text-ocean-medium" />
                Acesse seu histórico de consultas
              </li>
            </ul>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4">
        {/* User Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-ocean flex items-center justify-center">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {user.user_metadata?.display_name || user.email?.split('@')[0]}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map(({ id, icon: Icon, label }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'outline'}
              size="sm"
              className="shrink-0"
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'favorites' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Praias Favoritas ({favoriteBeaches.length})
            </h2>
            {favoriteBeaches.map((beach) => (
              <BeachCard key={beach.id} beach={beach} isFavorite />
            ))}
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Configurar Alertas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Praias Favoritas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alertas quando o status mudar
                  </p>
                </div>
                <Switch
                  checked={notifications.favorites}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, favorites: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Alertas de Emergência
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Situações críticas de balneabilidade
                  </p>
                </div>
                <Switch
                  checked={notifications.alerts}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, alerts: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Previsão do Tempo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Alertas de chuvas e condições adversas
                  </p>
                </div>
                <Switch
                  checked={notifications.weather}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, weather: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Praias Consultadas Recentemente
            </h2>
            {historyBeaches.map((beach) => (
              <BeachCard key={beach.id} beach={beach} compact />
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sobre o App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Orla v1.0.0
                  <br />
                  Monitoramento de balneabilidade das praias do Recife.
                  <br />
                  <br />
                  Dados fornecidos pela CPRH - Agência Estadual de Meio
                  Ambiente.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
