// types/clerk.ts
export interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: {
      email_address: string;
    }[];
    first_name: string | null;
    last_name: string | null;
    // Add other Clerk user properties you need
  };
}

// types/user.ts
export interface User {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your custom fields
}