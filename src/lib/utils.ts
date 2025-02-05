// ...existing code...

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || isNaN(seconds)) return "N/A";
  
  // Convert to positive number and ensure it's in seconds
  seconds = Math.abs(Math.floor(seconds));
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  // Format with leading zeros and appropriate units
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }
  return `${remainingSeconds}s`;
}

export async function loadImage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    throw error;
  }
}

// ...existing code...
