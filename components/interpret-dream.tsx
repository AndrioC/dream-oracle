'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  EyeOffIcon,
  CalendarIcon,
  BrainIcon,
  ImageIcon,
  Loader2,
  MoonIcon,
  InfoIcon,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { imageTypes } from '@/utils/image-types';
import { motion, AnimatePresence } from 'framer-motion';
import { encrypt } from '@/utils/crypto';
import { cn } from '../lib/utils';

interface DreamData {
  title: string;
  description: string;
  date: string;
  isPublic: boolean;
  interpretDream: boolean;
  generateImage: boolean;
  imageType: string;
}

export default function DreamForm() {
  const [formData, setFormData] = useState<DreamData>({
    title: '',
    description: '',
    date: new Date().toISOString(),
    isPublic: false,
    interpretDream: false,
    generateImage: false,
    imageType: 'abstrato',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const createDreamMutation = useMutation({
    mutationFn: (dreamData: DreamData) =>
      axios.post('/api/dreams/create-dream', dreamData),
    onMutate: () => setIsModalOpen(true),
    onSuccess: (response) => {
      const { dream, creditsUsed, interpretation, imageGenerated } =
        response.data;
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      setIsModalOpen(false);

      let message = `Sonho criado com sucesso! ${creditsUsed} crédito(s) usado(s).`;
      if (interpretation) message += ' Interpretação gerada.';
      if (imageGenerated) message += ' Imagem gerada.';

      toast.success(message, { autoClose: 5000, position: 'top-center' });
      router.push(`/dreams/${encrypt(String(dream.id))}`);
    },
    onError: (error: Error | AxiosError) => {
      console.error('Falha ao salvar o sonho', error);
      setIsModalOpen(false);
      const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.error
          : 'Erro ao criar sonho';
      toast.error(errorMessage, { autoClose: 5000, position: 'top-center' });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) setFormData((prev) => ({ ...prev, date: date.toISOString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDreamMutation.mutate(formData);
  };

  const isFormValid = useMemo(() => {
    const { title, description, interpretDream, generateImage } = formData;
    return (
      title.trim() !== '' &&
      description.trim() !== '' &&
      (interpretDream || generateImage)
    );
  }, [formData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4 sm:px-6 lg:px-8"
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-8 bg-card rounded-xl shadow-lg p-8 border border-border"
      >
        <div className="text-center">
          <MoonIcon className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-extrabold text-foreground">
            Registre seu Sonho
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Descreva seu sonho e deixe-nos interpretá-lo para você
          </p>
        </div>

        <InputField
          id="title"
          label="Título do Sonho"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: Voando sobre as nuvens"
        />

        <TextareaField
          id="description"
          label="Descrição do Sonho"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descreva seu sonho em detalhes. Quanto mais informações você fornecer, melhor será a interpretação."
        />

        <DatePicker
          date={new Date(formData.date)}
          onSelect={handleDateChange}
        />

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              Visibilidade do Sonho
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0"
                    type="button"
                    onClick={() => setIsVisibilityDialogOpen(true)}
                  >
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique para mais informações sobre visibilidade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ToggleSwitch
            checked={formData.isPublic}
            onCheckedChange={handleCheckboxChange('isPublic')}
            label={formData.isPublic ? 'Público' : 'Privado'}
            icon={
              formData.isPublic ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )
            }
          />
        </div>

        <div className="space-y-4 bg-muted p-6 rounded-lg">
          <CheckboxField
            id="interpretDream"
            label="Interpretar sonho"
            subLabel="Use 1 crédito para obter uma interpretação detalhada"
            checked={formData.interpretDream}
            onChange={handleCheckboxChange('interpretDream')}
            icon={<BrainIcon className="h-5 w-5 text-primary" />}
          />

          <CheckboxField
            id="generateImage"
            label="Gerar imagem"
            subLabel="Use 1 crédito para criar uma representação visual do seu sonho"
            checked={formData.generateImage}
            onChange={handleCheckboxChange('generateImage')}
            icon={<ImageIcon className="h-5 w-5 text-primary" />}
          />
          <AnimatePresence>
            {formData.generateImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ImageTypeSelect
                  value={formData.imageType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, imageType: value }))
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all duration-300 ease-in-out text-lg rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 bg-blue-600 hover:bg-blue-800"
          disabled={!isFormValid || createDreamMutation.isPending}
        >
          {createDreamMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Salvando Sonho...
            </>
          ) : (
            'Registrar Sonho'
          )}
        </Button>
      </form>

      <ProcessingModal
        isOpen={isModalOpen}
        interpretDream={formData.interpretDream}
        generateImage={formData.generateImage}
      />

      <Dialog
        open={isVisibilityDialogOpen}
        onOpenChange={setIsVisibilityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visibilidade do Sonho</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2">Sonho Privado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Apenas você terá acesso a este sonho. Ele não será visível para
              outros usuários ou no mural público.
            </p>
            <h3 className="text-lg font-semibold mb-2">Sonho Público</h3>
            <p className="text-sm text-muted-foreground">
              Este sonho será postado no seu mural e todos os usuários terão
              acesso a ele. É uma ótima maneira de compartilhar suas
              experiências oníricas com a comunidade.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 border border-input bg-background text-foreground rounded-lg focus:border-primary focus:outline-none transition duration-200 ease-in-out"
        placeholder={placeholder}
      />
    </div>
  );
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-2"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        rows={6}
        className="w-full p-3 border border-input bg-background text-foreground rounded-lg focus:border-primary focus:outline-none transition duration-200 ease-in-out"
        placeholder={placeholder}
      />
    </div>
  );
}

function DatePicker({
  date,
  onSelect,
}: {
  date: Date;
  onSelect: (date: Date | undefined) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Data do Sonho
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, 'PPP', { locale: ptBR })
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-card" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ImageTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <label
        htmlFor="imageType"
        className="block text-sm font-medium text-foreground mb-2"
      >
        Estilo da Imagem
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Escolha o estilo da imagem" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(imageTypes).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ProcessingModal({
  isOpen,
  interpretDream,
  generateImage,
}: {
  isOpen: boolean;
  interpretDream: boolean;
  generateImage: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card p-8 rounded-xl shadow-xl max-w-md w-full border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Processando seu Sonho
            </h2>
            <div className="space-y-6">
              {interpretDream && (
                <div className="flex items-center space-x-4 bg-muted p-4 rounded-lg">
                  <Loader2 className="animate-spin h-6 w-6 text-primary" />
                  <p className="text-foreground">Interpretando o sonho...</p>
                </div>
              )}
              {generateImage && (
                <div className="flex items-center space-x-4 bg-muted p-4 rounded-lg">
                  <Loader2 className="animate-spin h-6 w-6 text-primary" />
                  <p className="text-foreground">Gerando imagem do sonho...</p>
                </div>
              )}
            </div>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              Por favor, aguarde enquanto processamos seu sonho. Isso pode levar
              alguns instantes.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleSwitch({
  checked,
  onCheckedChange,
  label,
  icon,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => onCheckedChange(!checked)}
        />
        <div
          className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${
            checked ? 'bg-blue-500' : 'bg-white border border-gray-300'
          }`}
        />
        <div
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${
            checked
              ? 'transform translate-x-full border-blue-500'
              : 'border-gray-300'
          } border`}
        />
      </div>
      <div className="ml-3 flex items-center">
        {icon}
        <span className="ml-2 text-sm font-medium text-foreground">
          {label}
        </span>
      </div>
    </label>
  );
}

function CheckboxField({
  id,
  label,
  subLabel,
  checked,
  onChange,
  icon,
}: {
  id: string;
  label: string;
  subLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500 appearance-none checked:bg-blue-500 transition-colors duration-200 ease-in-out bg-white cursor-pointer"
        />
      </div>
      <div className="flex-grow">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground flex items-center cursor-pointer"
        >
          {label}
          <span className="ml-2">{icon}</span>
        </label>
        <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
      </div>
    </div>
  );
}
