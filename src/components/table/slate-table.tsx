// slate-table.tsx
"use client";

import * as React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	flexRender,
	HeaderGroup,
	Row,
	Cell,
	SortingState,
} from "@tanstack/react-table";

import { columns } from "./slate-table-columns";
import { DUMMY_ROWS, SlateRow } from "./dummy-table-data";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TAGS = ["distributed", "cv", "external", "ci"];

export function SlateTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

	const table = useReactTable({
		data: DUMMY_ROWS,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		globalFilterFn: "includesString",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	// Inject tag filtering
	React.useEffect(() => {
		table.getColumn("tags")?.setFilterValue(selectedTags);
	}, [selectedTags, table]);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Input
					placeholder="Search title / notes..."
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="max-w-sm"
				/>

				<div className="flex gap-2 flex-wrap">
					{TAGS.map((tag) => {
						const active = selectedTags.includes(tag);
						return (
							<Badge
								key={tag}
								variant={active ? "default" : "outline"}
								className="cursor-pointer"
								onClick={() =>
									setSelectedTags((prev) =>
										active ? prev.filter((t) => t !== tag) : [...prev, tag],
									)
								}
							>
								{tag}
							</Badge>
						);
					})}
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((hg: HeaderGroup<SlateRow>) => (
							<TableRow key={hg.id}>
								{hg.headers.map((header: any) => (
									<TableHead key={header.id}>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row: Row<SlateRow>) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell: Cell<SlateRow, unknown>) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
