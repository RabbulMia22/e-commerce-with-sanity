import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { isUserAdmin } from '@/lib/admin';
import { writeClient } from '@/sanity/lib/backendClient';

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('DELETE /api/admin/orders/delete called');
    
    // Check if user is authenticated and is admin
    const user = await currentUser();
    
    if (!user) {
      console.log('No user found');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(user);
    if (!isAdmin) {
      console.log('User is not admin:', user.emailAddresses[0]?.emailAddress);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      console.log('No orderId provided');
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete order:', orderId);

    // Delete the order from Sanity
    const result = await writeClient.delete(orderId);
    console.log('Delete result:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully',
      deletedId: orderId
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete order',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}