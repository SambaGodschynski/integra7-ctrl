import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Patchlist } from './components/patchlist/patchlist';
import { PatchCard } from './components/patchCard/patchCard';
import { PatchEditor } from './components/patchEditor/patchEditor';
import { IPatch } from './integra7/patch';

declare let io: any

function App() {

  var socket = io("localhost:12345/");
  socket.on('connect', function() {
      socket.emit('xxx', {data: 'I\'m connected!'});
  });

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
      <div style={{gridArea: "patchEditor"}}>
        <PatchEditor patch={patch}></PatchEditor>
      </div>
    </div>
  );
}

export default App;
