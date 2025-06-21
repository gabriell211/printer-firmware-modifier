import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileUpload } from "./file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Hash, Settings, Download, Clock, CheckCircle, Play, Loader2, AlertTriangle, Info } from "lucide-react";
import type { FirmwareModification } from "@shared/schema";

interface FirmwareProcessorProps {
  onFileUpload: (file: File) => void;
  onSerialNumberChange: (serial: string) => void;
  onProcessingStart: (id: number) => void;
  onProcessingComplete: () => void;
  uploadedFile: File | null;
  serialNumber: string;
  modificationId: number | null;
  currentStep: number;
}

export function FirmwareProcessor({
  onFileUpload,
  onSerialNumberChange,
  onProcessingStart,
  onProcessingComplete,
  uploadedFile,
  serialNumber,
  modificationId,
  currentStep,
}: FirmwareProcessorProps) {
  const { toast } = useToast();
  const [localSerialNumber, setLocalSerialNumber] = useState(serialNumber);

  const handleRemoveFile = () => {
    window.location.reload(); // Simple way to reset state
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, serial }: { file: File; serial: string }) => {
      const formData = new FormData();
      formData.append('firmware', file);
      formData.append('serialNumber', serial);
      
      const response = await fetch('/api/firmware/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data: FirmwareModification) => {
      toast({
        title: "Upload realizado com sucesso",
        description: "Firmware enviado e processamento iniciado.",
      });
      onProcessingStart(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: modification, isLoading: isLoadingModification } = useQuery({
    queryKey: [`/api/firmware/${modificationId}`],
    enabled: !!modificationId,
    refetchInterval: modificationId && currentStep === 3 ? 1000 : false,
  });

  useEffect(() => {
    if (modification?.status === "completed" && currentStep === 3) {
      onProcessingComplete();
      toast({
        title: "Processamento concluído",
        description: "Firmware modificado com sucesso!",
      });
    } else if (modification?.status === "failed") {
      toast({
        title: "Erro no processamento",
        description: modification.errorMessage || "Falha no processamento do firmware",
        variant: "destructive",
      });
    }
  }, [modification, currentStep, onProcessingComplete, toast]);

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSerialNumber(value);
    onSerialNumberChange(value);
  };

  const handleProcess = () => {
    if (uploadedFile && localSerialNumber.trim()) {
      uploadMutation.mutate({ file: uploadedFile, serial: localSerialNumber.trim() });
    }
  };

  const handleDownload = async () => {
    if (!modificationId) return;
    
    try {
      const response = await fetch(`/api/firmware/${modificationId}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `modified_${uploadedFile?.name || 'firmware.bin'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download iniciado",
        description: "O firmware modificado está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Falha ao baixar o firmware modificado",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* File Upload */}
      <FileUpload
        onFileUpload={onFileUpload}
        uploadedFile={uploadedFile}
        onRemoveFile={handleRemoveFile}
      />

      {/* Serial Number Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Hash className="text-primary text-lg" />
            <h2 className="text-lg font-semibold text-gray-900">2. Número Serial da Impressora</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <Input
                id="serialNumber"
                type="text"
                placeholder="Ex: HP123456789, CN123456789"
                value={localSerialNumber}
                onChange={handleSerialChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                <Info className="inline w-4 h-4 mr-1" />
                Digite o número serial exato da impressora para garantir compatibilidade
              </p>
            </div>
            
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <AlertDescription className="text-yellow-800">
                <p className="font-medium">Importante</p>
                <p className="mt-1">
                  O serial deve corresponder exatamente ao da impressora. Números incorretos podem causar mau funcionamento.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Processing */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="text-primary text-lg" />
            <h2 className="text-lg font-semibold text-gray-900">3. Processamento</h2>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleProcess}
              disabled={!uploadedFile || !localSerialNumber.trim() || uploadMutation.isPending}
              className="w-full"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando processamento...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar Modificação do Firmware
                </>
              )}
            </Button>

            {/* Processing Status */}
            {modification && modification.status === "processing" && (
              <Alert className="bg-blue-50 border-blue-200">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-900">Processando firmware...</span>
                      <span className="text-sm text-blue-600">{modification.progress}%</span>
                    </div>
                    <Progress value={modification.progress} className="w-full" />
                    <p className="text-sm text-blue-600">
                      {modification.progress < 10 && "Analisando estrutura do firmware..."}
                      {modification.progress >= 10 && modification.progress < 20 && "Identificando assinaturas de segurança..."}
                      {modification.progress >= 20 && modification.progress < 30 && "Mapeando tabelas de verificação..."}
                      {modification.progress >= 30 && modification.progress < 40 && "Localizando restrições de toner OEM..."}
                      {modification.progress >= 40 && modification.progress < 50 && "Desabilitando verificações de autenticidade..."}
                      {modification.progress >= 50 && modification.progress < 60 && "Neutralizando contadores de toner..."}
                      {modification.progress >= 60 && modification.progress < 70 && "Removendo limitações de chip..."}
                      {modification.progress >= 70 && modification.progress < 80 && "Aplicando patches de compatibilidade universal..."}
                      {modification.progress >= 80 && modification.progress < 90 && "Recalculando checksums de segurança..."}
                      {modification.progress >= 90 && modification.progress < 95 && "Validando integridade do firmware..."}
                      {modification.progress >= 95 && "Finalizando e otimizando..."}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Download className="text-primary text-lg" />
            <h2 className="text-lg font-semibold text-gray-900">4. Download do Firmware Modificado</h2>
          </div>
          
          {modification?.status === "completed" ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <AlertDescription>
                  <div>
                    <p className="font-medium text-green-900">Firmware modificado com sucesso!</p>
                    <p className="text-sm text-green-700">Pronto para download e instalação</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button onClick={handleDownload} className="w-full bg-green-500 hover:bg-green-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download Firmware Modificado
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto h-12 w-12 mb-3" />
              <p>Aguardando processamento do firmware</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
