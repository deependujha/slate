// slate-table-columns.tsx
"use client";

import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { SlateRow } from "./dummy-table-data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_STYLES = {
	open: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
	blocked: "bg-rose-500/10 text-rose-400 border border-rose-500/25",
	merged: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
	closed: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
} as const;

export const createColumns = (
	onDelete: (id: string) => void
): ColumnDef<SlateRow>[] => [
	{
		accessorKey: "title",
		header: ({ column }: { column: Column<SlateRow> }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				className="px-0"
			>
				Title
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: { row: Row<SlateRow> }) => {
			const link = row.original.link;
			return link ? (
				<a href={link} target="_blank" className="underline underline-offset-2 hover:text-primary">
					{row.getValue("title")}
				</a>
			) : (
				row.getValue("title")
			);
		},
	},

	{
		accessorKey: "tags",
		header: "Tags",
		cell: ({ row }: { row: Row<SlateRow> }) => (
			<div className="flex gap-1 flex-wrap">
				{row.original.tags.map((tag: string) => (
					<Badge key={tag} variant="secondary">
						{tag}
					</Badge>
				))}
			</div>
		),
		filterFn: (row: Row<SlateRow>, _: string, value: string[]) =>
			value.length === 0 || value.some((tag) => row.original.tags.includes(tag)),
	},

	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }: { row: Row<SlateRow> }) => {
			const status = row.original.status;

			return (
				<span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[status]}`}>
					{status}
				</span>
			);
		},
	},

	{
		accessorKey: "notes",
		header: "Notes",
		cell: ({ row }: { row: Row<SlateRow> }) => (
			<span className="text-muted-foreground line-clamp-2">{row.original.notes ?? "—"}</span>
		),
	},

	{
		accessorKey: "extra",
		header: "Extra",
		cell: ({ row }: { row: Row<SlateRow> }) => row.original.extra ?? "—",
	},

	{
		id: "actions",
		header: "Actions",
		cell: ({ row }: { row: Row<SlateRow> }) => (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => onDelete(row.original.id)}
				className="h-8 w-8 p-0 text-destructive hover:text-destructive"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		),
	},
];
