"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("./Chat"), { ssr: false });

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params);
  return (
    <>
      <Chat id={id}/>
    </>
  );
}
