import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900">
          <FileText className="h-7 w-7 text-white" />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          PDF Chat
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          Upload your documents and ask questions. Get answers with citations
          straight from the source.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button size="lg" className="w-full" onClick={() => navigate('/sign-up')}>
            Get started
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/sign-in')}>
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
