import type { MetadataRoute } from "next";

// Web app manifest so the chat can be installed on the guest-room tablets
// ("Add to Home Screen" → full-screen app opening straight into /chat).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ask Kashiwaya — guest assistant",
    short_name: "Ask Kashiwaya",
    description:
      "Kashiwaya Inn guest assistant — meals, e-bikes, hiking routes and everything Nagiso.",
    id: "/chat",
    start_url: "/chat",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f5efe2",
    theme_color: "#2f3d24",
    icons: [
      { src: "/icons/chat-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/chat-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
