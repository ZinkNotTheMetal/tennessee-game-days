'use client'; // Ensure this is a client-side component

interface ExportAttendeesButtonProps {
  conventionId: number;
}

export default function ExportAttendeesButton({ conventionId }: ExportAttendeesButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/attendee/export/${conventionId}`, {
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
        link.setAttribute('download', `tgd-${conventionId}-attendees-export.csv`);
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
      className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
      onClick={handleDownload}
      type="button"
    >
      Export Attendees
    </button>
  );
}
