import { NextResponse } from 'next/server';
import { WorkOS, GeneratePortalLinkIntent} from '@workos-inc/node';
import { AdminPortalLinks } from '@/types/workos';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organization_id');

  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  try {
    const [ssoLink, auditLogsLink, directorySyncLink, domainVerificationLink, logStreamsLink] = await Promise.all([
      workos.portal.generateLink({
        organization: organizationId,
        intent: GeneratePortalLinkIntent.SSO
      }),
      workos.portal.generateLink({
        organization: organizationId,
        intent: GeneratePortalLinkIntent.AuditLogs
      }),
      workos.portal.generateLink({
        organization: organizationId,
        intent: GeneratePortalLinkIntent.DSync
      }),
      workos.portal.generateLink({
        organization: organizationId,
        intent: GeneratePortalLinkIntent.DomainVerification
      }),
      workos.portal.generateLink({
        organization: organizationId,
        intent: GeneratePortalLinkIntent.LogStreams
      })
    ]);

    const links: AdminPortalLinks = {
      sso: ssoLink.link,
      auditLogs: auditLogsLink.link,
      directorySync: directorySyncLink.link,
      domainVerification: domainVerificationLink.link,
      logStreams: logStreamsLink.link
    };


    return NextResponse.json(links);
  } catch (error) {
    console.error('Error generating admin portal links:', error);
    return NextResponse.json({ error: 'Failed to generate admin portal links' }, { status: 500 });
  }
}