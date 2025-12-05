import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PlantButton from './PlantButton';

const APIDocumentationSection = () => {
  const router = useRouter();
  const [btnHover, setBtnHover] = useState(false);

  return (
    <Card className="p-8 rounded-2xl shadow-md border border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
          <FileText className="h-8 w-8 text-primary" />
        </div>

        <CardTitle
          className={`text-2xl font-semibold transition-colors duration-200 ${
            btnHover ? 'text-white dark:text-transparent' : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          API Documentation
        </CardTitle>

        <CardDescription
          className={`text-base transition-colors duration-200 ${
            btnHover ? 'text-white/90 dark:text-transparent' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Explore the full documentation to learn how to integrate and use our APIs in your applications.
          Read our API docs to integrate Intervyu AI features into your app.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-center">
        {/* wrapper listens for hover so PlantButton implementation details don't matter */}
        <div
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          className="rounded-md"
          // keep pointer-events enabled
        >
          {/* If PlantButton accepts className/onMouse handlers, you can forward them too */}
          <PlantButton
            onClick={() => router.push('/docs/v1/quickstart')}
            // ensure the rendered element is focusable/clickable
            className="outline-none"
          >
            <p className='text-black'>View Documentation</p>
          </PlantButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIDocumentationSection;
