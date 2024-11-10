'use client'

export default function ExportLibraryButton() {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/library/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/csv',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `tgd-library-export.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error('Failed to download the CSV.');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <button
      className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      onClick={handleDownload}
      type="button"
    >
      Export Library
    </button>
  );
}
