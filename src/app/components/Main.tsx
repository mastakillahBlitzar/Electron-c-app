import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");

export const Main = () => {
  const [appName, setAppName] = useState(null);

  useEffect(() => {
    ipcRenderer.on("greeting", (event: any, appN: string) => {
      setAppName(appN);
    });
    return () => {
      ipcRenderer.removeAllListeners("greeting");
    };
  }, []);

  return <div>Hello From the new {appName}</div>;
};
