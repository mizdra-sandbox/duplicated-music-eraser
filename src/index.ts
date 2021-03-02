// usage: yarn run start '~/Music/iTunes/iTunes Media/Music' ~/Music/duplicated-music

import { mkdirSync, readdirSync, renameSync } from 'fs';
import { dirname, extname, join, parse, relative, resolve } from 'path';
import { prompt } from 'enquirer';

async function main() {
  // 重複している音楽ファイルが含まれているディレクトリ
  const dir = process.argv[2];
  // 重複している音楽ファイルを退避させるディレクトリ
  const savingDir = process.argv[3];
  if (dir === undefined) {
    throw new Error('<target-library> is required');
  }
  if (savingDir === undefined) {
    throw new Error('<saving-dir> is required');
  }

  console.log('Searching music files...');

  // from: https://blog.araya.dev/posts/2019-05-09/node-recursive-readdir.html
  const readdirRecursively = (dir: string, files: string[] = []) => {
    const dirents = readdirSync(dir, { withFileTypes: true });
    const dirs = [];
    for (const dirent of dirents) {
      if (dirent.isDirectory()) dirs.push(`${dir}/${dirent.name}`);
      if (dirent.isFile()) files.push(`${dir}/${dirent.name}`);
    }
    for (const d of dirs) {
      files = readdirRecursively(d, files);
    }
    return files;
  };

  const files = readdirRecursively(dir)
    .filter((filePath) => /^\.(m4a|mp3)$/.test(extname(filePath)))
    .map((filePath) => ({
      name: parse(filePath).name,
      path: filePath,
    }));
  const fileNames = files.map((file) => file.name);
  const duplicatedFiles = [];

  for (const file of files) {
    const result = /^(.*) \d+$/.exec(file.name);
    if (result === null) continue;
    const originalName = result[1];
    if (originalName === undefined) continue;
    if (!fileNames.includes(originalName)) continue;
    duplicatedFiles.push(file);
  }

  const renameMap = duplicatedFiles.map((file) => {
    const from = file.path;
    const to = join(savingDir, relative(resolve(dir), file.path));
    return { from, to };
  });
  console.log(renameMap);

  console.log(`All music files: ${files.length}`);
  console.log(`Duplicated music files: ${duplicatedFiles.length}`);

  const { isContinue } = await prompt<{ isContinue: boolean }>([
    {
      name: 'isContinue',
      type: 'confirm',
      message: 'Continue to move files?',
      initial: true,
    },
  ]);

  if (!isContinue) return;

  for (const { from, to } of renameMap) {
    console.log(`Moving ${from}`);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(from, to);
  }

  console.log('Complete!');
}

main().catch(console.error);
