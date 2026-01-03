import { NextResponse } from "next/server";
import { prisma } from "@/prisma/connection";
import { getAuthenticatedUser } from "@/app/api/auth";

export async function POST(req: Request) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();

		const { workspaceId, newModuleName } = body;

		if (!workspaceId || !newModuleName?.trim()) {
			return NextResponse.json(
				{ error: "workspaceId and newModuleName are required" },
				{ status: 400 },
			);
		}

		// Check membership
		const membership = await prisma.workspaceMember.findUnique({
			where: {
				workspaceId_userId: {
					workspaceId,
					userId: user.id,
				},
			},
		});

		if (!membership) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const module = await prisma.module.create({
			data: {
				name: newModuleName.trim(),
				workspaceId,
			},
		});

		return NextResponse.json(module);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
