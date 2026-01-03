import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/connection";
import { NextAuthOptions } from "next-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const AuthOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},

	providers: [
		GoogleProvider({
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
		}),
	],

	callbacks: {
		async signIn({ account, profile }) {
			if (!profile?.email || !account?.providerAccountId) {
				throw new Error("Invalid Google profile");
			}

			const email = profile.email;

			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (!existingUser) {
				// First-time user → create everything
				await prisma.$transaction(async (tx) => {
					const user = await tx.user.create({
						data: {
							email,
							name: profile.name,
							image: (profile as any).picture,
							provider: account.provider,
							providerId: account.providerAccountId,
						},
					});

					const workspace = await tx.workspace.create({
						data: {
							name: "Personal",
							members: {
								create: {
									userId: user.id,
								},
							},
						},
					});

					const module = await tx.module.create({
						data: {
							name: "Getting Started",
							workspaceId: workspace.id,
						},
					});

					const page = await tx.page.create({
						data: {
							title: "Notes",
							type: "TEXT",
							moduleId: module.id,
							content: {
								create: {
									content: {
										text: "Welcome to Slate.\n\nUse this page to jot down context, blockers, or anything you want to remember.",
									},
								},
							},
						},
					});
				});
			} else {
				// Existing user → just update profile info
				await prisma.user.update({
					where: { email },
					data: {
						name: profile.name,
						image: (profile as any).picture,
					},
				});
			}

			return true;
		},

		async jwt({ token, profile }) {
			// Persist email on token
			if (profile?.email) {
				token.email = profile.email;
			}
			return token;
		},

		async session({ session, token }) {
			if (token.email && session.user) {
				session.user.email = token.email as string;
			}
			return session;
		},
	},
};
