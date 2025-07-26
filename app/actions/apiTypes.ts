interface ChoiceObject {
    id: string;
    value: string;
  }
  
  interface FieldOptions {
    visible_in_agent_portal: string;
    pdf: string;
    im_api_name: string;
    required_for_create: string;
    requester_can_edit: string;
    visible_in_public: string;
    required_for_closure: string;
    displayed_to_requester: string;
    placeholder: string;
    content_name?: string;
    section_info?: string;
    isSection?: string;
    [key: string]: string | undefined;
  }
  
  export type NestedChoice = [string, string, Array<[string, string]>];
  
  export interface CustomField {
    created_at: string;
    deleted: boolean;
    description: string | null;
    id: string;
    label: string;
    name: string;
    updated_at: string;
    field_options: FieldOptions;
    visible_in_portal: boolean;
    field_type: string;
    item_id: number;
    position: number;
    required: boolean;
    choices: Array<[string, string]>;
    nested_fields: CustomField[];
    nested_field_choices?: NestedChoice[];
    choice_obj?: ChoiceObject[];
    sections?: Array<{
      name: string;
      fields: CustomField[];
    }>;
    [key: string]: string | number | boolean | null | undefined | FieldOptions | object;
  }
  
  interface ServiceItemConfigs {
    attachment_mandatory: boolean;
    subject: string;
  }
  
  interface ServiceItemVisibilities {
    group_id: number[];
    workspace_ids?: number[];
  }
  
  export interface ServiceCatalogItem {
    service_item: {
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
      delivery_time: number;
      display_id: number;
      category_id: number;
      product_id: number | null;
      quantity: number | null;
      deleted: boolean;
      icon_name: string;
      group_visibility: number;
      agent_group_visibility: number;
      item_type: number;
      ci_type_id: number;
      visibility: number;
      workspace_id: number;
      cost_visibility: boolean;
      delivery_time_visibility: boolean;
      allow_attachments: boolean;
      allow_quantity: boolean;
      is_bundle: boolean;
      create_child: boolean;
      configs: ServiceItemConfigs;
      description: string;
      short_description: string;
      cost: string;
      group_visibilities_group_id: number[];
      agent_group_visibilities_group_id: number[];
      quantity_visibility: boolean;
      template_id: number | null;
      desc_un_html: string;
      agent_workspace_visibilities_workspace_id: number[];
      group_visibilities_item_id: number[];
      agent_group_visibilities: ServiceItemVisibilities;
      agent_workspace_visibilities: ServiceItemVisibilities;
      custom_fields: CustomField[]; // Can be made more specific if needed
      child_items: Array<{ mandatory: number; name: string; id: number }>; // Can be made more specific if needed
      icon_url: string;
      category_name?: string;
      workspace_name?: string;
    };
  }
  
  
  export interface ServiceCategory {
    service_category: {
      description: string;
      id: number;
      created_at: string;
      updated_at: string;
      name: string;
      workspace_id: number;
      position: number;
    };
  }
  
  
  export interface ServiceGroup {
    group: {
      id: number;
      name: string;
      description: string;
      escalate_to: number;
      unassigned_for: string;
      business_hours_id: number;
      created_at: string;
      updated_at: string;
      auto_ticket_assign: boolean;
      restricted: boolean;
      approval_required: boolean;
      ocs_schedule_id: number | null;
      workspace_id: number;
      members: number[];
      observers: number[];
      leaders: number[];
      members_pending_approval: number[];
      leaders_pending_approval: number[];
      observers_pending_approval: number[];
    };
  }

export interface AgentGroup {
    group: {
      id: number;
      name: string;
      description: string;
      escalate_to: number;
      unassigned_for: string;
      business_hours_id: number;
      created_at: string;
      updated_at: string;
      auto_ticket_assign: boolean;
      restricted: boolean;
      approval_required: boolean;
      ocs_schedule_id: number | null;
      workspace_id: number;
      members: number[];
      observers: number[];
      leaders: number[];
      members_pending_approval: number[];
      leaders_pending_approval: number[];
      observers_pending_approval: number[];
    };
  }

  export interface RequesterGroup {
    requester_group: {
      id: number;
      name: string;
      description: string | null;
      workspace_id: number;
      type: string;
    };
  }

  export interface Workspace {
    id: number;
    name: string;
    description: string;
    domains: string[];
  }

  export interface WorkspacesResponse {
    workspaces: {
      created_at: string;
      description: string | null;
      id: number;
      name: string;
      primary: boolean;
      restricted: boolean;
      state: string;
      template_name: string;
      type: string;
      updated_at: string;
    }[];
  }

  export interface WorkspaceResponse {
    workspace: {
      created_at: string;
      description: string | null;
      id: number;
      name: string;
      primary: boolean;
      restricted: boolean;
      state: string;
      template_name: string;
      type: string;
      updated_at: string;
    };
  }