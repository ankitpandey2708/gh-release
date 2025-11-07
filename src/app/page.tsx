import RepositoryInput from "@/components/RepositoryInput";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-20 px-16 bg-white dark:bg-black">
        <div className="w-full text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            GitHub Release Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Analyze GitHub repositories and track their release patterns. Enter a repository name below to get started.
          </p>
        </div>
        
        <RepositoryInput />
      </main>
    </div>
  );
}
