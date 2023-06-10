import { ArtifactStore, startRailgunEngine } from "@railgun-community/quickstart";
import localforage from 'localforage';
import LevelDB from 'level';
import { createArtifactStore } from "./createArtifactStore";

const initialize = ():void => {
    console.log("Yeah!");

    const walletName = "privyfi wallet";
    const db = new LevelDB.Level("engine.db");

    const debuhMode = true;

    const artifactStore = createArtifactStore('artifacts');
    const useNativeArtifacts = false;

    const loadMerkleTreeScans = false;

    return startRailgunEngine(walletName, db, debuhMode, artifactStore, useNativeArtifacts, loadMerkleTreeScans);
}

initialize();

export default {initialize}