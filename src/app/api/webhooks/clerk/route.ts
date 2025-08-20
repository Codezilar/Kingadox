import { clerkClient } from "@clerk/nextjs/server";
import {WebhookEvent} from "@clerk/nextjs/server"
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix"

import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

import { createUser } from "@/lib/actions/user.action";
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    // create user in mongodb
    if(eventType === "user.created"){
        const {id, email_addresses, image_url, first_name, last_name, username} = evt.data;
        const user = {
            clerkId: id,
            emaiil: email_addresses[0].email_address,
            username: username!,
            firstname: first_name,
            lastname: last_name,
            photo: image_url
        }
        console.log(user);
        const newUser = await createUser(user);
        if(newUser){
            await clerkClient.users.updateUserMetaData(id, {
                publicMetadata: {
                    userId: newUser._id,
                }
            })
        }
        return NextResponse.json({message: "new user created", user: newUser})
        
    } 


    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}