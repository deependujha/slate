import { NextResponse } from "next/server";
import { prisma } from "@/prisma/connection";
import { getAuthenticatedUser } from "@/app/api/auth";
import { PageType } from "@/generated/prisma/client";

export async function POST(req: Request) {
	try {
		const user = await getAuthenticatedUser();
		const body = await req.json();

		const { moduleId, newPageName, type } = body;

		if (!moduleId || !newPageName?.trim() || !type) {
			return NextResponse.json({ error: "moduleId, newPageName and type are required" }, { status: 400 });
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
