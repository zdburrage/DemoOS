import { NextResponse } from 'next/server';
import {GeneratePortalLinkIntent, WorkOS} from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function POST() {

    //Replace these variables with your matching audit log schema
    const action = ''
    const userID = ''
    const targetID = ''
    const userType = ''
    const targetType = ''
    try {
        const log = await workos.auditLogs.createEvent(process.env.SSO_ENABLED_ORGANIZATION_ID || '', {
            action: action,
            version: 3,
            occurredAt: new Date(),
            actor: {
                id: userID,
                type: userType
            },
            targets: [{
                id: targetID,
                type: targetType
            }],
            context: {
                location: '123.123.123'
            }
        });
        return NextResponse.json({})
    } catch (error) {
        return NextResponse.json(
            { error: error }, 
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const link = await workos.portal.generateLink({
            intent: GeneratePortalLinkIntent.AuditLogs,
            organization: process.env.SSO_ENABLED_ORGANIZATION_ID || ''
          });

          return NextResponse.json(link);
    } catch (error) {
        return NextResponse.json(
            { error: error }, 
            { status: 500 }
        );
    }
}