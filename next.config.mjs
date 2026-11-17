import createNextIntlPlugin from "next-intl/plugin";
import { approvedFrameOrigins } from "./content/experiments/approved-origins.mjs";

const withNextIntl = createNextIntlPlugin();
export default withNextIntl({
  async headers() {
    return [{
      source: "/:path*",
      headers: [{
        key: "Content-Security-Policy",
        value: `frame-src ${approvedFrameOrigins.join(" ") || "'none'"}`,
      }],
    }];
  },
});
