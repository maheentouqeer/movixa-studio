import { defineMcp } from "@lovable.dev/mcp-js";
import listRecentInquiries from "./tools/list-recent-inquiries";
import getInquiry from "./tools/get-inquiry";
import updateInquiryStatus from "./tools/update-inquiry-status";

export default defineMcp({
  name: "movixa-mcp",
  title: "Movixa Studio MCP",
  version: "0.1.0",
  instructions:
    "Tools for the Movixa creative studio. Use `list_recent_inquiries` to browse recent contact form submissions, `get_inquiry` to read the full details of one, and `update_inquiry_status` to move an inquiry through the workflow.",
  tools: [listRecentInquiries, getInquiry, updateInquiryStatus],
});
