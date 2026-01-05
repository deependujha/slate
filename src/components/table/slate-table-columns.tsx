// slate-table-columns.tsx
"use client";

import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { SlateRow } from "./dummy-table-data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<SlateRow>[] = [
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
			const color =
				status === "open"
					? "bg-blue-500"
					: status === "blocked"
						? "bg-red-500"
						: status === "merged"
							? "bg-green-500"
							: "bg-neutral-400";

			return <span className={`px-2 py-1 rounded text-white text-xs ${color}`}>{status}</span>;
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
		accessorKey: "date",
		header: "Date",
		sortingFn: "datetime",
	},

	{
		accessorKey: "extra",
		header: "Extra",
		cell: ({ row }: { row: Row<SlateRow> }) => row.original.extra ?? "—",
	},
];
