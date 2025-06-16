
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  Settings, 
  Home,
  Plus,
  Search,
  Bell
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const mainNavItems = [
  { title: 'Tableau de bord', url: '/', icon: Home },
  { title: 'Produits', url: '/products', icon: Package },
  { title: 'Analyses', url: '/analytics', icon: BarChart3 },
  { title: 'Tendances', url: '/trends', icon: TrendingUp },
];

const quickActions = [
  { title: 'Ajouter Produit', icon: Plus, action: 'add-product' },
  { title: 'Rechercher', icon: Search, action: 'search' },
  { title: 'Alertes', icon: Bell, action: 'alerts' },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === 'collapsed';

  const handleQuickAction = (action: string) => {
    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 300);
    
    // Logique pour les actions rapides
    switch(action) {
      case 'add-product':
        // Rediriger vers la page produits avec action d'ajout
        window.location.href = '/products?action=add';
        break;
      case 'search':
        // Focus sur la barre de recherche
        const searchInput = document.querySelector('input[placeholder*="recherche"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        break;
      case 'alerts':
        console.log('Ouverture des alertes...');
        break;
    }
  };

  return (
    <Sidebar className="border-r border-blue-500/20 bg-black/95 backdrop-blur-2xl">
      <SidebarHeader className="p-6 border-b border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl animate-pulse-blue">
            <TrendingUp className="h-7 w-7 text-white" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl"></div>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-2xl font-bold text-white modern-heading">StockHub</h2>
              <p className="text-sm text-blue-300/70 font-medium">Analytics Pro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-300/80 text-xs uppercase tracking-wider font-semibold mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {mainNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        isActive(item.url)
                          ? 'bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white border border-blue-400/50 shadow-lg shadow-blue-500/25 scale-105'
                          : 'text-blue-200/80 hover:bg-blue-500/10 hover:text-white hover:scale-102 border border-transparent hover:border-blue-500/30'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Effet de brillance au survol */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <item.icon 
                        className={`h-6 w-6 transition-all duration-300 relative z-10 ${
                          isActive(item.url) ? 'text-white scale-110' : 'group-hover:text-blue-300 group-hover:scale-110'
                        }`} 
                      />
                      {!isCollapsed && (
                        <span className="font-semibold relative z-10">{item.title}</span>
                      )}
                      {isActive(item.url) && !isCollapsed && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse relative z-10" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-10">
          <SidebarGroupLabel className="text-blue-300/80 text-xs uppercase tracking-wider font-semibold mb-4">
            Actions Rapides
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleQuickAction(action.action)}
                      className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        activeAction === action.action
                          ? 'bg-gradient-to-r from-blue-500/60 to-blue-600/60 text-white scale-95 shadow-lg border border-blue-400/50'
                          : 'text-blue-200/70 hover:bg-blue-500/10 hover:text-white hover:scale-102 border border-transparent hover:border-blue-500/20'
                      }`}
                    >
                      <action.icon 
                        className={`h-5 w-5 transition-all duration-300 ${
                          activeAction === action.action ? 'text-white scale-110 rotate-12' : 'group-hover:text-blue-300 group-hover:scale-110'
                        }`} 
                      />
                      {!isCollapsed && (
                        <span className="font-medium">{action.title}</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-blue-500/20">
        <div className="group flex items-center gap-4 hover-lift rounded-xl p-3 transition-all duration-300 border border-transparent hover:border-blue-500/30">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center relative">
            <Settings className="h-5 w-5 text-white" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-blue-300/70">Paramètres système</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
