

'use client'

import { AuditLogExport, AuditLogExportResponse } from "@workos-inc/node";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function AuditLogs() {

    const [link, setAuditLogsLink] = useState<any | null>(null);

    const generateAuditLog = async () => {
        try {
            const response = await fetch('/api/audit-log', {
                method: 'POST',
            });
            const data = await response.json();
            console.log('Audit log created:', data);
        } catch (error) {
            console.error('Error generating audit log:', error);
        }
    };

    const auditLogsLink = async () => {
        try {
            const response = await fetch('/api/audit-log', {
                method: 'GET',
            });
            const returnedLink = await response.json();
            console.log(returnedLink)
            setAuditLogsLink(returnedLink);

        } catch (error) {
            console.error('Error generating audit log link:', error);
        }
    }

    useEffect(() => {
        auditLogsLink();
    }, []);

    return (
      <main>
        <div>
          <img src="./favicon.ico" className='object-contain h-48 w-96 m-4 justify-self-center'></img>
          <h1>WorkOS Examples</h1>
          <ul>
            <li>
              <button onClick={generateAuditLog}>Generate Sample Audit Log</button>
            </li>
            {link && (
                <Link target="_blank" href={link.link}>
                    View Generated Audit Logs
                </Link>
            )}
          </ul>
        </div>
      </main>
    );
  }