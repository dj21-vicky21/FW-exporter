import { formatAndCapitalize, handleCaches, removeHtmlTags } from "@/lib/utils";
import { SRCustomFieldHeader, SRDefaultHeader } from "./table/column";
import * as XLSX from "xlsx";
import {
  CustomField,
  NestedChoice,
  ServiceCatalogItem,
} from "@/app/actions/apiTypes";
import { useAppStore } from "@/lib/store";
import {
  viewaAgentGroup,
  viewaRequesterGroup,
  viewWorkspace,
} from "@/app/actions/api";

export const SrMetaExtract = [
  "id",
  "category_id",
  "category_name",
  "name",
  "display_id",
  "short_description",
  "description",
  "visibility",
  "delivery_time",
  "delivery_time_visibility",  
  "cost",
  "agent_group_visibility",
  "agent_workspace_visibilities_workspace_id",
  "agent_group_visibilities_group_id",
  "group_visibility",
  "group_visibilities_group_id",
  "allow_attachments",
  "icon_url",
  "workspace_id",
  "workspace_name",
  "child_items",
  "create_child",
];

export const SrFieldheader = [
  "Label",
  "Api name",
  "Visible in public",
  "Placeholder",
  "Required for create",
  "Requester can edit",
  "Displayed to requester",
  "Field type",
  "Drop down values",
];

export const SrCustomFieldExtract = [
  "label",
  "name",
  "placeholder",
  "field_type",
];

export const handlerFormateSingleSRData = async (
  data: ServiceCatalogItem
): Promise<SRDefaultHeader[]> => {
  const keys = SrMetaExtract;
  const result: SRDefaultHeader[] = [];
  const storedData = useAppStore.getState().getAuth();

  for (const key of keys) {
    if (key in data.service_item) {
      const value = data.service_item[key as keyof typeof data.service_item];

      // Check if the value is an array or an object and stringify it if so
      const processedValue =
        Array.isArray(value) || (typeof value === "object" && value !== null)
          ? JSON.stringify(value)
          : value;

      // Function to format child items
      function formatChildItems(
        childItems: ServiceCatalogItem["service_item"]["child_items"]
      ) {
        return childItems.map((item) => {
          // Convert `mandatory` from 0 to false and 1 to true
          const mandatoryStatus = item.mandatory === 1 ? "true" : "false";
          // Format the string as required
          return `${item.id} - ${item.name} - mandatory - ${mandatoryStatus}`;
        });
      }
      // Async function to format agent group names
      async function formatAgentGroup(groupIds: number[]) {
        if (!groupIds?.length) {
          return "";
        }

        // Resolving the agent group names
        const groupNames = await Promise.all(
          groupIds.map(async (item) => {
            const cachedItem = useAppStore.getState().getCachedItem(item);
            let groupName;
            if (!cachedItem) {
              console.log("--> ~ Agent api called for group id:", item);
              const groupRes = await viewaAgentGroup(item, storedData);
              if (groupRes) {
                groupName = groupRes.group.name;
                useAppStore.getState().addToCache(item, groupName);
              }
            } else {
              groupName = cachedItem.name;
            }
            return groupName;
          })
        );

        return groupNames.join(", ");
      }

      async function formatRequesterGroup(groupIds: number[]) {
        if (!groupIds?.length) {
          return "";
        }

        // Resolving the agent group names
        const groupNames = await Promise.all(
          groupIds.map(async (item) => {
            const cachedItem = useAppStore.getState().getCachedItem(item);
            let groupName;
            if (!cachedItem) {
              console.log("--> ~ requester api called for group id:", item);
              const groupRes = await viewaRequesterGroup(item, storedData);
              if (groupRes) {
                groupName = groupRes.requester_group.name;
                useAppStore.getState().addToCache(item, groupName);
              }
            } else {
              groupName = cachedItem.name;
            }
            return groupName;
          })
        );

        return groupNames.join(", ");
      }

      async function formatWorkspace(workspaceIds: number[]) {
        if (!workspaceIds?.length) {
          return "";
        }

        const workspaceNames = await Promise.all(
          workspaceIds.map(async (item) => {
            const cachedItem = useAppStore.getState().getCachedItem(item);
            let workspaceName;
            if (!cachedItem) {
              console.log("--> ~ workspace api called for workspace id:", item);
              const workspaceRes = await viewWorkspace(item, storedData);
              if (workspaceRes) {
                workspaceName = workspaceRes.workspace.name;
                handleCaches(item, workspaceName, "workspace");
              }
            } else {
              workspaceName = cachedItem.name;
            }
            return workspaceName;
          })
        );

        return workspaceNames.join(", ");
      }

      // Handling different keys
      if (key === "allow_attachments") {
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: String(processedValue),
          api_name: key,
          mandatory: Boolean(data?.service_item?.configs?.attachment_mandatory),
        });
      } else if (key === "child_items") {
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: formatChildItems(
            value as ServiceCatalogItem["service_item"]["child_items"]
          ).join("\n"),
          api_name: key,
          mandatory: null,
        });
      } else if ( key === "agent_group_visibility" || key === "group_visibility"
      ) {
        let visibilityName = "All";

        if (key === "agent_group_visibility") {
          visibilityName =
            value === 1
              ? "All agents"
              : value === 2
              ? "Selected agent groups"
              : "Selected workspace";
        } else {
          visibilityName =
            value === 1 ? "All requesters" : "Selected requesters";
        }

        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: visibilityName,
          api_name: key,
          mandatory: null,
        });
      } else if (key === "agent_workspace_visibilities_workspace_id") {
        const workspaceName = await formatWorkspace(value as number[]);
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: (value as number[])?.join(", ") ?? "-",
          api_name: key,
          mandatory: null,
        });

        if (workspaceName) {
          result.push({
            id: key + "name",
            label: "Agent Workspace Visibilities Name",
            value: workspaceName ?? "-",
            api_name: null,
            mandatory: null,
          });
        }
      } else if (key === "agent_group_visibilities_group_id") {
        const groupName = await formatAgentGroup(value as number[]);
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: (value as number[])?.join(", ") ?? "-",
          api_name: key,
          mandatory: null,
        });

        if (groupName) {
          result.push({
            id: key + "name",
            label: "Agent Visibilities Group Name",
            value: groupName ?? "-",
            api_name: null,
            mandatory: null,
          });
        }
      } else if (key === "group_visibilities_group_id") {
        const groupName = await formatRequesterGroup(value as number[]);
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: (value as number[])?.join(", ") ?? "-",
          api_name: key,
          mandatory: null,
        });

        if (groupName) {
          result.push({
            id: key + "name",
            label: "Requester Visibilities Group Name",
            value: groupName ?? "-",
            api_name: null,
            mandatory: null,
          });
        }
      } else if(key === "visibility") {
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: value === 1 ? "Draft" : "Published",
          api_name: key,
          mandatory: null,
        });
      } else {
        const ignoreKeys = ["category_name", "workspace_name"];
        result.push({
          id: key,
          label: formatAndCapitalize(key),
          value: String(processedValue),
          api_name: !ignoreKeys.includes(key) ? key : null,
          mandatory: null,
        });
      }
    } else if (key === "subject") {
      const subjectValue = data.service_item.configs?.subject;
      result.push({
        id: key,
        label: formatAndCapitalize(key),
        value: subjectValue || `Err: Property not found '${key}'`,
        api_name: key,
        mandatory: true,
      });
    } else {
      result.push({
        id: key,
        label: formatAndCapitalize(key),
        value: `Err: Property not found '${key}'`,
        api_name: key,
        mandatory: null,
      });
    }
  }

  return result;
};

