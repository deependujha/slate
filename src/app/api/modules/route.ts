import { NextResponse } from "next/server";
import { prisma } from "@/prisma/connection";
import { getAuthenticatedUser } from "@/app/api/auth";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../authoptions";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(AuthOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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

export async function DELETE(req: Request) {
	try {
		const session = await getServerSession(AuthOptions);
		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { moduleId } = await req.json();

		if (!moduleId) {
			return NextResponse.json({ error: "moduleId is required" }, { status: 400 });
		}

		// Ensure user has access to the workspace owning this module
		const module = await prisma.module.findFirst({
			where: {
				id: moduleId,
				workspace: {
					members: {
						some: {
							user: { email: session.user.email },
						},
					},
				},
			},
			select: { id: true },
		});

		if (!module) {
			return NextResponse.json({ error: "Module not found or access denied" }, { status: 404 });
		}

		await prisma.module.delete({
			where: { id: moduleId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("DELETE MODULE ERROR", error);
		return NextResponse.json({ error: "Failed to delete module" }, { status: 500 });
	}
}
