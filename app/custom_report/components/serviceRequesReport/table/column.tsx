"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SRDefaultHeader = {
  id: string;
  label: string;
  value: string;
  api_name: string | null;
  mandatory: boolean | null;
};

export type SRCustomFieldHeader = {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  field_type: string;
  drop_down_values: string;
  dependent_fields: string;
  dependent_field_value: string;
};

export const columnsDefault: ColumnDef<SRDefaultHeader>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ cell }) => (
      <div className="max-w-[500px] whitespace-pre-wrap break-words">
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "api_name",
    header: "API Name",
  },
  {
    accessorKey: "mandatory",
    header: "Mandatory",
  },
];

export const columnsCustomFields: ColumnDef<SRCustomFieldHeader>[] = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ cell }) => (
      <div className="max-w-[500px] whitespace-pre-wrap break-words">
        {cell.getValue<string>()}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Api name",
  },
  {
    accessorKey: "placeholder",
    header: "Placeholder",
  },
  {
    accessorKey: "field_type",
    header: "Field type",
  },
  {
    accessorKey: "drop_down_values",
    header: "Drop down values",
    cell: ({ cell }) => (
      <div className="max-w-[500px] truncate">{cell.getValue<string>()}</div>
    ),
  },
  {
    accessorKey: "dependent_fields",
    header: "Dependent fields"
  },
  {
    accessorKey: "dependent_field_value",
    header: "Dependent field value"
  },
];
