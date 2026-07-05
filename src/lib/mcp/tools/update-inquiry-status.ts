import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "update_inquiry_status",
  title: "Update inquiry status",
  description: "Update the workflow status of a Movixa contact inquiry.",
  inputSchema: {
    id: z.string().uuid().describe("The inquiry UUID."),
    status: z
      .enum(["new", "contacted", "in_progress", "completed", "closed"])
      .describe("The new status."),
    admin_notes: z.string().max(4000).optional().describe("Optional admin notes to save."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ id, status, admin_notes }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: Record<string, unknown> = { status };
    if (admin_notes !== undefined) patch.admin_notes = admin_notes;
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Updated ${id} to ${status}` }],
      structuredContent: { inquiry: data },
    };
  },
});
