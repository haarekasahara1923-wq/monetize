"use client";
import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '@/store/useAuth';

interface ChatProps {
  roomID: string;
}

const ChatInterface = ({ roomID }: ChatProps) => {
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !containerRef.current) return;

    const myMeeting = async () => {
      // In production, get this from your backend
      const appID = Number(process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID || 0);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET || "";
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, 
        serverSecret, 
        roomID, 
        user.id, 
        user.name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [{
          name: 'Personal link',
          url: window.location.origin + window.location.pathname + '?roomID=' + roomID,
        }],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    };

    myMeeting();
  }, [user, roomID]);

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-zinc-100 dark:border-white/5 shadow-2xl" ref={containerRef}>
      {/* Zego UI will be injected here */}
    </div>
  );
};

export default ChatInterface;
