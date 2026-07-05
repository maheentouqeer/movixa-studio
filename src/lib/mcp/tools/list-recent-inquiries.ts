import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_recent_inquiries",
  title: "List recent inquiries",
  description:
    "List the most recent contact form inquiries submitted to Movixa, with optional status filter.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(10)
      .describe("Maximum number of inquiries to return (1-50)."),
    status: z
      .enum(["new", "contacted", "in_progress", "completed", "closed"])
      .optional()
      .describe("Optional status filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, status }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin
      .from("contact_submissions")
      .select(
        "id, full_name, company_name, email, country, service_required, estimated_budget, project_timeline, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { inquiries: data ?? [] },
    };
  },
});
