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

import { createColumns } from "./slate-table-columns";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SlateModal } from "@/components/ui/modal";
import { toast } from "sonner";

const TAGS = ["distributed", "cv", "external", "ci"];

export function SlateTable() {
	const [rows, setRows] = React.useState<SlateRow[]>(DUMMY_ROWS);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
	const [isAddingRow, setIsAddingRow] = React.useState(false);
	const [isCreatingTag, setIsCreatingTag] = React.useState(false);
	const [newTagName, setNewTagName] = React.useState("");

	const tagInputRef = React.useRef<HTMLInputElement>(null);
	const titleInputRef = React.useRef<HTMLInputElement>(null);

	const [newRow, setNewRow] = React.useState<Partial<SlateRow>>({
		title: "",
		link: "",
		tags: [],
		status: "open",
		notes: "",
		date: new Date().toISOString().split("T")[0],
		extra: "",
	});

	const handleDeleteRow = (id: string) => {
		const rowToDelete = rows.find((row) => row.id === id);
		if (rowToDelete) {
			setRows(rows.filter((row) => row.id !== id));
			toast.success("Row deleted", {
				description: `"${rowToDelete.title}" has been removed`,
			});
		}
	};

	const columns = React.useMemo(() => createColumns(handleDeleteRow), [rows]);

	const table = useReactTable({
		data: rows,
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

	/* ----------------------------------
	 * Tag filtering
	 * ---------------------------------- */
	React.useEffect(() => {
		table.getColumn("tags")?.setFilterValue(selectedTags);
	}, [selectedTags, table]);

	/* ----------------------------------
	 * Auto-focus modals
	 * ---------------------------------- */
	React.useEffect(() => {
		if (isCreatingTag) tagInputRef.current?.focus();
	}, [isCreatingTag]);

	React.useEffect(() => {
		if (isAddingRow) titleInputRef.current?.focus();
	}, [isAddingRow]);

	/* ----------------------------------
	 * Handlers
	 * ---------------------------------- */
	const handleAddRow = () => {
		if (!newRow.title?.trim()) return;

		const rowToAdd: SlateRow = {
			id: crypto.randomUUID(),
			title: newRow.title!,
			link: newRow.link,
			tags: newRow.tags || [],
			status: newRow.status as SlateRow["status"],
			notes: newRow.notes,
			date: newRow.date!,
			extra: newRow.extra,
		};

		setRows((prev) => [...prev, rowToAdd]);
		setIsAddingRow(false);
		setNewRow({
			title: "",
			link: "",
			tags: [],
			status: "open",
			notes: "",
			date: new Date().toISOString().split("T")[0],
			extra: "",
		});
	};

	const handleCreateTag = () => {
		if (!newTagName.trim()) return;
		alert(`Tag "${newTagName}" will be created`);
		setNewTagName("");
		setIsCreatingTag(false);
	};

	return (
		<div className="flex flex-col h-full min-h-0">
			{/* ===============================
			 * Top Controls (NON-SCROLLING)
			 * =============================== */}
			<div className="shrink-0 pb-4 space-y-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Input
						placeholder="Search title / notes..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="max-w-sm"
					/>

					<div className="flex gap-2 flex-wrap items-center">
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

						<Button size="sm" onClick={() => setIsAddingRow(true)}>
							+ Add Row
						</Button>

						<Button size="sm" variant="outline" onClick={() => setIsCreatingTag(true)}>
							+ New Tag
						</Button>
					</div>
				</div>
			</div>

			{/* ===============================
			 * Table (SCROLLS)
			 * =============================== */}
			<div className="flex-1 min-h-0 overflow-auto rounded-md border">
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-background">
						{table.getHeaderGroups().map((hg: HeaderGroup<SlateRow>) => (
							<TableRow key={hg.id}>
								{hg.headers.map((header) => (
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

			{/* ===============================
			 * Add Row Modal
			 * =============================== */}
			<SlateModal
				open={isAddingRow}
				onOpenChange={setIsAddingRow}
				title="Add New Row"
				description="Fill in the details for the new row"
			>
				<div className="space-y-4">
					<Label>Title *</Label>
					<Input
						ref={titleInputRef}
						value={newRow.title}
						onChange={(e) => setNewRow({ ...newRow, title: e.target.value })}
					/>

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={() => setIsAddingRow(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddRow}>Add Row</Button>
					</div>
				</div>
			</SlateModal>

			{/* ===============================
			 * Create Tag Modal
			 * =============================== */}
			<SlateModal
				open={isCreatingTag}
				onOpenChange={setIsCreatingTag}
				title="Create New Tag"
				description="Tags help you filter and organize rows"
			>
				<div className="space-y-4">
					<Label>Tag Name *</Label>
					<Input
						ref={tagInputRef}
						value={newTagName}
						onChange={(e) => setNewTagName(e.target.value)}
					/>

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={() => setIsCreatingTag(false)}>
							Cancel
						</Button>
						<Button onClick={handleCreateTag}>Create Tag</Button>
					</div>
				</div>
			</SlateModal>
		</div>
	);
}
