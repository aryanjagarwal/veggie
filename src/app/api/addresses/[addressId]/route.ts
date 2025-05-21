// src/app/api/addresses/[addressId]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import type { Address } from '@/lib/types';

export async function PUT(request: Request, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  const { addressId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!addressId) {
    return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    const addressData = await request.json() as Partial<Omit<Address, 'id' | 'user_id'>>;

    // TODO: Replace with actual Supabase query
    // Ensure the address belongs to the user before updating.
    // If addressData.isDefault is true, handle unsetting other defaults.
    // const { data, error } = await supabaseAdmin
    //   .from('user_addresses')
    //   .update(addressData)
    //   .eq('id', addressId)
    //   .eq('user_id', userId) // Important: Ensure user owns the address
    //   .select()
    //   .single();

    // if (error) throw error;
    // if (!data) return NextResponse.json({ error: 'Address not found or not owned by user' }, { status: 404 });
    // return NextResponse.json(data);

    // Placeholder data:
    console.log(`Updating address ${addressId} for user ${userId} (mocked):`, addressData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedAddress : Address = { 
        id: addressId, 
        street: addressData.street || "Updated St", 
        city: addressData.city || "Updated City", 
        state: addressData.state || "US", 
        zipCode: addressData.zipCode || "00000", 
        country: addressData.country || "USA", 
        isDefault: addressData.isDefault !== undefined ? addressData.isDefault : false,
        user_id: userId 
    };
    return NextResponse.json(updatedAddress);

  } catch (error: any) {
    console.error(`Error updating address ${addressId}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  const { addressId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!addressId) {
    return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    // TODO: Replace with actual Supabase query
    // Ensure the address belongs to the user before deleting.
    // const { error, count } = await supabaseAdmin
    //   .from('user_addresses')
    //   .delete({ count: 'exact' })
    //   .eq('id', addressId)
    //   .eq('user_id', userId); // Important: Ensure user owns the address

    // if (error) throw error;
    // if (count === 0) return NextResponse.json({ error: 'Address not found or not owned by user' }, { status: 404 });
    // return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 }); // Or 204 No Content

    // Placeholder response:
    console.log(`Deleting address ${addressId} for user ${userId} (mocked)`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json({ message: 'Address deleted successfully (mocked)' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting address ${addressId}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to delete address' }, { status: 500 });
  }
}
