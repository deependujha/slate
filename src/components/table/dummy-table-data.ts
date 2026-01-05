// dummy-table-data.ts
export type SlateRow = {
	id: string;
	title: string;
	link?: string;
	tags: string[];
	status: "open" | "blocked" | "merged" | "closed";
	notes?: string;
	date: string;
	extra?: string;
};

export const DUMMY_ROWS: SlateRow[] = [
	{
		id: "1",
		title: "Fix DDP deadlock in Lightning",
		link: "https://github.com/Lightning-AI/pytorch-lightning/pull/19234",
		tags: ["distributed", "ci"],
		status: "open",
		notes: "Hangs on multi-node, NCCL timeout suspected",
		date: "2026-01-02",
		extra: "Needs repro script",
	},
	{
		id: "2",
		title: "Roboflow inference batching regression",
		link: "https://github.com/roboflow/inference/issues/812",
		tags: ["cv", "external"],
		status: "blocked",
		notes: "Upstream ONNX change broke batching",
		date: "2026-01-01",
	},
	{
		id: "3",
		title: "CI flakiness on mac runners",
		tags: ["ci"],
		status: "merged",
		notes: "Resolved by pinning Python 3.11.7",
		date: "2025-12-29",
	},
];
