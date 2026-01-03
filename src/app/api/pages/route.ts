import { NextResponse } from "next/server";
import { prisma } from "@/prisma/connection";
import { getAuthenticatedUser } from "@/app/api/auth";
import { PageType } from "@/generated/prisma/client";
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

		const { moduleId, newPageName, type } = body;

		if (!moduleId || !newPageName?.trim() || !type) {
			return NextResponse.json(
				{ error: "moduleId, newPageName and type are required" },
				{ status: 400 },
			);
		}

		if (!Object.values(PageType).includes(type)) {
			return NextResponse.json({ error: "Invalid page type" }, { status: 400 });
		}

		// Load module + workspace
		const module = await prisma.module.findUnique({
			where: { id: moduleId },
			include: { workspace: true },
		});

		if (!module) {
			return NextResponse.json({ error: "Module not found" }, { status: 404 });
		}

		// Check membership
		const membership = await prisma.workspaceMember.findUnique({
			where: {
				workspaceId_userId: {
					workspaceId: module.workspaceId,
					userId: user.id,
				},
			},
		});

		if (!membership) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// Create page + empty content
		const page = await prisma.page.create({
			data: {
				title: newPageName.trim(),
				type,
				moduleId,
				content: {
					create: {
						content: {}, // empty JSON
					},
				},
			},
			include: {
				content: true,
			},
		});

		return NextResponse.json(page);
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

		const { pageId } = await req.json();

		if (!pageId) {
			return NextResponse.json({ error: "pageId is required" }, { status: 400 });
		}

		// Ensure user has access
		const page = await prisma.page.findFirst({
			where: {
				id: pageId,
				module: {
					workspace: {
						members: {
							some: {
								user: { email: session.user.email },
							},
						},
					},
				},
			},
			select: { id: true },
		});

		if (!page) {
			return NextResponse.json({ error: "Page not found or access denied" }, { status: 404 });
		}

		await prisma.page.delete({
			where: { id: pageId },
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("DELETE PAGE ERROR", error);
		return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
	}
}
