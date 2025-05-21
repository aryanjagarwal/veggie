
import type { Address } from '@/lib/types';

export const mockUserAddresses: Address[] = [
  {
    id: 'addr1',
    street: '123 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    country: 'USA',
    isDefault: true,
  },
  {
    id: 'addr2',
    street: '456 Oak Lane',
    city: 'Shelbyville',
    state: 'IL',
    zipCode: '62565',
    country: 'USA',
    isDefault: false,
  },
  {
    id: 'addr3',
    street: '789 Maple Drive',
    city: 'Capital City',
    state: 'IL',
    zipCode: '62701',
    country: 'USA',
    isDefault: false,
  },
];
