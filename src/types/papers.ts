export interface Category {
  category: string;
  id_range: [number, number];
}

export interface Paper {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface PaperDownloadProgress {
  paperId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
}