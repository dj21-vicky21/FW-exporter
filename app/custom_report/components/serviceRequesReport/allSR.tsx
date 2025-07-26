import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

export default function AllSR() {
  const workspaces = useAppStore.getState().getWorkspaces();

  const handleAllServiceRequestReport = (id: number | string) => {
    console.log("All Service Request Report", id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Request Report</CardTitle>
        <CardDescription>Select a workspace to get the report of service requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="w-full h-auto py-4 px-6 flex items-center justify-center text-center"
              onClick={() => handleAllServiceRequestReport(0)}
            >
              All
            </Button>
          {workspaces.map((workspace) => (
            <Button 
              key={workspace.id} 
              variant="outline" 
              className="w-full h-auto py-4 px-6 flex items-center justify-center text-center"
              onClick={() => handleAllServiceRequestReport(workspace.id)}
            >
              {workspace.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
