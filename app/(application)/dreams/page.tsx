import DreamUserFeedContainer from '@/components/dream-user-feed-container';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <DreamUserFeedContainer />
      </main>
    </div>
  );
}
