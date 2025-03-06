import { Metadata } from 'next';
import { ReactNode } from 'react';

declare module 'next' {
  // Override the default Page type to make it compatible with our async components
  export interface PageProps {
    params?: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
    children?: ReactNode;
  }
}

// Declare module augmentation for Next.js metadata
declare module 'next/types' {
  export interface Metadata {
    title?: string;
    description?: string;
  }
}
