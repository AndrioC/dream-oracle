import DreamForm from '@/components/interpret-dream';

export default function NewDreamPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-card shadow-xl rounded-lg p-8">
        <DreamForm />
      </div>
    </div>
  );
}
