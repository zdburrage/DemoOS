import { WorkOS } from '@workos-inc/node'
import { NextResponse } from 'next/server'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json()

    
    const factor = await workos.mfa.enrollFactor({
      type: 'sms',
      phoneNumber
    })

    const challenge = await workos.mfa.challengeFactor({
        authenticationFactorId: factor.id
    })


    return NextResponse.json({ 
      authenticationChallengeId: challenge.id 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to enroll phone number' },
      { status: 500 }
    )
  }
}