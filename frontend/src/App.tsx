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
    <div className="App">
      <Patchlist onSelect={onPatchChanged}></Patchlist>
      <PatchCard patch={patch}></PatchCard>
    </div>
  );
}

export default App;
