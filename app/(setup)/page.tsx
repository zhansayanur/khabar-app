import { redirect } from "next/navigation";
import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

const SetupPage = async() => {
    const profile = await initialProfile();

    // Query the database to find the first server where the current user's profile is a member
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id // Look for a server where the user's profile is part of the members list
                }
            }
        }
    })

    // If a server is found where the user is a member, redirect them to that server's page
    if (server) {
        return redirect(`/servers/${server.id}`); // Redirect to the specific server's page based on its ID
    }

    // If no server is found, display a message prompting the user to create a new server
    return <div>Create a Server</div>;
}

export default SetupPage;