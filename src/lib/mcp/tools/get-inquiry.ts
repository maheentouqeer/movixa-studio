import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_inquiry",
  title: "Get inquiry",
  description: "Fetch the full details of a single Movixa contact inquiry by ID.",
  inputSchema: {
    id: z.string().uuid().describe("The inquiry UUID."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: "Not found" }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { inquiry: data },
    };
  },
});
