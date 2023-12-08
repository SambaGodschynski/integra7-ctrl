import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Patchlist } from './components/patchlist/patchlist';
import { PatchCard } from './components/patchCard/patchCard';
import { IPatch } from './integra7/patch';

function App() {
  const [patch, setPatch] = useState<IPatch>();
  const onPatchChanged = (patch: IPatch) => {
    setPatch(patch);
  };
  return (
    <div className="app">
      <div style={{gridArea: "patchList"}}>
        <Patchlist onSelect={onPatchChanged}></Patchlist>
      </div>
      <div style={{gridArea: "patchCard"}}>
        <PatchCard patch={patch}></PatchCard>
      </div>
    </div>
  );
}

export default App;
