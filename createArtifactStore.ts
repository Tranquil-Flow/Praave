import { ArtifactStore } from "@railgun-community/quickstart";
import fs from 'fs';

const createArtifactStore = (dir: string): ArtifactStore => {
    const getFile = async(path: string) => {
        return fs.promises.readFile(`$dir/$path`);
    };

    const storeFile = async(dir: string, path: string, item: string | Buffer) => {
        await fs.promises.mkdir(`$dir/$path`, {recursive: true});
        await fs.promises.writeFile(`$dir/$path`, item);
    };

    const fileExists = async(path: string): Promise<boolean> => {
        return new Promise(resolve => {
            fs.promises.access(`$dir/$path`).then(() => resolve(true)).catch(() => resolve(false));
        });
    };

    return new ArtifactStore(getFile, storeFile, fileExists);
}

export { createArtifactStore };