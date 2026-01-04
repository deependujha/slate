import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/prisma/connection";
import { AuthOptions } from "../authoptions";

export async function GET() {
	try {
		const session = await getServerSession(AuthOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: {
				id: true,
				workspaces: {
					select: {
						workspace: {
							select: {
								id: true,
								name: true,
								modules: {
									orderBy: { createdAt: "asc" },
									select: {
										id: true,
										name: true,
										pages: {
											orderBy: { createdAt: "asc" },
											select: {
												id: true,
												title: true,
												type: true,
												createdAt: true,
												updatedAt: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Normalize shape (cleaner for frontend)
		const workspaces = user.workspaces.map((wm) => wm.workspace);

		return NextResponse.json({ workspaces });
	} catch (error) {
		console.error("[GET_WORKSPACES]", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
