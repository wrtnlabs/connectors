#!/usr/bin/env node

import { glob } from 'tinyglobby'
import fs from 'node:fs/promises'
import { join } from 'node:path'

const ROOT_DIR = join(import.meta.dirname, '..');

const IGNORE_PACKAGE_LIST = [
  'api',
  'backend',
  'shared'
];

const packages = await glob([
  'packages/*',
  ...IGNORE_PACKAGE_LIST.map(name => `!packages/${name}`)
], {
  onlyDirectories: true,
  absolute: true
});

/** extract package name from package.json */
const extractPackageInfo = async (packagePath) => {
  const packageJson = await fs.readFile(`${packagePath}/package.json`, 'utf8');
  const packageInfo = JSON.parse(packageJson);
  return {
    name: packageInfo.name,
    version: packageInfo.version
  };
};

const packageList = await Promise.all(packages.map(extractPackageInfo));

/** write package list to file */
await fs.writeFile(`${ROOT_DIR}/connectors-list.json`, JSON.stringify(packageList, null, 2));
