"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-orange-400/20 border-orange-500 text-orange-500 font-normal">
        Fallback: Polling every 1s
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-green-500/20 border-green-500 text-green-500 font-normal">
      Live: Real-time updates
    </Badge>
  );
};