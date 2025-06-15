
import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full dark-gradient flex relative overflow-hidden">
        {/* Effets de fond modernes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Orbes flottants bleus */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-float-modern"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-modern" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/8 rounded-full blur-3xl animate-float-modern" style={{ animationDelay: '4s' }}></div>
          
          {/* Lignes de grille subtiles */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        <AppSidebar />
        
        <SidebarInset className="flex-1 relative">
          <main className="flex-1 relative z-10 min-h-screen">
            <div className="relative">
              {/* Effet de lueur en haut */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
