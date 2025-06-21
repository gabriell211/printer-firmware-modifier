import { useState } from "react";
import { ProcessSteps } from "@/components/process-steps";
import { FileUpload } from "@/components/file-upload";
import { FirmwareProcessor } from "@/components/firmware-processor";
import { SidebarInfo } from "@/components/sidebar-info";
import { Microchip, Shield, HelpCircle } from "lucide-react";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [modificationId, setModificationId] = useState<number | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep(2);
  };

  const handleSerialNumberChange = (serial: string) => {
    setSerialNumber(serial);
  };

  const handleProcessingStart = (id: number) => {
    setModificationId(id);
    setCurrentStep(3);
  };

  const handleProcessingComplete = () => {
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Microchip className="text-primary-foreground text-xl w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Printer Firmware Modifier</h1>
                <p className="text-sm text-gray-500">Modificador Universal de Firmware</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="inline w-4 h-4 mr-1" />
                Seguro
              </span>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Process Steps */}
        <ProcessSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Workflow */}
          <div className="lg:col-span-2 space-y-6">
            <FirmwareProcessor
              onFileUpload={handleFileUpload}
              onSerialNumberChange={handleSerialNumberChange}
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
              uploadedFile={uploadedFile}
              serialNumber={serialNumber}
              modificationId={modificationId}
              currentStep={currentStep}
            />
          </div>

          {/* Sidebar */}
          <SidebarInfo />
        </div>

        {/* Advanced Features Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Tecnologia de Modificação Avançada</h3>
              <p className="text-blue-100">
                Sistema de bypass multicamada com 100% de eficácia garantida para todas as marcas
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-blue-200">Taxa de Sucesso</div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="text-primary mr-2 w-5 h-5" />
            Capacidades Técnicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Garantias de Eficácia:</h4>
              <ul className="space-y-1">
                <li>• 100% de remoção de restrições OEM</li>
                <li>• Bypass de todas as verificações de autenticidade</li>
                <li>• Compatibilidade universal com qualquer toner</li>
                <li>• Otimização específica por fabricante</li>
                <li>• Validação completa de integridade</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Compatibilidade Total:</h4>
              <ul className="space-y-1">
                <li>• HP LaserJet e OfficeJet (todas as séries)</li>
                <li>• Canon PIXMA e imageCLASS</li>
                <li>• Epson WorkForce e EcoTank</li>
                <li>• Brother DCP e MFC</li>
                <li>• Samsung e Lexmark (todos os modelos)</li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">© 2024 Printer Firmware Modifier</p>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Termos de Uso</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Privacidade</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Suporte técnico:</span>
              <a href="mailto:support@firmwaremod.com" className="text-sm text-primary hover:text-primary/80 transition-colors">
                support@firmwaremod.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
