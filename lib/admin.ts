import { currentUser } from '@clerk/nextjs/server'
import type { User } from '@clerk/nextjs/server'

// Define admin email addresses here
const ADMIN_EMAILS = [
  'mdr191700@gmail.com',
  'rabbulmia22@gmail.com', // Add your actual admin email here
  // Add more admin emails as needed
];

export async function isUserAdmin(user?: User | null): Promise<boolean> {
  try {
    const currentUserData = user || await currentUser();
    
    if (!currentUserData || !currentUserData.emailAddresses || currentUserData.emailAddresses.length === 0) {
      return false;
    }

    // Check if user's primary email is in admin list
    const userEmail = currentUserData.emailAddresses[0]?.emailAddress?.toLowerCase();
    return ADMIN_EMAILS.includes(userEmail || '');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS;
}