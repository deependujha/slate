// src/lib/auth.ts
import { getServerSession } from "next-auth";
import { AuthOptions } from "./authoptions";
import { prisma } from "@/prisma/connection";

export async function getAuthenticatedUser() {
	const session = await getServerSession(AuthOptions);

	if (!session?.user?.email) {
		throw new Error("Unauthorized");
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
	});

	if (!user) {
		throw new Error("User not found");
	}

	return user;
}
