'use client'

import { useEffect, useState } from "react";

interface Resource {
    resourceId: string;
    resourceType: string;
}

export default function DocumentList() {

    const [documents, setDocuments] = useState<Resource[]>([]);

    useEffect(() => {
        async function fetchDocuments() {
          try {
            const response = await fetch('/api/fga/documents/list');
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || 'Failed to fetch documents');
            }
            
            setDocuments(data.documents);
          } catch (err) {
            console.error('Error fetching organizations:', err);
          } finally {
          }
        }
    
        fetchDocuments();
      }, []);

    return <>
        {documents.map(doc => {

            return (
                <div key={doc.resourceId} className="p-4 border rounded flex w-1/1">
                    <h3 className="text-lg font-semibold mr-2 w-1/3">{doc.resourceId}</h3>

                    <button className="text-white px-4 py-2 rounded m-2 w-1/6">
                        Edit
                    </button>

                    <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 w-1/5">
                        View
                    </button>

                    <button className="bg-red-500 text-white px-4 py-2 rounded m-2 w-1/5">
                        Delete
                    </button>

                </div>
            );
        })}

    </>
}

