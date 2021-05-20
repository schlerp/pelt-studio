import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import TopBar from "./components/TopBar";
import FlowDesigner from "./components/FlowDesigner";

const App = () => {
  return (
    <ReactFlowProvider>
      <TopBar mainTitle="PELT Studio" />
      <FlowDesigner flowKey="12345" />
    </ReactFlowProvider>
  );
};

export default App;
