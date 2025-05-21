// src/app/api/addresses/[addressId]/set-default/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function PATCH(request: Request, { params }: { params: { addressId: string } }) {
  const { userId } = auth();
  const { addressId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!addressId) {
    return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    // TODO: Implement Supabase transaction or multi-step query:
    // 1. Set all other addresses for this user_id to isDefault = false.
    //    await supabaseAdmin
    //      .from('user_addresses')
    //      .update({ is_default: false })
    //      .eq('user_id', userId)
    //      .neq('id', addressId); // Don't update the one we're about to set to true
    // 2. Set the specified address to isDefault = true.
    //    const { data, error } = await supabaseAdmin
    //      .from('user_addresses')
    //      .update({ is_default: true })
    //      .eq('id', addressId)
    //      .eq('user_id', userId) // Ensure user owns the address
    //      .select()
    //      .single();
    // if (error) throw error;
    // if (!data) return NextResponse.json({ error: 'Address not found or not owned by user' }, { status: 404 });
    // return NextResponse.json(data);

    // Placeholder response:
    console.log(`Setting address ${addressId} as default for user ${userId} (mocked)`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate returning the updated address list or just the one address
    return NextResponse.json({ message: `Address ${addressId} set as default (mocked)` });

  } catch (error: any) {
    console.error(`Error setting default address ${addressId}:`, error);
    return NextResponse.json({ error: error.message || 'Failed to set default address' }, { status: 500 });
  }
}
