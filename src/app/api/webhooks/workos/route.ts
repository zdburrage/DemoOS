import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import {WorkOS} from '@workos-inc/node';
import { addToast } from '@/app/actions/notifications';

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const webhookSecret = process.env.WORKOS_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const headersList = headers();
  const signature = headersList.get('workos-signature');

  if (!signature) {
    return new NextResponse('Missing signature', { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const isValidSignature = workos.webhooks.verifyHeader({
      payload: rawBody,
      sigHeader: signature,
      secret: webhookSecret as string,
    });

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle organization creation event
    if (event.type === 'organization.created') {
      const org = event.data.organization;
      await addToast(
        `New organization created: ${org.name}`,
        'success'
      );

      return new NextResponse(JSON.stringify({ received: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Handle other event types as needed
    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    await addToast('Error processing webhook event', 'error');
    return new NextResponse('Webhook error', { status: 500 });
  }
} 