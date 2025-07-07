import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Paper, PaperDownloadProgress } from '../types/papers';

const BASE_URL = 'https://www.roboticsproceedings.org/rss21';

export const generatePaperUrl = (id: number): string => {
  const paddedId = id.toString().padStart(3, '0');
  return `${BASE_URL}/p${paddedId}.pdf`;
};

export const downloadSinglePaper = async (paper: Paper): Promise<void> => {
  try {
    const response = await axios.get(paper.url, {
      responseType: 'blob',
    });
    saveAs(response.data, `RSS2025_${paper.id}.pdf`);
  } catch (error) {
    console.error(`Error downloading paper ${paper.id}:`, error);
    throw error;
  }
};

export const downloadPapers = async (
  papers: Paper[],
  onProgress?: (progress: PaperDownloadProgress) => void
): Promise<void> => {
  const zip = new JSZip();

  for (const paper of papers) {
    try {
      onProgress?.({
        paperId: paper.id,
        progress: 0,
        status: 'downloading',
      });

      const response = await axios.get(paper.url, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const progress = progressEvent.loaded / (progressEvent.total || 1);
          onProgress?.({
            paperId: paper.id,
            progress,
            status: 'downloading',
          });
        },
      });

      zip.file(`RSS2025_${paper.id}.pdf`, response.data);

      onProgress?.({
        paperId: paper.id,
        progress: 1,
        status: 'completed',
      });
    } catch (error) {
      console.error(`Error downloading paper ${paper.id}:`, error);
      onProgress?.({
        paperId: paper.id,
        progress: 0,
        status: 'error',
      });
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'RSS2025_Papers.zip');
};