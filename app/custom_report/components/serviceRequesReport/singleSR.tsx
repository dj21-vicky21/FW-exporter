import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { handleCaches, verifyAuth } from "@/lib/utils";
import { viewServiceRequest, viewServiceRequestCategory, viewWorkspace } from "@/app/actions/api";
import { DataTable } from "./table/data-table";
import {
  columnsCustomFields,
  columnsDefault,
  SRDefaultHeader,
  SRCustomFieldHeader,
} from "./table/column";
import {
  getCustomFieldDetails,
  handlerFormateSingleSRData,
  downloadExcelFile,
} from "./handler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TruncatedText } from "../../../../components/TruncatedText";
import { useAppStore } from "@/lib/store";
import { ServiceCatalogItem } from "@/app/actions/apiTypes";

export default function SingleSR() {
  const [displayId, setDisplayId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [srData, setSrData] = useState<ServiceCatalogItem>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [formattedDefaultData, setFormattedDefaultData] = useState<
    SRDefaultHeader[]
  >([]);
  const [formattedCustomFieldData, setFormattedCustomFieldData] = useState<
    SRCustomFieldHeader[]
  >([]);

  const handleSubmit = async () => {
    try {
      // Validate session first
      const isAuthVerified = await verifyAuth();
      if (!isAuthVerified) {
        toast.error("Authentication Failed", {
          description: "Please reconnect to continue",
        });
        return;
      }

      const storedData = useAppStore.getState().getAuth();

      // Validate input
      const numericId = parseInt(displayId, 10);
      if (isNaN(numericId) || numericId <= 0) {
        toast.error("Invalid ID", {
          description: "Please enter a valid positive number",
        });
        return;
      }

      setIsLoading(true);
      const serviceRequestRes = await viewServiceRequest(numericId, storedData);
      const { name, description, short_description, display_id, custom_fields, category_id, workspace_id} = serviceRequestRes?.service_item
      const cachedItem = useAppStore.getState().getCachedItem(category_id)
      let categoryName = "";
      
      // Resolving the category name
      if(!cachedItem){
        const categoryRes = await viewServiceRequestCategory(category_id, storedData);
        if(categoryRes && serviceRequestRes){
          console.log("--> ~ Category api called for category id:", category_id)
          categoryName = categoryRes.service_category.name
          handleCaches(category_id, categoryName);
        }
      }else{
        categoryName = cachedItem.name
      }

      serviceRequestRes.service_item['category_name'] = categoryName

      const cachedWorkspace = useAppStore.getState().getCachedItem(workspace_id)
      let workspaceName;
      // Resolving the category name
      if(!cachedWorkspace){
        const workspaceRes = await viewWorkspace(workspace_id, storedData);
        if(workspaceRes && serviceRequestRes){
          console.log("--> ~ Workspace api called for workspace id:", workspace_id)
          workspaceName = workspaceRes.workspace.name
          handleCaches(workspace_id, workspaceName, "workspace");
        }
      }else{
          workspaceName = cachedWorkspace.name
      }
      serviceRequestRes.service_item['workspace_name'] = workspaceName

      setSrData(serviceRequestRes);
      handleCaches(displayId, name);
      setName(name);
      setDescription(description);
      setShortDescription(short_description);
      setDisplayId(display_id.toString());

      const formattedtheDefaultData = await handlerFormateSingleSRData(serviceRequestRes);
      const formattedtheCustomFieldData = getCustomFieldDetails(
        custom_fields
      );
      setFormattedDefaultData(formattedtheDefaultData);
      setFormattedCustomFieldData(formattedtheCustomFieldData);
    } catch (error) {
      toast.error("Failed to fetch report", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (
      formattedDefaultData.length > 0 ||
      formattedCustomFieldData.length > 0
    ) {
      downloadExcelFile(
        formattedDefaultData,
        formattedCustomFieldData,
        `${name}_${displayId}`
      );
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Service Request Report</CardTitle>
          <CardDescription>Enter display id to get the report</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="grid gap-3">
            <Label htmlFor="single-sr-display-id">
              Service request display ID
            </Label>
            <Input
              id="single-sr-display-id"
              className="w-fit"
              type="number"
              value={displayId}
              onChange={(e) => setDisplayId(e.target.value)}
              placeholder="Enter SR ID"
            />
          </div>
          {srData && (
            <div className="grid gap-3">
              <div>
                <strong>SR Name:</strong> {name}
              </div>
              <div>
                <strong>Display ID:</strong> {displayId}
              </div>
              <div>
                <strong>Short Description:</strong>
                <TruncatedText text={shortDescription} maxLines={3} />
              </div>
              <div>
                <strong>Description:</strong>
                <TruncatedText text={description} maxLines={3} />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between gap-4">
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Loading..." : "Get report"}
            </Button>
            <Button onClick={handleDownload} disabled={!name}>
              Download Excel
            </Button>
          </div>
        </CardFooter>
      </Card>
      {formattedDefaultData.length > 0 && (
        <Tabs defaultValue="Default" className="mt-4">
          <TabsList>
            <TabsTrigger value="Default">Default</TabsTrigger>
            <TabsTrigger value="Custom fields">Custom fields</TabsTrigger>
          </TabsList>
          <TabsContent value="Default">
            <div className="mt-4">
              <DataTable columns={columnsDefault} data={formattedDefaultData} />
            </div>
          </TabsContent>
          <TabsContent value="Custom fields">
            <div className="mt-4">
              <DataTable
                columns={columnsCustomFields}
                data={formattedCustomFieldData}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