export const getCustomFieldDetails = (
  customFields: CustomField[]
): SRCustomFieldHeader[] => {
  const keyvalue = SrCustomFieldExtract;

  const extractDetails = (
    field: CustomField,
    nested_field_choices?: NestedChoice[]
  ) => {
    if (!field) {
      console.warn("Field is undefined or null:", field);
      return null;
    }

    const details: Record<string, string> = {};

    // Map the basic field properties
    keyvalue.forEach((key) => {
      if (field.field_options && key in field.field_options) {
        details[key] = field.field_options[key] || "";
      } else {
        if (field.field_type === "custom_static_rich_text") {
          const value = field[key];
          details[key] =
            typeof value === "string"
              ? removeHtmlTags(value)
              : String(value || "");
        } else {
          details[key] = String(field[key] || "");
        }
      }
    });

    // Add dropdown values if applicable
    if (field.field_type === "custom_dropdown" && field.choices) {
      details["drop_down_values"] = field.choices
        .map((choice) => choice[0])
        .join(", ");
    }

    // Add nested field choices if available
    if (nested_field_choices?.length && Array.isArray(nested_field_choices)) {
      const nestedChoices = nested_field_choices
        .map((choice) => {
          const [label, , subChoices] = choice;
          return `${label}-${subChoices.map(([value]) => value).join(", ")}`;
        })
        .join(", ");

      details["nested_choices"] = nestedChoices;
    }

    return details;
  };

  const result: Record<string, string>[] = [];

  customFields.forEach((field) => {
    const fieldDetails = extractDetails(field);
    if (fieldDetails) {
      result.push(fieldDetails);
    }

    // Handle nested fields
    if (field.nested_fields?.length > 0) {
      field.nested_fields.forEach((nestedField) => {
        if (nestedField) {
          const nestedDetails = extractDetails(
            nestedField,
            field.nested_field_choices
          );
          if (nestedDetails) {
            result.push(nestedDetails);
          }
        }
      });
    }

    // Handle sections
    field.sections?.forEach((section) => {
      section.fields.forEach((sectionField) => {
        const sectionDetails = extractDetails(sectionField);
        if (sectionDetails) {
          sectionDetails["dependent_fields"] = field.name;
          sectionDetails["dependent_field_value"] = section.name;
          result.push(sectionDetails);
        }
      });
    });
  });

  // Convert Record<string, string>[] to SRCustomFieldHeader[]
  return result.map((item) => ({
    id: item.name || item.label,
    label: item.label || "",
    name: item.name || "",
    placeholder: item.placeholder || "",
    field_type: item.field_type || "",
    drop_down_values: item.drop_down_values || "",
    dependent_fields: item.dependent_fields || "",
    dependent_field_value: item.dependent_field_value || "",
  }));
};

export const downloadExcelFile = (
  defaultData: SRDefaultHeader[],
  customFieldsData: SRCustomFieldHeader[],
  fileName: string = "service_request_report"
) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert default data to worksheet
  const defaultWs = XLSX.utils.json_to_sheet(
    defaultData.map((item) => ({
      Label: item.label,
      Value: item.value,
      "API Name": item.api_name,
      Mandatory: item.mandatory,
    }))
  );

  // Convert custom fields data to worksheet
  const customFieldsWs = XLSX.utils.json_to_sheet(
    customFieldsData.map((item) => ({
      Label: item.label,
      "API Name": item.name,
      Placeholder: item.placeholder,
      "Field Type": item.field_type,
      "Drop Down Values": item.drop_down_values,
      "Dependent Fields": item.dependent_fields,
      "Dependent Field Value": item.dependent_field_value,
    }))
  );

  // Add the worksheets to the workbook
  XLSX.utils.book_append_sheet(wb, defaultWs, "Default");
  XLSX.utils.book_append_sheet(wb, customFieldsWs, "Custom Fields");

  // Generate the file
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
