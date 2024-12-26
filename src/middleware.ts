// This file is only used in conjunction with the authkit-nextjs library
import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({ debug: true, redirectUri: `${process.env.ROOT_DOMAIN}/using-hosted-authkit/with-nextjs/callback` });

// Match against pages that require auth, e.g.:
export const config = { matcher: ['/using-hosted-authkit/with-nextjs', '/api/logout'] };
