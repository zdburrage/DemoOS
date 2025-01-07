import {WorkOS} from '@workos-inc/node';
import { NextResponse } from 'next/server';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function GET(request: Request) {
    const docs = await workos.fga.listResources({
        resourceType: 'document'
    });


    return NextResponse.json({documents: docs.data});

}