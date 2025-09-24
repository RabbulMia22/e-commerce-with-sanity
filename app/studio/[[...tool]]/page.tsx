/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import config from '../../../sanity.config'
import { isUserAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic' // Changed from force-static to allow auth checks

export { metadata, viewport } from 'next-sanity/studio'

export default async function StudioPage() {
  // Check if user is authenticated and is an admin
  const user = await currentUser();
  
  if (!user) {
    // Redirect to sign in if not authenticated
    redirect('/sign-in?redirect_url=/studio');
  }

  const isAdmin = await isUserAdmin(user);
  
  if (!isAdmin) {
    // Redirect to home page if not an admin
    redirect('/?error=unauthorized');
  }

  // Only admins can access the studio
  return <NextStudio config={config} />
}
