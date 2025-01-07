import { WorkOS } from '@workos-inc/node'
import { NextResponse } from 'next/server'

const workos = new WorkOS(process.env.WORKOS_API_KEY)

export async function POST(request: Request) {
  try {
    const { code, challengeId } = await request.json()
    
    const res = await workos.mfa.verifyChallenge({
      authenticationChallengeId: challengeId,
      code: code
    })

    return NextResponse.json({ res })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid verification code' },
      { status: 500 }
    )
  }
}