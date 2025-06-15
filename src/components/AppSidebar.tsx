
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
    console.log(`Action: ${action}`);
  };

  return (
    <Sidebar className="border-r border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
      <SidebarHeader className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-white">StockHub</h2>
              <p className="text-xs text-gray-400">Pro Analytics</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive(item.url)
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <item.icon 
                        className={`h-5 w-5 transition-transform duration-200 ${
                          isActive(item.url) ? 'scale-110' : 'group-hover:scale-105'
                        }`} 
                      />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                      {isActive(item.url) && !isCollapsed && (
                        <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            Actions Rapides
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleQuickAction(action.action)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        activeAction === action.action
                          ? 'bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 text-emerald-400 scale-95'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <action.icon 
                        className={`h-5 w-5 transition-all duration-200 ${
                          activeAction === action.action ? 'scale-110 rotate-12' : 'group-hover:scale-105'
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

      <SidebarFooter className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">Paramètres</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
