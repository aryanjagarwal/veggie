// src/app/api/addresses/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import type { Address } from '@/lib/types';

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabaseAdmin
    //   .from('user_addresses')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });

    // if (error) throw error;
    // return NextResponse.json(data);

    // Placeholder data:
    const mockData: Address[] = [
      // { id: 'temp1', street: '123 API St', city: 'FetchCity', state: 'FS', zipCode: '12345', country: 'USA', isDefault: true, user_id: userId },
      // { id: 'temp2', street: '456 API Ave', city: 'FetchCity', state: 'FS', zipCode: '67890', country: 'USA', isDefault: false, user_id: userId }
    ];
    console.log(`Fetching addresses for user ${userId} (mocked)`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return NextResponse.json(mockData);

  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const addressData = await request.json() as Omit<Address, 'id' | 'user_id'>;
    
    // Basic validation (consider using Zod for more robust validation)
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode || !addressData.country) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }
    
    // TODO: Replace with actual Supabase query
    // If addressData.isDefault is true, you'll first need to set all other addresses for this user_id to isDefault: false.
    // This often involves a transaction or multiple queries.

    // const newAddressPayload = { ...addressData, user_id: userId };
    // const { data, error } = await supabaseAdmin
    //   .from('user_addresses')
    //   .insert(newAddressPayload)
    //   .select()
    //   .single();

    // if (error) throw error;
    // return NextResponse.json(data, { status: 201 });

    // Placeholder data:
    const newId = `new_${Date.now()}`;
    const createdAddress: Address = { ...addressData, id: newId, user_id: userId };
    console.log(`Creating address for user ${userId} (mocked):`, createdAddress);
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(createdAddress, { status: 201 });

  } catch (error: any) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: error.message || 'Failed to create address' }, { status: 500 });
  }
}
