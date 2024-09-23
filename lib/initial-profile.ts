import { currentUser, auth } from "@clerk/nextjs/server"; // Import current user and auth functions from Clerk
import { db } from "@/lib/db"; // Import the database

// Define an asynchronous function to initialize the user profile
export const initialProfile = async () => {
    // Retrieve the currently authenticated user
    const user = await currentUser();

    // Check if no user is authenticated
    if (!user) {
        return auth().redirectToSignIn(); 
    } // Redirect to the sign-in page if there's no user

    // Query the database to find an existing profile for the authenticated user
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id // Look for a profile with the user's ID
        }
    })

    // If a profile is found, return it
    if (profile) {
        return profile;
    }

    // If no profile exists, create a new one
    const newProfile = await db.profile.create({
        data: {
            userId: user.id, // Set the user ID for the new profile
            name: `${user.firstName} ${user.lastName}`, // Set the user's full name
            imageUrl: user.imageUrl, // Set the user's profile image URL
            email: user.emailAddresses[0].emailAddress // Set the user's primary email address
        }
    }) 

    // Return the newly created profile
    return newProfile;
};
