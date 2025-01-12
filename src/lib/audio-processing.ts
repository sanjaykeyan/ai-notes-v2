export async function processAudio(audioFile: File) {
    const formData = new FormData();
    formData.append('file', audioFile);
  
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
  
    if (!response.ok) {
      throw new Error('Audio processing failed');
    }
  
    return response.json();
  }