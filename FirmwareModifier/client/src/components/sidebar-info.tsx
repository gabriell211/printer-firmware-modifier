import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ListChecks, Shield, Clock, File, Check } from "lucide-react";
import type { FirmwareModification } from "@shared/schema";

export function SidebarInfo() {
  const { data: recentModifications } = useQuery<FirmwareModification[]>({
    queryKey: ["/api/firmware/recent"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return days === 1 ? "ontem" : `há ${days} dias`;
    } else if (hours > 0) {
      return hours === 1 ? "há 1 hora" : `há ${hours} horas`;
    } else {
      return "há poucos minutos";
    }
  };

  const getDisplayName = (fileName: string) => {
    // Extract meaningful printer model from filename if possible
    const cleaned = fileName.replace(/\.(bin|hex|fw)$/i, '');
    if (cleaned.toLowerCase().includes('hp')) return 'HP LaserJet Modified';
    if (cleaned.toLowerCase().includes('canon')) return 'Canon Pixma Modified';
    if (cleaned.toLowerCase().includes('epson')) return 'Epson WorkForce Modified';
    if (cleaned.toLowerCase().includes('brother')) return 'Brother Modified';
    return 'Printer Modified';
  };

  return (
    <div className="space-y-6">
      
      {/* Supported Formats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ListChecks className="text-primary mr-2 w-5 h-5" />
            Formatos Suportados
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <File className="text-blue-500 w-4 h-4" />
              <span>.bin - Arquivos binários</span>
            </div>
            <div className="flex items-center space-x-2">
              <File className="text-green-500 w-4 h-4" />
              <span>.hex - Intel HEX format</span>
            </div>
            <div className="flex items-center space-x-2">
              <File className="text-purple-500 w-4 h-4" />
              <span>.fw - Firmware files</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="text-green-500 mr-2 w-5 h-5" />
            Tecnologia Avançada
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Check className="text-green-500 mt-0.5 w-4 h-4 flex-shrink-0" />
              <span>Bypass de segurança multicamada</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="text-green-500 mt-0.5 w-4 h-4 flex-shrink-0" />
              <span>Otimização por fabricante</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="text-green-500 mt-0.5 w-4 h-4 flex-shrink-0" />
              <span>Validação de integridade avançada</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="text-green-500 mt-0.5 w-4 h-4 flex-shrink-0" />
              <span>Compatibilidade universal garantida</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="text-primary mr-2 w-5 h-5" />
            Atividade Recente
          </h3>
          <div className="space-y-3">
            {recentModifications && recentModifications.length > 0 ? (
              recentModifications.map((modification) => (
                <div key={modification.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 text-sm min-w-0">
                    <p className="text-gray-900 font-medium truncate">
                      {getDisplayName(modification.originalFileName)}
                    </p>
                    <p className="text-gray-500">
                      {formatTimeAgo(modification.createdAt.toString())}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
