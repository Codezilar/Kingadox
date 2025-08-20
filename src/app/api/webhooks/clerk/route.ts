import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { createUser } from "@/lib/actions/user.action";

export async function POST(req: NextRequest) {
  try {
    // Get the headers from the request
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error verifying webhook: Missing headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify the webhook
    const evt = await verifyWebhook({
      payload: body,
      headers: {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }
    });

    // Do something with payload
    const { id } = evt.data;
    const eventType = evt.type;

    // Create user in MongoDB
    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
      
      const user = {
        clerkId: id,
        email: email_addresses[0].email_address, // Fixed typo: emaiil -> email
        username: username!,
        firstname: first_name,
        lastname: last_name,
        photo: image_url
      };

      console.log(user);
      
      const newUser = await createUser(user);
      
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, { // Fixed method name: updateUserMetaData -> updateUserMetadata
          publicMetadata: {
            userId: newUser._id.toString(), // Convert ObjectId to string
          }
        });
      }
      
      return NextResponse.json({ message: "New user created", user: newUser });
    }

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.log('Webhook payload:', evt.data);

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}