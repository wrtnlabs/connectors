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
  const { name } = JSON.parse(packageJson);
  return name;
};

const connectors = await Promise.all(packages.map(extractPackageInfo));

connectors.sort((a, b) => a.localeCompare(b));

/** get version from root package.json */
const rootPackageJson = await fs.readFile(`${ROOT_DIR}/package.json`, 'utf8');
const { version } = JSON.parse(rootPackageJson);

const connectorsListData = {
  connectors,
  version,
};

/** write package list to file */
await fs.writeFile(`${ROOT_DIR}/connectors-list.json`, JSON.stringify(connectorsListData, null, 2));
